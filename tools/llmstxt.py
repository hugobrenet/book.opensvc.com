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
page of a missing URL 404.md, its html layout removed, as the html pages
link them. The keyword
reference, generated and as large as the rest of the book together, is
listed under "Optional", the section the format names for what a reader may
skip: the summary of each kind and the pages of the reference, not the
hundreds of sections the summaries list, for the index to stay one a model
reads whole.

What a page is about is the description its source gives in a comment, its
first lines, as a page of Mintlify gives it in the description of its front
matter, mdbook having none:

    <!-- llms: How to install the agent packages, on Debian, Ubuntu, ... -->
    # Install

It is the one source: nothing is guessed from the text. The comment is not
published. The keyword reference, generated, describes its pages itself.

A page of the summary mdbook did not render, a page with no description, or
one longer than MAX_DESCRIPTION characters, fails the whole:
an index never lists a page that is not there, nor one it cannot say what it
is about.

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
# A line of html, the layout of a page written for the browser.
HTML_LINE = re.compile(r"^[ \t]*</?[A-Za-z][^>]*>.*(?:\n|$)", re.M)
# DESCRIPTION is the description a page gives of itself, for the index.
DESCRIPTION = re.compile(r"<!--\s*llms:\s*(.*?)\s*-->\n?", re.S)
# MAX_DESCRIPTION bounds a description: one line of the index.
MAX_DESCRIPTION = 200


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


def note(path, text):
    """What the index says of a page: the description its source gives, its
    whitespace folded; for a page of the keyword reference, generated, what
    it documents. None when a page written by hand gives none."""
    if path.startswith(KEYWORDS):
        parts = path[len(KEYWORDS):-len(".md")].split("/")
        if parts == ["changes"]:
            return "What each release of the agent added, removed and changed in the keywords."
        if parts == ["removed"]:
            return "The keywords the agent no longer has, and the release that removed each."
        if len(parts) == 2 and parts[1] == "SUMMARY":
            return f"The sections of the {parts[0]} configuration, each with its keywords."
        if len(parts) == 2:
            return f"The keywords of the `{parts[1]}` sections of the {parts[0]} configuration."
    given = DESCRIPTION.search(text)
    if given:
        return " ".join(given.group(1).split()) or None
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

    # Every page written by hand says what it is about, and in one line.
    undescribed, long = [], []
    for _, pages in parts:
        for _, path in pages:
            with open(os.path.join(args.markdown, path)) as f:
                summary = note(path, f.read())
            if summary is None:
                undescribed.append(path)
            elif summary and len(summary) > MAX_DESCRIPTION:
                long.append(f"{path} ({len(summary)})")
    if undescribed:
        print("pages with no description, an <!-- llms: ... --> comment for a page written by hand, "
              "a case of note() for a page of the keyword reference: " + ", ".join(undescribed), file=sys.stderr)
    if long:
        print(f"descriptions longer than {MAX_DESCRIPTION} characters: " + ", ".join(long), file=sys.stderr)
    if undescribed or long:
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
    # has no include to resolve. Its html is the layout of the page and the
    # buttons a script fills for the browser: the text is what is left.
    missing_page = config.get("output", {}).get("html", {}).get("input-404", "404.md")
    with open(os.path.join(os.path.dirname(args.summary), missing_page)) as f:
        text = HTML_LINE.sub("", ICON.sub("", f.read()))
        write("404.md", re.sub(r"\n{3,}", "\n\n", text).strip() + "\n")

    with open(os.path.join(args.out, "llms.txt"), "w") as f:
        f.write("\n".join(index) + "\n")
    with open(os.path.join(args.out, "llms-full.txt"), "w") as f:
        f.write("\n".join(full))


if __name__ == "__main__":
    main()
