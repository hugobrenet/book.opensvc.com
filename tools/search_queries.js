#!/usr/bin/env node
// The searches the search of the book must answer well, run on the index of
// the book built: node tools/search_queries.js book/searchindex.json.
//
// Each search of tools/search_queries.json says what its best result is:
// "doc", the start of the link of the first page of the documentation,
// "keyword", the name of the first keyword or driver, "keywordsFirst",
// whether the keywords are shown before the documentation, and
// "correction", the word a misspelled one is read as. A search that fails
// is a ranking that got worse, or a page that moved: the list is updated
// with the book.

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const search = require(path.join(__dirname, "..", "theme", "search.js"));

const index = JSON.parse(fs.readFileSync(process.argv[2] || "book/searchindex.json", "utf8"));
const queries = JSON.parse(fs.readFileSync(path.join(__dirname, "search_queries.json"), "utf8"));
const engine = new search.Engine(index);

let failed = 0;
for (const want of queries) {
  const result = engine.search(want.query);
  const got = {
    doc: result.docs.length ? result.docs[0].hits[0].doc.url : null,
    keyword: result.keywords.length ? result.keywords[0].entry.name : null,
    keywordsFirst: result.keywordsFirst,
    correction: result.corrections.length ? result.corrections[0][1] : null,
  };
  const wrong = [];
  if ("doc" in want && !(got.doc && got.doc.startsWith(want.doc))) {
    wrong.push(`doc ${got.doc}, want ${want.doc}`);
  }
  for (const key of ["keyword", "keywordsFirst", "correction"]) {
    if (key in want && got[key] !== want[key]) {
      wrong.push(`${key} ${got[key]}, want ${want[key]}`);
    }
  }
  if (wrong.length) {
    failed++;
    console.log(`FAIL ${JSON.stringify(want.query)}: ${wrong.join("; ")}`);
  } else {
    console.log(`ok   ${JSON.stringify(want.query)}`);
  }
}
console.log(`${queries.length - failed}/${queries.length} searches answered well`);
process.exit(failed ? 1 : 0);
