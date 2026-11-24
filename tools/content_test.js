// Tests of what theme/content.js reads in the words of a page:
// node --test tools/content_test.js.

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const content = require(path.join(__dirname, "..", "theme", "content.js"));

test("a heading of the reference is what the text before its name in code says", () => {
  assert.equal(content.headingKind("Keyword ", "CODE"), "keyword");
  assert.equal(content.headingKind("Driver ", "CODE"), "driver");
  assert.equal(content.headingKind("Section ", "CODE"), "section");
});

test("a heading with no name in code is a title, not a keyword", () => {
  // "Keyword changes", the page of what changed between releases.
  assert.equal(content.headingKind("Keyword changes", null), null);
  assert.equal(content.headingKind("Keyword ", null), null);
  assert.equal(content.headingKind("Removed keywords", "CODE"), null);
  assert.equal(content.headingKind("", "CODE"), null);
});

test("a note is of the kind its first word names", () => {
  assert.equal(content.kindOf("Warning"), "warning");
  assert.equal(content.kindOf("note"), "note");
  assert.equal(content.kindOf("TIP"), "tip");
  assert.equal(content.kindOf("Requirements"), null);
});

test("a word that names a property of every object is no kind", () => {
  assert.equal(content.kindOf("Constructor"), null);
  assert.equal(content.kindOf("toString"), null);
  assert.equal(content.kindOf("__proto__"), null);
  assert.equal(content.kindOf(undefined), null);
});
