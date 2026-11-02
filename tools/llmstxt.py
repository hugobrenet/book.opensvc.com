#!/usr/bin/env python3
"""Publish the book for the language models, after https://llmstxt.org.

The html pages are for a browser. A model, or an assistant searching the
book, reads markdown better and smaller: this lays each page of the summary
next to its html page, as <page>.md, and writes two files at the root:

    llms.txt       the index: the title of the book, what it is, the build
                   it is and the agent release its keyword reference
                   documents, then one line per page, its link, its title under
                   those of the chapters above it, and what it is about,
                   under the part of the summary it is in.
    llms-full.txt  the agent release of the keyword reference, then every
                   page of the index but the optional ones, one after the
                   other.

The pages are the markdown mdbook renders, its includes resolved, the icons
they insert removed. The home page, the first chapter, is index.md, and the
page of a missing URL 404.md, as the html pages link them. The keyword
reference, generated and as large as the rest of the book together, is
listed under "Optional", the section the format names for what a reader may
skip: the summary of each kind and the pages of the reference, not the
hundreds of sections the summaries list, for the index to stay one a model
reads whole.

What a page is about is the description its source gives in a comment,
<!-- llms: ... -->, else its first sentence that stands alone: not one that
announces a list or a configlet, nor one that leans on what comes before
it, such as "In this case". The comment is not published.

A page of the summary mdbook did not render fails the whole: an index never
lists a page that is not there.

Usage:
    llmstxt.py --summary src/SUMMARY.md --markdown <markdown build> \\
        --out <html build> --build "866cbf4 2026-11-02" \\
        --keywords-index src/agent.reference.keywords/index.json

The release is the one only the keyword reference is tied to, the prose
following the main branch: the line says so, "Keyword reference: OpenSVC
agent v3.0.0-rc56.", for a reader to compare it with the agent it runs. A
book with no keyword index has no such line.

The links are relative to llms.txt: a mirror of the book serves its own.
"""

import argparse
import json
import os
import re
import sys
import tomllib

# OPTIONAL are the parts of the summary listed as optional: their title
# starts with one of these.
OPTIONAL = ("Agent Keywords Reference",)
# KEYWORDS is the directory of the keyword reference: a page of it is one
# section of the configuration of a kind, <kind>/<section>.md, and its first
# sentence a configlet rather than prose.
KEYWORDS = "agent.reference.keywords/"

PART = re.compile(r"^# (.+?)\s*$")
CHAPTER = re.compile(r"^(\s*)- \[(.+?)\]\((.*?)\)\s*$")
ICON = re.compile(r'<i class="fa[^"]*"[^>]*></i>')
# DESCRIPTION is the description a page gives of itself, for the index.
DESCRIPTION = re.compile(r"<!--\s*llms:\s*(.*?)\s*-->\n?", re.S)
# LEANING starts a sentence that leans on what comes before it. "This page"
# or "This driver" names what the page is about, and stands alone.
LEANING = re.compile(r"^(?:In (?:this|that|such) case|It|Its|They|Their|Then|Here|Thus|Hence|So|Such|These|Those|That|"
                     r"Otherwise|Also|Likewise|The following|Once|This(?! (?:page|chapter|section|driver|howto|guide|book|document)\b))\b")
LINK = re.compile(r"!?\[([^\]]*)\]\([^)]*\)")
# TAG is an html element of the prose; a placeholder such as <name>, in code
# or not, is text.
TAG = re.compile(r"</?(a|abbr|b|br|code|div|em|i|kbd|small|span|strong|sub|sup)\b[^>]*>")
# MARKS open a line of the book without being words, such as its info sign.
MARKS = "🛈⚠ "
END = re.compile(r"[.!?](?=\s|$)")
# ABBREVIATIONS end with a dot and no sentence.
ABBREVIATIONS = ("e.g", "i.e", "etc", "vs", "cf")
MAX_NOTE = 200
MIN_NOTE_WORDS = 4


def chapters(summary):
    """The parts of the summary, in order, each with its chapters as (title,
    path), the title under those of the chapters above it, such as
    "Configure > Node", and under its part when another part has the same,
    such as "AI Assistant > Install". The chapters before the first part form
    a part named after the book; a draft chapter, with no page, titles those
    below it."""
    parts = [[None, []]]
    above = []
    with open(summary) as f:
        for line in f:
            match = PART.match(line)
            if match:
                if match.group(1) != "Summary":
                    parts.append([match.group(1), []])
                above = []
                continue
            match = CHAPTER.match(line)
            if not match:
                continue
            indent, title, path = len(match.group(1).expandtabs()), match.group(2), match.group(3)
            while above and above[-1][0] >= indent:
                above.pop()
            above.append((indent, title))
            if path.endswith(".md"):
                parts[-1][1].append((" > ".join(t for _, t in above), path))
    parts = [part for part in parts if part[1]]
    seen = {}
    for _, pages in parts:
        for title, _ in pages:
            seen[title] = seen.get(title, 0) + 1
    return [[part, [((f"{part} > {title}" if part and seen[title] > 1 else title), path) for title, path in pages]] for part, pages in parts]


def paragraphs(text):
    """The paragraphs of prose of a page, in order: its headings, html,
    tables, quotes, lists and code apart, each on one line, links and tags
    reduced to their text."""
    fenced = False
    paragraph = []
    for line in text.splitlines() + [""]:
        stripped = line.strip()
        if stripped.startswith("```"):
            fenced = not fenced
            continue
        # Prose starts at the margin: an indented line is code, or the rest
        # of a list item; a line of cells is a table.
        prose = not fenced and stripped and not line[0].isspace() and stripped.count("|") < 2 and \
            not stripped.startswith(("#", "<", ">", "*", "-", "!", "+"))
        if prose:
            paragraph.append(stripped)
        elif paragraph:
            yield TAG.sub("", LINK.sub(r"\1", " ".join(paragraph)))
            paragraph = []


def sentences(paragraph):
    """The sentences of a paragraph, an abbreviation such as e.g. ending
    none."""
    start = 0
    for end in END.finditer(paragraph):
        before = paragraph[start:end.start()].rsplit(" ", 1)[-1].lower()
        if before in ABBREVIATIONS:
            continue
        yield paragraph[start:end.end()].strip()
        start = end.end()
    if paragraph[start:].strip():
        yield paragraph[start:].strip()


def note(path, text):
    """What the index says of a page: the description it gives of itself, else
    the first sentence of its prose that stands alone, not one that announces
    a list or a configlet nor one that leans on what comes before, cut to
    MAX_NOTE characters; for the keyword reference, what section it
    documents. None rather than a sentence that says nothing."""
    given = DESCRIPTION.search(text)
    if given:
        return " ".join(given.group(1).split())
    if path.startswith(KEYWORDS):
        parts = path[len(KEYWORDS):-len(".md")].split("/")
        if len(parts) == 2 and parts[1] == "SUMMARY":
            return f"The sections of the {parts[0]} configuration, each with its keywords."
        if len(parts) == 2:
            return f"The keywords of the `{parts[1]}` sections of the {parts[0]} configuration."
    for paragraph in paragraphs(text):
        for sentence in sentences(paragraph):
            sentence = sentence.lstrip(MARKS)
            # A sentence starts with a word: "=> node ..." is output.
            if not sentence or not (sentence[0].isalnum() or sentence[0] in "`*_"):
                continue
            if sentence.endswith(":") or " = " in sentence or len(sentence.split()) < MIN_NOTE_WORDS or LEANING.match(sentence):
                continue
            if len(sentence) > MAX_NOTE:
                sentence = sentence[: MAX_NOTE - 1].rsplit(" ", 1)[0] + "…"
            return sentence
    return None


def indexed(path):
    """Whether the index lists a page of the optional part: the keyword
    reference lists the summary of each kind and its own pages, a section
    of a kind being reached from the summary of its kind."""
    rest = path[len(KEYWORDS):] if path.startswith(KEYWORDS) else path
    return "/" not in rest or rest.endswith("/SUMMARY.md")


def keyword_release(path):
    """The agent release the keyword reference documents, as make kw wrote
    it in its index; None when the book has no index."""
    if not path or not os.path.isfile(path):
        return None
    with open(path) as f:
        release = json.load(f).get("version")
    if not isinstance(release, str) or not release.strip():
        sys.exit(f"{path}: no version")
    return release.strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--summary", required=True, help="the SUMMARY.md mdbook built")
    parser.add_argument("--markdown", required=True, help="the output of the mdbook markdown renderer")
    parser.add_argument("--out", required=True, help="the html build to lay the files in")
    parser.add_argument("--build", required=True, help="the build, such as a commit and a date")
    parser.add_argument("--config", default="book.toml", help="the mdbook configuration")
    parser.add_argument("--keywords-index", help="the index.json of the keyword reference, which names its release")
    args = parser.parse_args()

    with open(args.config, "rb") as f:
        config = tomllib.load(f)
    book = config["book"]

    index = [f"# {book['title']}", "", f"> {book['description']}", "", f"Build: {args.build}."]
    optional = []
    full = []
    release = keyword_release(args.keywords_index)
    if release:
        index += ["", f"Keyword reference: OpenSVC agent {release}."]
        full.append(f"Keyword reference: OpenSVC agent {release}.\n")
    parts = chapters(args.summary)
    missing = [path for _, pages in parts for _, path in pages if not os.path.isfile(os.path.join(args.markdown, path))]
    if missing:
        print("pages of the summary not rendered: " + ", ".join(missing), file=sys.stderr)
        sys.exit(1)

    def write(path, text):
        target = os.path.join(args.out, path)
        os.makedirs(os.path.dirname(target) or ".", exist_ok=True)
        with open(target, "w") as f:
            f.write(text)

    for number, (part, pages) in enumerate(parts):
        lines = []
        for title, path in pages:
            with open(os.path.join(args.markdown, path)) as f:
                text = ICON.sub("", f.read())
            summary = note(path, text)
            text = DESCRIPTION.sub("", text, count=1)
            write(path, text)
            # The home page is the first chapter, as mdbook writes it to
            # index.html.
            if number == 0 and not lines:
                write("index.md", text)
            optional_part = (part or "").startswith(OPTIONAL)
            if not optional_part or indexed(path):
                lines.append(f"- [{title}]({path})" + (f": {summary}" if summary else ""))
            if not optional_part:
                full.append(f"<!-- {path} -->\n\n{text.strip()}\n")
        if (part or "").startswith(OPTIONAL):
            optional += lines
        else:
            index += ["", f"## {part or book['title']}", ""] + lines
    if optional:
        index += ["", "## Optional", ""] + optional

    # The page mdbook shows for a missing URL is no chapter, and its source
    # has no include to resolve.
    missing_page = config.get("output", {}).get("html", {}).get("input-404", "404.md")
    with open(os.path.join(os.path.dirname(args.summary), missing_page)) as f:
        write("404.md", ICON.sub("", f.read()))

    with open(os.path.join(args.out, "llms.txt"), "w") as f:
        f.write("\n".join(index) + "\n")
    with open(os.path.join(args.out, "llms-full.txt"), "w") as f:
        f.write("\n".join(full))


if __name__ == "__main__":
    main()
