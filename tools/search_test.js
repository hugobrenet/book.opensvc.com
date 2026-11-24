// Tests of the search engine, theme/search.js, on an index of a few pages
// and keywords: node --test tools/search_test.js.

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const search = require(path.join(__dirname, "..", "theme", "search.js"));

const INDEX = {
  version: 1,
  pages: [
    ["agent/install.html", "Install", "", "How to install the agent packages.", "Get Started"],
    ["agent/configure.quorum.html", "Cluster Quorum", "Configure", "Cluster quorum and split brain.", "Agent"],
    ["agent/internals.heartbeats.html", "Heartbeats", "Internals > Daemon", "", "Dig"],
    ["agent/internals.lifecycle.html", "Lifecycle", "Internals > Daemon", "", "Dig"],
    ["ai/install.html", "Install", "AI Assistant", "How to install the assistant.", "AI Assistant"],
  ],
  sections: [
    [0, "", "Install", "Install the packages of the agent."],
    [0, "debian-ubuntu", "Debian, Ubuntu", "apt install opensvc-server"],
    [1, "", "Cluster Quorum", "A split brain is avoided by the quorum: the nodes vote."],
    [1, "quorum-behavior", "Quorum Behavior", "A node with no quorum commits suicide."],
    [2, "", "Heartbeats", "The heartbeats carry the status of the nodes."],
    [2, "drop-a-heartbeat", "Drop a Heartbeat", "Stop a heartbeat."],
    [3, "restart", "Restart", "om daemon restart restarts the daemon."],
    [4, "", "Install", "The assistant runs as a failover service."],
  ],
  keywords: [
    ["restart", "keyword-restart", [["svc", "fs.ext4"], ["svc", "fs.xfs"], ["vol", "fs.ext4"], ["svc", "container.docker"]],
      "The daemon will try to restart a resource.", "The daemon will try to restart a resource."],
    ["restart_delay", "keyword-restart_delay", [["svc", "fs.ext4"]], "The delay between two restarts.", "The delay between two restarts."],
    ["split_action", "keyword-split_action", [["node", "node"], ["cluster", "node"]],
      "The suicide method when the node does not have the quorum.", "The suicide method when the node does not have the quorum."],
    ["install", "keyword-install", [["svc", "fs.ext4"], ["svc", "app.simple", "agent.reference.keywords/svc/app.simple.html#keyword-install-1"]],
      "A list of files to install.", "A list of files to install."],
    ["start", "keyword-start", [["svc", "app.simple"]], "The command to start the app.", "The command to start the app."],
    ["nodes", "keyword-nodes", [["svc", "DEFAULT"], ["vol", "DEFAULT"]], "The nodes the object runs on.", "The nodes the object runs on."],
  ],
  drivers: [
    ["fs.ext4", "driver", [["svc", "agent.reference.keywords/svc/fs.ext4.html#driver-fsext4"], ["vol", "agent.reference.keywords/vol/fs.ext4.html#driver-fsext4"]]],
    ["fs.xfs", "driver", [["svc", "agent.reference.keywords/svc/fs.xfs.html#driver-fsxfs"]]],
    ["hb.relay", "driver", [["node", "agent.reference.keywords/node/hb.relay.html#driver-hbrelay"]]],
    ["DEFAULT", "section", [["svc", "agent.reference.keywords/svc/DEFAULT.html#section-default"]]],
  ],
};

const engine = new search.Engine(INDEX);

function docs(query) {
  return engine.search(query).docs.map((hit) => hit.hits[0].doc.url);
}

function keywords(query) {
  return engine.search(query).keywords.map((hit) => hit.entry.name);
}

test("words keep compound names whole, then their parts", () => {
  assert.deepEqual(search.words("Set split_action on hb.relay"), ["set", "split_action", "split", "action", "on", "hb.relay", "hb", "relay"]);
  assert.deepEqual(search.terms("orchestrate=ha"), ["orchestrate", "ha"]);
  assert.deepEqual(search.terms("Évènement"), ["evenement"]);
});

test("stem gives the forms of a word one stem", () => {
  for (const group of [
    ["configure", "configured", "configures", "configuring"],
    ["heartbeat", "heartbeats"],
    ["restart", "restarts", "restarted", "restarting"],
    ["policy", "policies"],
    ["stop", "stopped", "stopping"],
  ]) {
    const stems = new Set(group.map(search.stem));
    assert.equal(stems.size, 1, group.join(" ") + ": " + [...stems].join(" "));
  }
  assert.equal(search.stem("status"), "status");
  assert.equal(search.stem("split_action"), "split_action");
});

test("distance counts a swap as one", () => {
  assert.equal(search.distance("quorm", "quorum", 2), 1);
  assert.equal(search.distance("qourum", "quorum", 2), 1);
  assert.equal(search.distance("abc", "xyz", 1), 2);
});

test("a page is found by its title, before the pages that only mention it", () => {
  assert.deepEqual(docs("install").slice(0, 2), ["agent/install.html", "ai/install.html"]);
});

test("a page is shown once, at its best heading, the others under it", () => {
  const result = engine.search("quorum");
  assert.equal(result.docs.length, 1);
  assert.equal(result.docs[0].hits.length, 2);
});

test("every word searched must be found", () => {
  assert.deepEqual(docs("split brain"), ["agent/configure.quorum.html"]);
  assert.deepEqual(docs("quorum suicide"), ["agent/configure.quorum.html#quorum-behavior"]);
});

test("with no result that has every word, those that have some are shown, and said so", () => {
  const result = engine.search("quorum heartbeat");
  assert.ok(result.partial);
  assert.ok(result.docs.length > 0);
  assert.equal(engine.search("quorum").partial, false);
});

test("the words that tie the others are left out", () => {
  assert.deepEqual(docs("how to install"), docs("install"));
});

test("a plural finds its singular", () => {
  assert.equal(docs("heartbeat")[0], "agent/internals.heartbeats.html");
});

test("the word being typed is found by its start", () => {
  assert.equal(docs("heartb")[0], "agent/internals.heartbeats.html");
  // A word of two letters is a start only while it is typed.
  assert.equal(docs("he")[0], "agent/internals.heartbeats.html");
  assert.deepEqual(docs("he "), []);
});

test("a misspelled word is corrected, and said so", () => {
  const result = engine.search("quorm");
  assert.deepEqual(result.corrections, [["quorm", "quorum"]]);
  assert.equal(result.docs[0].page.url, "agent/configure.quorum.html");
});

test("a keyword is one result, whatever its drivers and kinds", () => {
  const result = engine.search("restart");
  const restart = result.keywords.filter((hit) => hit.entry.name === "restart");
  assert.equal(restart.length, 1);
  assert.equal(restart[0].entry.where.length, 4);
  assert.equal(restart[0].entry.where[0].url, "agent.reference.keywords/svc/fs.ext4.html#keyword-restart");
});

test("a keyword named exactly comes before those it starts", () => {
  assert.deepEqual(keywords("restart").slice(0, 2), ["restart", "restart_delay"]);
  assert.deepEqual(keywords("restart delay")[0], "restart_delay");
});

test("a keyword keeps the link it was given", () => {
  const install = engine.search("install").keywords.find((hit) => hit.entry.name === "install");
  assert.equal(install.entry.where[1].url, "agent.reference.keywords/svc/app.simple.html#keyword-install-1");
});

test("the drivers of a family are one result, each driver a chip of it", () => {
  const result = engine.search("fs");
  const family = result.keywords[0].entry;
  assert.equal(family.type, "family");
  assert.equal(family.name, "fs.*");
  assert.deepEqual(search.chips(family).map((c) => [c.label, c.url]), [
    ["fs.ext4", "agent.reference.keywords/svc/fs.ext4.html#driver-fsext4"],
    ["fs.xfs", "agent.reference.keywords/svc/fs.xfs.html#driver-fsxfs"],
  ]);
  assert.deepEqual(search.kinds(family.where), ["svc", "vol"]);
  assert.ok(result.keywordsFirst);
});

test("the drivers of a keyword are chips, a family of several one chip", () => {
  const restart = engine.search("restart").keywords[0].entry;
  assert.deepEqual(search.chips(restart).map((c) => [c.label, c.n]), [["fs.*", 2], ["container.docker", undefined]]);
  assert.deepEqual(search.kinds(restart.where), ["svc", "vol"]);
  // A keyword of one driver, or of one section, has no chip.
  const split = engine.search("split_action").keywords[0].entry;
  assert.deepEqual(search.chips(split), []);
});

test("a sentence finds the pages that have some of its words, before a keyword one word names", () => {
  const result = engine.search("freeze the nodes quickly");
  assert.ok(result.partial);
  assert.ok(result.docs.length > 0);
  assert.equal(result.keywordsFirst, false);
  const nodes = result.keywords.find((hit) => hit.entry.name === "nodes");
  assert.ok(!nodes || nodes.score < 70);
  // The words that are about the keyword keep it named.
  assert.equal(engine.search("object nodes").keywords[0].entry.name, "nodes");
  assert.equal(engine.search("object nodes").keywords[0].score, 70);
});

test("a name spelled close is found only for a word the book does not have", () => {
  assert.ok(!keywords("restart").includes("start"));
  const result = engine.search("restrat");
  assert.deepEqual(result.corrections, [["restrat", "restart"]]);
  assert.ok(result.keywords.some((hit) => hit.entry.name === "restart"));
});

test("a sentence ending with a period is not read as a keyword", () => {
  assert.equal(engine.search("install.").keywordsFirst, false);
  assert.equal(engine.search("see restart.").keywordsFirst, false);
});

test("a heading has the words searched once each, whatever they expand to", () => {
  const small = new search.Engine({
    version: 1,
    pages: [["agent/configure.html", "Configure", "", "", "Agent"]],
    sections: [[0, "", "Configure the configuration", "Set the timeout."]],
    keywords: [["config_timeout", "keyword-config_timeout", [["node", "node"]], "The timeout.", "The timeout."]],
    drivers: [],
  });
  const result = small.search("config timeout");
  assert.equal(result.docs[0].hits[0].inHead, false);
  assert.equal(result.keywords[0].entry.name, "config_timeout");
  assert.ok(result.keywordsFirst);
});

test("the documentation comes first, but for what reads as a keyword", () => {
  assert.equal(engine.search("restart").keywordsFirst, false);
  assert.equal(engine.search("quorum").keywordsFirst, false);
  assert.equal(engine.search("split_action").keywordsFirst, true);
  assert.equal(engine.search("hb.relay").keywordsFirst, true);
  assert.equal(engine.search("hb.relay").keywords[0].entry.name, "hb.relay");
});

test("a keyword is found by its description, after those named", () => {
  assert.deepEqual(keywords("suicide"), ["split_action"]);
});

test("the snippet marks the words found, the text escaped", () => {
  const result = engine.search("quorum");
  const html = search.snippet("No <b>quorum</b>: the quorums vote.", search.marker(result.terms));
  assert.equal(html, "No &lt;b&gt;<mark>quorum</mark>&lt;/b&gt;: the <mark>quorums</mark> vote.");
});

test("the snippet marks the words of the stems found, not those they start", () => {
  const text = "The policies of the policy. It has the ha mode, and handles it. Set split_action.";
  const small = new search.Engine({
    version: 1,
    pages: [["agent/policies.html", "Policies", "", "", "Agent"]],
    sections: [[0, "", "Policies", text]],
    keywords: [],
    drivers: [],
  });
  function marked(query) {
    return search.snippet(text, search.marker(small.search(query).terms), 200);
  }
  assert.equal(marked("policy"), "The <mark>policies</mark> of the <mark>policy</mark>. It has the ha mode, and handles it. Set split_action.");
  assert.equal(marked("ha "), "The policies of the policy. It has the <mark>ha</mark> mode, and handles it. Set split_action.");
  // The snippet starts near the first word found.
  assert.equal(marked("split "), "…policy. It has the ha mode, and handles it. Set <mark>split_action</mark>.");
});

test("the engine reads the version of the index the tool writes", () => {
  const tool = fs.readFileSync(path.join(__dirname, "searchindex.py"), "utf8");
  assert.equal(search.INDEX_VERSION, Number(tool.match(/^VERSION = (\d+)$/m)[1]));
});

test("the snippet starts near the first word found", () => {
  const text = "word ".repeat(100) + "quorum " + "word ".repeat(100);
  const html = search.snippet(text, search.marker(engine.search("quorum").terms));
  assert.ok(html.startsWith("…"));
  assert.ok(html.includes("<mark>quorum</mark>"));
  assert.ok(html.endsWith("…"));
});

test("nothing searched finds nothing", () => {
  const result = engine.search("   ");
  assert.deepEqual(result.docs, []);
  assert.deepEqual(result.keywords, []);
});

// page is a rendered page, as section() reads it: the children of its
// <main>, each [tag, id], and the elements inside them, each [tag, id,
// [children]].
function page(children) {
  const main = { nodeName: "MAIN", childNodes: [] };
  const byId = {};
  function node(spec, parent) {
    const [tag, ident, inner] = spec;
    const n = { nodeName: tag.toUpperCase(), id: ident, parentNode: parent, childNodes: [] };
    if (ident) {
      byId[ident] = n;
    }
    (inner || []).forEach((child) => n.childNodes.push(node(child, n)));
    return n;
  }
  children.forEach((spec) => main.childNodes.push(node(spec, main)));
  main.childNodes.forEach((n, i) => { n.nextSibling = main.childNodes[i + 1] || null; });
  main.contains = (n) => { for (let p = n; p; p = p.parentNode) { if (p === main) return true; } return false; };
  return { querySelector: (sel) => (sel === "main" ? main : null), getElementById: (ident) => byId[ident] || null };
}

function ids(nodes) {
  return nodes.map((n) => n.id || n.nodeName.toLowerCase());
}

const PAGE = page([
  ["h1", "quorum"], ["p"], ["h2", "behavior"], ["p"], ["h3", "example"], ["p"],
  ["h2", "enforce"], ["div", "", [["span", "inner"]]], ["h3", "last"], ["p"],
]);

test("the preview of a heading runs to the next heading of its level or above", () => {
  assert.deepEqual(ids(search.section(PAGE, "behavior", false)), ["behavior", "p", "example", "p"]);
  assert.deepEqual(ids(search.section(PAGE, "example", false)), ["example", "p"]);
  assert.deepEqual(ids(search.section(PAGE, "last", false)), ["last", "p"]);
});

test("the preview of a page, or of an anchor it does not have, is the whole page", () => {
  assert.equal(search.section(PAGE, "", false).length, 10);
  assert.equal(search.section(PAGE, "missing", false).length, 10);
});

test("the preview of an anchor inside a block is the block, to the next heading", () => {
  assert.deepEqual(ids(search.section(PAGE, "inner", false)), ["div"]);
});

test("the preview of a driver of the reference stops at its first keyword", () => {
  const driver = page([["h1", "driver-fsext4"], ["p"], ["ul"], ["h2", "keyword-mnt"], ["p"], ["h2", "keyword-restart"], ["p"]]);
  assert.deepEqual(ids(search.section(driver, "driver-fsext4", true)), ["driver-fsext4", "p", "ul"]);
  assert.deepEqual(ids(search.section(driver, "keyword-mnt", true)), ["keyword-mnt", "p"]);
});
