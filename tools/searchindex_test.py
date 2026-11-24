"""Tests of searchindex.py, on a book of a few rendered pages."""

import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import searchindex  # noqa: E402

SUMMARY = """# Summary

# Get Started

- [Install](agent/install.md)

# Agent

- [Configure](agent/configure.md)
  - [Cluster Quorum](agent/configure.quorum.md)

# Agent Keywords Reference (v3.0.0-rc56)

- [Keyword changes](agent.reference.keywords/changes.md)
- [svc](agent.reference.keywords/svc/SUMMARY.md)
  - [DEFAULT](agent.reference.keywords/svc/DEFAULT.md)
  - [fs.ext4](agent.reference.keywords/svc/fs.ext4.md)
  - [fs.xfs](agent.reference.keywords/svc/fs.xfs.md)
- [vol](agent.reference.keywords/vol/SUMMARY.md)
  - [fs.ext4](agent.reference.keywords/vol/fs.ext4.md)
"""


def page(main):
    """A rendered page: the sidebar and the scripts around its <main>."""
    return ('<html><body><nav class="sidebar">Install Configure</nav>'
            f"<main>{main}</main>"
            "<script>var x = 1;</script></body></html>")


def keyword(name, text):
    return (f'<h2 id="keyword-{name}"><a class="header" href="#keyword-{name}">Keyword <code>{name}</code></a></h2>'
            "<pre><code>required:    false\nscopable:    true\n</code></pre>"
            f"<p><strong>Description:</strong></p><p>{text}</p>")


def driver(name, ident, keywords):
    return (f'<h1 id="{ident}"><a class="header" href="#{ident}">Driver <code>{name}</code></a></h1>'
            "<p><strong>Minimal configlet:</strong></p><pre><code>[fs#1]\ntype = ext4\n</code></pre>"
            "<p><strong>Supported keywords:</strong></p><ul><li>mnt</li><li>restart</li></ul>"
            + "".join(keywords))


RESTART = "The daemon will try to restart a resource."
HTML = {
    "agent/install.html": page(
        '<h1 id="install"><a class="header" href="#install">Install</a></h1>'
        "<p>Install the packages.</p>"
        '<h2 id="debian-ubuntu"><a class="header" href="#debian-ubuntu">Debian, Ubuntu</a></h2>'
        "<pre><code>apt install opensvc-server</code></pre>"
        '<h4 id="notes">Notes</h4><p>A note.</p>'
        '<button class="copy">Copy</button>'),
    "agent/configure.html": page(
        '<h1 id="configure"><a class="header" href="#configure">Configure</a></h1><p>The syntax.</p>'),
    "agent/configure.quorum.html": page(
        "<p>Before the title.</p>"
        '<h1 id="cluster-quorum"><a class="header" href="#cluster-quorum">Cluster Quorum</a></h1>'
        '<h3 id="split-brain"><a class="header" href="#split-brain">Split brain</a></h3><p>Nodes vote.</p>'),
    "agent.reference.keywords/changes.html": page("<h1>Keyword changes</h1><p>restart added</p>"),
    "agent.reference.keywords/svc/SUMMARY.html": page("<h1>svc</h1><ul><li>restart</li></ul>"),
    "agent.reference.keywords/svc/DEFAULT.html": page(
        '<h1 id="section-default"><a class="header" href="#section-default">Section <code>DEFAULT</code></a></h1>'
        + keyword("nodes", "The nodes the object runs on.")),
    "agent.reference.keywords/svc/fs.ext4.html": page(driver("fs.ext4", "driver-fsext4", [
        keyword("mnt", "The mount point."), keyword("restart", RESTART)])),
    "agent.reference.keywords/svc/fs.xfs.html": page(driver("fs.xfs", "driver-fsxfs", [
        keyword("restart", RESTART)])),
    "agent.reference.keywords/vol/fs.ext4.html": page(driver("fs.ext4", "driver-fsext4", [
        keyword("restart", "Restart it, in a volume.")])),
}
SOURCES = {
    "agent/install.md": "<!-- llms: How to install the agent\n   packages. -->\n# Install\n",
    "agent/configure.md": "# Configure\n",
}


class Book:
    def __init__(self, html=HTML):
        self.dir = tempfile.TemporaryDirectory()
        self.summary = self.file("src/SUMMARY.md", SUMMARY)
        for path, text in SOURCES.items():
            self.file(os.path.join("src", path), text)
        for path, text in html.items():
            self.file(os.path.join("book", path), text)
        self.src = os.path.join(self.dir.name, "src")
        self.html = os.path.join(self.dir.name, "book")

    def file(self, path, text):
        path = os.path.join(self.dir.name, path)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        return path

    def build(self):
        return searchindex.build(self.summary, self.src, self.html)

    def close(self):
        self.dir.cleanup()


class BuildTest(unittest.TestCase):
    def setUp(self):
        self.book = Book()
        self.index = self.book.build()

    def tearDown(self):
        self.book.close()

    def test_pages(self):
        self.assertEqual(self.index["pages"], [
            ["agent/install.html", "Install", "", "How to install the agent packages.", "Get Started"],
            ["agent/configure.html", "Configure", "", "", "Agent"],
            ["agent/configure.quorum.html", "Cluster Quorum", "Configure", "", "Agent"],
        ])

    def test_sections(self):
        install = [s for s in self.index["sections"] if s[0] == 0]
        # The first heading is the page, linked with no anchor; a heading
        # under the third level is text of its section; the sidebar, the
        # scripts and the buttons are not text.
        self.assertEqual(install, [
            [0, "", "Install", "Install the packages."],
            [0, "debian-ubuntu", "Debian, Ubuntu", "apt install opensvc-server Notes A note."],
        ])

    def test_text_before_the_title(self):
        quorum = [s for s in self.index["sections"] if s[0] == 2]
        self.assertEqual(quorum, [
            [2, "", "Cluster Quorum", "Before the title."],
            [2, "split-brain", "Split brain", "Nodes vote."],
        ])

    def test_keywords_once(self):
        keywords = {k[0]: k for k in self.index["keywords"]}
        self.assertEqual(sorted(keywords), ["mnt", "nodes", "restart"])
        name, anchor, where, short, text = keywords["restart"]
        self.assertEqual(anchor, "keyword-restart")
        self.assertEqual(where, [["svc", "fs.ext4"], ["svc", "fs.xfs"], ["vol", "fs.ext4"]])
        # The description most drivers give is the one shown, the others
        # searched.
        self.assertEqual(short, RESTART)
        self.assertEqual(text, RESTART + " Restart it, in a volume.")

    def test_default_first(self):
        keywords = {k[0]: k for k in self.index["keywords"]}
        self.assertEqual(keywords["nodes"][2], [["svc", "DEFAULT"]])

    def test_drivers(self):
        drivers = {d[0]: d for d in self.index["drivers"]}
        self.assertEqual(sorted(drivers), ["DEFAULT", "fs.ext4", "fs.xfs"])
        # A driver is found by its name: the index has no text of it.
        self.assertEqual(drivers["fs.ext4"], ["fs.ext4", "driver", [
            ["svc", "agent.reference.keywords/svc/fs.ext4.html#driver-fsext4"],
            ["vol", "agent.reference.keywords/vol/fs.ext4.html#driver-fsext4"],
        ]])
        self.assertEqual(drivers["DEFAULT"][1], "section")

    def test_lists_left_out(self):
        urls = [p[0] for p in self.index["pages"]]
        self.assertFalse(any("changes" in u or "SUMMARY" in u for u in urls))
        for k in self.index["keywords"]:
            for w in k[2]:
                self.assertNotEqual(w[1], "")

    def test_own_link(self):
        # A keyword whose anchor differs on a page keeps its own link.
        html = dict(HTML)
        html["agent.reference.keywords/svc/fs.xfs.html"] = page(driver("fs.xfs", "driver-fsxfs", [
            keyword("restart", RESTART).replace('id="keyword-restart"', 'id="keyword-restart-1"')]))
        book = Book(html)
        try:
            keywords = {k[0]: k for k in book.build()["keywords"]}
        finally:
            book.close()
        self.assertIn(["svc", "fs.xfs", "agent.reference.keywords/svc/fs.xfs.html#keyword-restart-1"], keywords["restart"][2])


    def test_unclosed_tag(self):
        # A tag the text leaves open, which the index skips the content of,
        # ends at the next heading: the keywords after it are indexed.
        html = dict(HTML)
        html["agent.reference.keywords/svc/fs.xfs.html"] = page(driver("fs.xfs", "driver-fsxfs", [
            keyword("mnt", "Use a <template> path."), keyword("restart", RESTART)]))
        book = Book(html)
        try:
            keywords = {k[0]: k for k in book.build()["keywords"]}
        finally:
            book.close()
        self.assertIn(["svc", "fs.xfs"], keywords["restart"][2])


class SummaryTest(unittest.TestCase):
    def test_chapter_named_after_its_part(self):
        book = Book()
        try:
            book.file("src/SUMMARY.md", "# Summary\n\n# Howtos\n\n- [Howtos](agent/configure.md)\n")
            index = book.build()
        finally:
            book.close()
        self.assertEqual(index["pages"], [["agent/configure.html", "Howtos", "", "", "Howtos"]])


class ClipTest(unittest.TestCase):
    def test_clip(self):
        self.assertEqual(searchindex.clip("short", 10), "short")
        self.assertEqual(searchindex.clip("one two three four", 10), "one two")
        self.assertEqual(searchindex.clip("abcdefghijklmnop", 10), "abcdefghij")


class MissingTest(unittest.TestCase):
    def test_not_rendered(self):
        for missing in ("agent/configure.html", "agent.reference.keywords/svc/fs.xfs.html"):
            html = dict(HTML)
            del html[missing]
            book = Book(html)
            try:
                with self.assertRaises(SystemExit) as raised:
                    book.build()
                self.assertIn("not rendered", str(raised.exception))
            finally:
                book.close()


if __name__ == "__main__":
    unittest.main()
