#!/usr/bin/env python3
"""Tests of llmstxt.py, on a book of a few pages laid out as mdbook builds it.

    python3 -B -m unittest tools/llmstxt_test.py
"""

import contextlib
import importlib.util
import io
import json
import os
import sys
import tempfile
import unittest

_spec = importlib.util.spec_from_file_location("llmstxt", os.path.join(os.path.dirname(os.path.abspath(__file__)), "llmstxt.py"))
llmstxt = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(llmstxt)

CONFIG = """[book]
title = "OpenSVC"
description = "Documents the purpose and usage of the OpenSVC infrastructure tools."

[output.html]
input-404 = "not-found.md"
"""

SUMMARY = """# Summary

- [Introduction](preamble/introduction.md)

# Agent

- [Install](agent/install.md)
- [Configure](agent/configure.md)
  - [Node](agent/configure.base.md)
  - [Cluster Quorum](agent/configure.quorum.md)

# AI Assistant

- [Install](ai/install.md)

# Agent Keywords Reference (v3.0.0-rc56)

- [svc](agent.reference.keywords/svc/SUMMARY.md)
  - [DEFAULT](agent.reference.keywords/svc/DEFAULT.md)
"""

# BODIES are the pages as written, DESCRIPTIONS the comment each page written
# by hand opens on, PAGES the two together, as mdbook renders them.
BODIES = {
    "preamble/introduction.md": "# Introduction\n\nOpenSVC is an open-source software product.\n",
    "agent/install.md": "# Install\n\n## Branch\n\nWe feed packages in 3 different branches:\n\n* `dev` is unstable.\n",
    "agent/configure.md": "# Configure\n\nThe agent uses `ini` configuration files.\n",
    "agent/configure.base.md": "# Node\n\n\tsudo om cluster config update --set node.env=PRD\n",
    "agent/configure.quorum.md": '# Cluster Quorum\n\n<i class="fa-solid fa-server" style="color:cornflowerblue"></i>'
    "When a peer is flagged as stale by all heartbeats, the daemon assumes a split-brain.\n",
    "ai/install.md": "# Install the assistant\n\nThe assistant runs in containers of one service.\n",
    "agent.reference.keywords/svc/SUMMARY.md": "# svc\n\n- [DEFAULT](DEFAULT.md)\n",
    "agent.reference.keywords/svc/DEFAULT.md": "# Section `DEFAULT`\n\n\t[DEFAULT]\n\tnodes = n1\n",
}
DESCRIPTIONS = {
    "preamble/introduction.md": "What OpenSVC is, why use it, and what it requires.",
    "agent/install.md": "How to install the agent\n   packages, by distribution.",
    "agent/configure.md": "The syntax of the agent configuration files.",
    "agent/configure.base.md": "The node configuration: its environment and the schedules of its jobs.",
    "agent/configure.quorum.md": "Cluster quorum: enabling it, and how nodes and arbitrators vote on a split-brain.",
    "ai/install.md": "How to install the assistant.",
}
PAGES = {path: (f"<!-- llms: {DESCRIPTIONS[path]} -->\n" if path in DESCRIPTIONS else "") + body for path, body in BODIES.items()}


class Book:
    """A book in a temporary directory: its configuration, summary, page of a
    missing URL, keyword index, the markdown mdbook rendered, and the html
    build the files are laid in."""

    def __init__(self, pages=PAGES, release="v3.0.0-rc56"):
        self.dir = tempfile.TemporaryDirectory()
        root = self.dir.name
        self.config = self.file("book.toml", CONFIG)
        self.summary = self.file("src/SUMMARY.md", SUMMARY)
        self.file("src/not-found.md", "# Document not found (404)\n")
        self.index = self.file("src/agent.reference.keywords/index.json", json.dumps({"version": release, "keywords": []}))
        self.markdown = os.path.join(root, "markdown")
        for path, text in pages.items():
            self.file(os.path.join("markdown", path), text)
        self.out = os.path.join(root, "book")
        os.makedirs(self.out)

    def file(self, path, text):
        path = os.path.join(self.dir.name, path)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(text)
        return path

    def run(self, *extra):
        """Run llmstxt.py, and give its exit code, 0 when it returns."""
        argv = ["llmstxt.py", "--summary", self.summary, "--markdown", self.markdown, "--out", self.out,
                "--build", "abc1234 2026-11-02", "--config", self.config, *extra]
        saved = sys.argv
        sys.argv = argv
        try:
            with contextlib.redirect_stderr(io.StringIO()):
                llmstxt.main()
        except SystemExit as e:
            return e.code
        finally:
            sys.argv = saved
        return 0

    def read(self, path):
        with open(os.path.join(self.out, path)) as f:
            return f.read()

    def close(self):
        self.dir.cleanup()


class ChaptersTest(unittest.TestCase):
    def test_titles_carry_their_path_and_their_part_when_shared(self):
        book = Book()
        self.addCleanup(book.close)
        parts = dict((part, pages) for part, pages in llmstxt.chapters(book.summary))
        self.assertEqual(parts[None], [("Introduction", "preamble/introduction.md")])
        self.assertEqual(parts["Agent"], [
            ("Agent > Install", "agent/install.md"),
            ("Configure", "agent/configure.md"),
            ("Configure > Node", "agent/configure.base.md"),
            ("Configure > Cluster Quorum", "agent/configure.quorum.md"),
        ])
        self.assertEqual(parts["AI Assistant"], [("AI Assistant > Install", "ai/install.md")])
        self.assertEqual(parts["Agent Keywords Reference (v3.0.0-rc56)"][1], ("svc > DEFAULT", "agent.reference.keywords/svc/DEFAULT.md"))

    def test_a_draft_chapter_titles_those_below_it(self):
        book = Book()
        self.addCleanup(book.close)
        summary = book.file("src/SUMMARY.md", "# Dig\n\n- [Internals]()\n  - [Daemon](agent/internals.daemon.md)\n")
        self.assertEqual(llmstxt.chapters(summary), [["Dig", [("Internals > Daemon", "agent/internals.daemon.md")]]])


class NoteTest(unittest.TestCase):
    def test_the_description_a_page_gives_of_itself(self):
        self.assertEqual(llmstxt.note("agent/install.md", PAGES["agent/install.md"]), "How to install the agent packages, by distribution.")

    def test_nothing_is_guessed_from_the_text(self):
        for text in [BODIES["preamble/introduction.md"], "# X\n\nA sentence that would make a fine description.\n", "<!-- llms:  -->\n# X\n"]:
            self.assertIsNone(llmstxt.note("x.md", text), text)

    def test_the_keyword_reference_says_what_section_a_page_documents(self):
        self.assertEqual(llmstxt.note("agent.reference.keywords/node/hb.relay.md", "\t[hb#1]\n"),
                         "The keywords of the `hb.relay` sections of the node configuration.")
        self.assertEqual(llmstxt.note("agent.reference.keywords/svc/SUMMARY.md", ""),
                         "The sections of the svc configuration, each with its keywords.")
        self.assertEqual(llmstxt.note("agent.reference.keywords/changes.md", "# Keyword changes\n"),
                         "What each release of the agent added, removed and changed in the keywords.")
        self.assertEqual(llmstxt.note("agent.reference.keywords/removed.md", "# Removed keywords\n"),
                         "The keywords the agent no longer has, and the release that removed each.")


class KeywordReleaseTest(unittest.TestCase):
    def test_the_release_of_the_index(self):
        book = Book()
        self.addCleanup(book.close)
        self.assertEqual(llmstxt.keyword_release(book.index), "v3.0.0-rc56")
        self.assertIsNone(llmstxt.keyword_release(None))
        self.assertIsNone(llmstxt.keyword_release(os.path.join(book.dir.name, "none.json")))

    def test_an_index_with_no_version_fails(self):
        book = Book()
        self.addCleanup(book.close)
        bad = book.file("bad.json", json.dumps({"keywords": []}))
        with self.assertRaises(SystemExit):
            llmstxt.keyword_release(bad)


class MainTest(unittest.TestCase):
    def test_the_book_is_published_for_the_language_models(self):
        book = Book()
        self.addCleanup(book.close)
        self.assertEqual(book.run("--keywords-index", book.index), 0)
        index = book.read("llms.txt")
        self.assertTrue(index.startswith(
            "# OpenSVC\n\n> Documents the purpose and usage of the OpenSVC infrastructure tools.\n\n"
            "Build: abc1234 2026-11-02.\n\nKeyword reference: OpenSVC agent v3.0.0-rc56.\n\n## OpenSVC\n\n"
            "- [Introduction](preamble/introduction.md): What OpenSVC is, why use it, and what it requires.\n"), index)
        self.assertIn("## Agent\n\n- [Agent > Install](agent/install.md): How to install the agent packages, by distribution.\n", index)
        self.assertIn("- [Configure > Cluster Quorum](agent/configure.quorum.md): Cluster quorum: enabling it", index)
        self.assertIn("## AI Assistant\n\n- [AI Assistant > Install](ai/install.md): How to install the assistant.\n", index)
        # The keyword reference is the optional section, the last: the summary
        # of each kind, not the sections it lists, published all the same.
        optional = index.split("## Optional\n\n")[1]
        self.assertEqual(optional, "- [svc](agent.reference.keywords/svc/SUMMARY.md): The sections of the svc configuration, each with its keywords.\n")
        self.assertTrue(os.path.isfile(os.path.join(book.out, "agent.reference.keywords/svc/DEFAULT.md")))

        # Every page is laid next to its html page, its description comment
        # and its icons removed; the home page is the first chapter, and the
        # page of a missing URL its own.
        self.assertEqual(book.read("agent/configure.quorum.md"),
                         "# Cluster Quorum\n\nWhen a peer is flagged as stale by all heartbeats, the daemon assumes a split-brain.\n")
        self.assertEqual(book.read("agent/install.md"), BODIES["agent/install.md"])
        self.assertEqual(book.read("index.md"), BODIES["preamble/introduction.md"])
        self.assertEqual(book.read("404.md"), "# Document not found (404)\n")
        for path in PAGES:
            self.assertTrue(os.path.isfile(os.path.join(book.out, path)), path)

        full = book.read("llms-full.txt")
        self.assertTrue(full.startswith("Keyword reference: OpenSVC agent v3.0.0-rc56.\n\n<!-- preamble/introduction.md -->\n\n# Introduction"), full[:120])
        self.assertIn("<!-- ai/install.md -->", full)
        self.assertNotIn("llms:", full)
        self.assertNotIn("agent.reference.keywords/svc/DEFAULT.md", full)

    def test_a_page_with_no_description_fails_and_writes_nothing(self):
        pages = dict(PAGES)
        pages["agent/configure.md"] = BODIES["agent/configure.md"]
        book = Book(pages)
        self.addCleanup(book.close)
        self.assertEqual(book.run("--keywords-index", book.index), 1)
        self.assertEqual(os.listdir(book.out), [])

    def test_a_description_longer_than_a_line_fails(self):
        pages = dict(PAGES)
        pages["agent/configure.md"] = f"<!-- llms: {'word ' * 50}-->\n" + BODIES["agent/configure.md"]
        book = Book(pages)
        self.addCleanup(book.close)
        self.assertEqual(book.run("--keywords-index", book.index), 1)
        self.assertEqual(os.listdir(book.out), [])

    def test_a_book_with_no_keyword_index_names_no_release(self):
        book = Book()
        self.addCleanup(book.close)
        self.assertEqual(book.run(), 0)
        self.assertNotIn("Keyword reference", book.read("llms.txt"))
        self.assertTrue(book.read("llms-full.txt").startswith("<!-- preamble/introduction.md -->"))

    def test_a_page_not_rendered_fails_and_writes_nothing(self):
        pages = dict(PAGES)
        del pages["agent/configure.base.md"]
        book = Book(pages)
        self.addCleanup(book.close)
        self.assertEqual(book.run("--keywords-index", book.index), 1)
        self.assertEqual(os.listdir(book.out), [])


if __name__ == "__main__":
    unittest.main()
