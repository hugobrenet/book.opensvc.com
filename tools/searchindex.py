#!/usr/bin/env python3
"""Write the index the search of the book reads, theme/search.js.

mdbook indexes every heading of every page as one document, and the keyword
reference is most of the book: the same keyword is documented once per driver
and per kind it applies to, restart forty times, so a search for it lists
forty identical results and none of the pages that explain it. This indexes
the two halves of the book apart:

    pages     the pages of the documentation, each with the path of its
              chapters, such as "Configure > Cluster Quorum", what it is
              about, the description its source gives the language models,
              and the part of the summary it is in.
    sections  the headings of those pages, down to the third level, each with
              its text: a result is a heading, shown under its page.
    keywords  the keywords of the reference, one entry per name, with every
              driver and kind it applies to: a result is a keyword, and the
              drivers are where it is documented. A keyword is linked as
              <kind>/<driver>.html#<anchor>, the anchor given once.
    drivers   the drivers and sections of the reference, such as fs.ext4 or
              DEFAULT, one entry per name, with every kind they are of. A
              driver is found by its name: its page has the configlet of the
              driver, and the keywords it lists are found as keywords.

The text is the one mdbook renders, its includes resolved: the html pages of
the build are read rather than the markdown. The pages of the keyword
reference that only list others, and the timeline of its changes, are left
out: they name every keyword, and answer no search.

Usage:
    searchindex.py --summary src/SUMMARY.md --src src --html book \\
        --out book/searchindex.json
"""

import argparse
import collections
import html.parser
import json
import os
import re
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from llmstxt import DESCRIPTION, KEYWORDS, chapters  # noqa: E402

VERSION = 1
# SKIPPED are the pages of the keyword reference no search is answered by.
SKIPPED = re.compile(r"^" + re.escape(KEYWORDS) + r"(changes|removed|[^/]+/SUMMARY)\.md$")
# KINDS orders the kinds of a keyword: the first is where it is linked.
KINDS = ("svc", "vol", "node", "cluster", "cfg", "sec", "usr")
# A heading of the reference: "Driver `fs.ext4`", "Section `DEFAULT`",
# "Keyword `install`".
REFERENCE_HEADING = re.compile(r"^(Driver|Section|Keyword)\s+(\S+)$")
# MAX_DESCRIPTION bounds what is kept of the description of a keyword: the
# line a result shows, and enough words to be found by.
MAX_DESCRIPTION = 600

BLOCKS = {
    "address", "article", "aside", "blockquote", "br", "dd", "details", "div",
    "dl", "dt", "figcaption", "figure", "footer", "header", "hr", "li", "ol",
    "p", "pre", "section", "summary", "table", "td", "th", "tr", "ul",
}
IGNORED = {"script", "style", "svg", "button", "template"}
SPLIT = {"h1", "h2", "h3"}


class Page(html.parser.HTMLParser):
    """The sections of the <main> of a rendered page: (level, id, heading,
    text), the text before the first heading under an empty one."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sections = []
        self.main = 0
        self.ignored = 0
        self.heading = None
        self.text = []

    def handle_starttag(self, tag, attrs):
        if tag == "main":
            self.main += 1
            return
        if not self.main:
            return
        if tag in IGNORED:
            self.ignored += 1
            return
        if tag in SPLIT:
            # A tag left open in the text before, such as a <template> the
            # markdown of a description meant as a placeholder, ends there:
            # it does not hide the rest of the page.
            self.ignored = 0
            self.heading = [int(tag[1]), dict(attrs).get("id") or "", []]
            return
        if tag in BLOCKS or re.fullmatch(r"h[4-6]", tag):
            self.write(" ")

    def handle_endtag(self, tag):
        if tag == "main":
            self.main -= 1
            return
        if not self.main:
            return
        if tag in IGNORED:
            self.ignored = max(0, self.ignored - 1)
            return
        if tag in SPLIT and self.heading:
            self.flush()
            level, ident, words = self.heading
            heading = squeeze("".join(words))
            # The text before the first heading is the head of its section.
            if len(self.sections) == 1 and not self.sections[0][2]:
                self.sections[0][:3] = [level, ident, heading]
            else:
                self.sections.append([level, ident, heading, []])
            self.heading = None
            return
        if tag in BLOCKS or re.fullmatch(r"h[4-6]", tag):
            self.write(" ")

    def handle_data(self, data):
        if self.main and not self.ignored:
            self.write(data)

    def write(self, data):
        if self.heading:
            self.heading[2].append(data)
        else:
            self.text.append(data)

    def flush(self):
        text = squeeze("".join(self.text))
        self.text = []
        if not text:
            return
        if not self.sections:
            self.sections.append([1, "", "", []])
        self.sections[-1][3].append(text)

    def close(self):
        super().close()
        self.flush()
        return [(level, ident, heading, " ".join(text)) for level, ident, heading, text in self.sections]


def squeeze(text):
    return re.sub(r"\s+", " ", text).strip()


def sections(path):
    """The sections of the rendered page at path."""
    parser = Page()
    with open(path, encoding="utf-8") as f:
        parser.feed(f.read())
    return parser.close()


def description(path):
    """What the source page at path says it is about, or ""."""
    try:
        with open(path, encoding="utf-8") as f:
            match = DESCRIPTION.search(f.read(4096))
    except OSError:
        return ""
    return squeeze(match.group(1)) if match else ""


def location(kind, driver, anchor):
    """The link of a keyword of the reference, as theme/search.js makes it."""
    return f"{KEYWORDS}{kind}/{driver}.html#{anchor}"


def rendered(html_dir, path):
    """The rendered page of the source page at path, which must be there."""
    page = os.path.join(html_dir, html_of(path))
    if not os.path.exists(page):
        raise SystemExit(f"{page}: not rendered, is the book built?")
    return page


def clip(text, size):
    """The text, cut at the end of the last word within size."""
    if len(text) <= size:
        return text
    cut = text.rfind(" ", 0, size + 1)
    return text[:cut if cut > size // 2 else size].rstrip()


def html_of(path):
    return re.sub(r"\.md$", ".html", path)


def first_sentence(text):
    match = re.match(r"(.+?[.!?])(\s|$)", text)
    return match.group(1) if match else text


def keyword_parts(text):
    """The metadata, example and description of the text of a keyword of the
    reference, as rendered: "required: false ... Example: ... Description:
    ..."."""
    meta, _, rest = text.partition("Description:")
    if not rest:
        return "", text.strip()
    meta = meta.split("Example:")[0]
    return meta.strip(), rest.strip()


def reference(index, pages, html_dir):
    """Add the keywords and drivers of the reference pages to index."""
    keywords = collections.OrderedDict()
    drivers = collections.OrderedDict()
    for path in pages:
        kind = path[len(KEYWORDS):].split("/")[0]
        url = html_of(path)
        driver = None
        for level, ident, heading, text in sections(rendered(html_dir, path)):
            match = REFERENCE_HEADING.match(heading)
            if not match:
                continue
            what, name = match.groups()
            if what in ("Driver", "Section"):
                driver = name
                entry = drivers.setdefault(name, {"what": what.lower(), "where": []})
                entry["where"].append((kind, url + "#" + ident))
                continue
            meta, desc = keyword_parts(text)
            entry = keywords.setdefault(name, {"where": [], "texts": collections.Counter(), "anchor": ident})
            # A keyword is linked as <kind>/<driver>.html#<anchor>, its
            # anchor the same on every page: one that is not, or a page not
            # named after its driver, keeps its own link.
            own = url if url != location(kind, driver or "", entry["anchor"]).split("#")[0] or ident != entry["anchor"] else None
            entry["where"].append((kind, driver or "", url + "#" + ident if own else None))
            entry["texts"][desc] += 1

    order = {kind: i for i, kind in enumerate(KINDS)}
    for name, entry in keywords.items():
        # The description most of the drivers give, then those of the others
        # for the words they add, within MAX_DESCRIPTION.
        texts = [text for text, _ in entry["texts"].most_common()]
        main = texts[0] if texts else ""
        more = " ".join(texts[1:])
        where = sorted(entry["where"], key=lambda w: (w[1] != "DEFAULT", order.get(w[0], 99), w[1]))
        index["keywords"].append([
            name,
            entry["anchor"],
            [[kind, driver] + ([url] if url else []) for kind, driver, url in where],
            clip(first_sentence(main), 200),
            clip((main + " " + more).strip(), MAX_DESCRIPTION),
        ])
    for name, entry in drivers.items():
        where = sorted(entry["where"], key=lambda w: order.get(w[0], 99))
        index["drivers"].append([
            name,
            entry["what"],
            [[kind, url] for kind, url in where],
        ])


def build(summary, src_dir, html_dir):
    index = {"version": VERSION, "pages": [], "sections": [], "keywords": [], "drivers": []}
    keyword_pages = []
    seen = set()
    for part, pages in chapters(summary):
        for title, path in pages:
            if path in seen:
                continue
            seen.add(path)
            if path.startswith(KEYWORDS):
                if not SKIPPED.match(path):
                    keyword_pages.append(path)
                continue
            url = html_of(path)
            page_html = rendered(html_dir, path)
            names = title.split(" > ")
            # The part of the summary a page is in is shown above its
            # chapters, not searched: every page of a part would match it.
            # A chapter named after its part keeps its name.
            if part and len(names) > 1 and names[0] == part:
                names = names[1:]
            page = len(index["pages"])
            index["pages"].append([url, names[-1], " > ".join(names[:-1]), description(os.path.join(src_dir, path)), part or ""])
            for level, ident, heading, text in sections(page_html):
                # The first heading of a page is the page: its link is the
                # page's, not an anchor that scrolls past its top.
                anchor = "" if not index["sections"] or index["sections"][-1][0] != page else ident
                index["sections"].append([page, anchor, heading or names[-1], text])
    reference(index, keyword_pages, html_dir)
    return index


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--summary", required=True)
    parser.add_argument("--src", required=True)
    parser.add_argument("--html", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    index = build(args.summary, args.src, args.html)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{args.out}: {len(index['pages'])} pages, {len(index['sections'])} sections, "
          f"{len(index['keywords'])} keywords, {len(index['drivers'])} drivers, "
          f"{os.path.getsize(args.out) // 1024} KiB")


if __name__ == "__main__":
    main()
