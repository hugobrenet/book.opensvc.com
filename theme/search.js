// Search.
//
// The search of the book, in front of the page: a field, and under it the
// results in two groups, the pages of the documentation and the keywords of
// the reference. It reads searchindex.json, which tools/searchindex.py writes
// after mdbook builds the book, the first time the search opens.
//
// The documentation is searched by heading: a heading matches when every
// word searched is in it, in the path of its page, in what its page is about
// or in its text, the heading weighing most. A page is shown once, at its
// best heading, the others that match named under it.
//
// The keyword reference documents a keyword once per driver it applies to:
// it is searched by keyword, each shown once, the drivers it applies to
// under it. A keyword named exactly comes first, then the keywords whose name
// starts with what is searched, then those whose description has it.
//
// A word is found by its stem, "heartbeats" finding "heartbeat", by its
// start, the word being typed, and, when it finds nothing else, by a word
// spelled within one or two letters, "quorm" finding "quorum": the results
// then say which word they are for.
//
// The result selected can be previewed, next to the results: Space, once
// the reader moves through the results with the arrows, shows the section
// of the result, from the page it is on, the words found marked; the
// preview follows the selection, and Space again, or Esc, hides it. While
// the reader types, Space is a space.
//
// The search is remembered from a page to the next, in the tab: opened
// again, it shows what was searched, the result that was opened selected,
// the text selected for what is typed to replace it.
//
// The panel can be made larger, to the whole screen or by its corner, and
// its text smaller or larger, to see more or read better: the bar has the
// buttons, Ctrl or Cmd with - = 0 zoom while the search is open, and the
// choices are remembered.
//
// The engine is exported to node, for tools/search_test.js; in a browser the
// script sets up the search of the page.
(function () {
  "use strict";

  var KEYWORDS = "agent.reference.keywords/";
  // INDEX_VERSION is the version of the index tools/searchindex.py writes
  // that this reads.
  var INDEX_VERSION = 1;
  var STOP = {};
  ("a an and are as at be by can do does for from how i if in into is it its of on or so " +
    "that the then this to was what when where which who why will with you your").split(" ").forEach(function (word) {
    STOP[word] = true;
  });
  var WORD = /[a-z0-9]+(?:[._][a-z0-9]+)*/g;
  // BM25 of the text of a heading.
  var K1 = 1.2;
  var B = 0.75;
  // FAMILY is the score of the drivers of a family found by its name, fs.*
  // for fs: after a keyword named exactly, before one it starts.
  var FAMILY = 60;
  // CUT is the share of the score of the best result under which a result is
  // not shown: it matches, but is not what is searched.
  var CUT = { docs: 0.2, keywords: 0.15 };

  // fold is the text as it is compared: lowercase, without accents.
  function fold(text) {
    return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // terms are the words of the text, a compound word such as hb.relay or
  // split_action whole.
  function terms(text) {
    return fold(text).match(WORD) || [];
  }

  // words are the words of the text, a compound word followed by its parts:
  // "split action" finds split_action.
  function words(text) {
    var out = [];
    terms(text).forEach(function (word) {
      out.push(word);
      if (/[._]/.test(word)) {
        word.split(/[._]/).forEach(function (part) {
          if (part) {
            out.push(part);
          }
        });
      }
    });
    return out;
  }

  // stem strips the endings of a word that do not change what it names,
  // the same way for every form: configure, configured, configures and
  // configuring are configur. A compound word or a number is kept whole.
  function stem(word) {
    if (word.length < 4 || /[._0-9]/.test(word)) {
      return word;
    }
    var w = word;
    if (/ies$/.test(w) && w.length > 4) {
      w = w.slice(0, -3) + "y";
    } else if (/sses$/.test(w)) {
      w = w.slice(0, -2);
    } else if (/(ch|sh|x|z)es$/.test(w)) {
      w = w.slice(0, -2);
    } else if (/[^su]s$/.test(w) && !/is$/.test(w)) {
      w = w.slice(0, -1);
    } else if (/ing$/.test(w) && w.length > 5) {
      w = undouble(w.slice(0, -3));
    } else if (/ed$/.test(w) && w.length > 4) {
      w = undouble(w.slice(0, -2));
    }
    if (/e$/.test(w) && w.length > 4) {
      w = w.slice(0, -1);
    }
    return w;
  }

  function undouble(w) {
    return /([^aeiouls])\1$/.test(w) ? w.slice(0, -1) : w;
  }

  // distance is the number of letters to change, add, remove or swap to
  // spell a as b, or max + 1 when it is more than max.
  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) {
      return max + 1;
    }
    var prev2 = null;
    var prev = [];
    for (var j = 0; j <= b.length; j++) {
      prev.push(j);
    }
    for (var i = 1; i <= a.length; i++) {
      var row = [i];
      var low = i;
      for (j = 1; j <= b.length; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        var d = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
        if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d = Math.min(d, prev2[j - 2] + 1);
        }
        row.push(d);
        low = Math.min(low, d);
      }
      if (low > max) {
        return max + 1;
      }
      prev2 = prev;
      prev = row;
    }
    return prev[b.length];
  }

  // has tells whether the field, a set or a map of stems, has one of the
  // stems the term found.
  function has(field, term) {
    var hit = false;
    term.found.forEach(function (_, s) {
      if (field.has(s)) {
        hit = true;
      }
    });
    return hit;
  }

  function counts(list) {
    var map = new Map();
    list.forEach(function (item) {
      map.set(item, (map.get(item) || 0) + 1);
    });
    return map;
  }

  // family is the family of a driver: fs of fs.ext4.
  function family(driver) {
    var dot = driver.indexOf(".");
    return dot > 0 ? driver.slice(0, dot) : "";
  }

  function Engine(index) {
    var self = this;
    this.vocab = new Map(); // word -> its stem
    this.df = new Map(); // stem -> the number of headings that have it
    this.pages = index.pages.map(function (p) {
      return { url: p[0], title: p[1], path: p[2], desc: p[3], part: p[4] || "" };
    });
    var total = 0;
    this.docs = index.sections.map(function (s) {
      var page = self.pages[s[0]];
      var first = s[1] === "";
      var doc = {
        page: page,
        first: first,
        url: page.url + (s[1] ? "#" + s[1] : ""),
        heading: s[2],
        headingStems: terms(s[2]).filter(function (w) { return !STOP[w]; }).map(stem).join(" "),
        text: s[3],
        head: new Set(self.stems(s[2])),
        crumbs: new Set(self.stems(page.path + " " + (first ? "" : page.title))),
        desc: new Set(first ? self.stems(page.desc) : []),
        body: counts(self.stems(s[3])),
      };
      doc.len = 0;
      doc.body.forEach(function (n) {
        doc.len += n;
      });
      total += doc.len;
      var all = new Set();
      [doc.head, doc.crumbs, doc.desc, doc.body].forEach(function (field) {
        field.forEach(function (_, key) {
          all.add(key);
        });
      });
      all.forEach(function (key) {
        self.df.set(key, (self.df.get(key) || 0) + 1);
      });
      return doc;
    });
    this.avg = total / Math.max(1, this.docs.length);
    this.keywords = index.keywords.map(function (k) {
      return {
        type: "keyword",
        name: k[0],
        anchor: k[1],
        where: k[2].map(function (w) {
          return { kind: w[0], driver: w[1], url: w[2] || KEYWORDS + w[0] + "/" + w[1] + ".html#" + k[1] };
        }),
        short: k[3],
        parts: new Set(self.stems(k[0])),
        body: counts(self.stems(k[4])),
      };
    });
    // A driver is found by its name: its page has the configlet of the
    // driver, and the keywords it lists are found as keywords.
    this.drivers = index.drivers.map(function (d) {
      return {
        type: d[1],
        name: d[0],
        where: d[2].map(function (w) {
          return { kind: w[0], driver: d[0], url: w[1] };
        }),
        short: "",
        parts: new Set(self.stems(d[0])),
        body: new Map(),
      };
    });
    this.known = new Set(this.vocab.values());
  }

  // stems are the stems of the words of the text, learnt for the words to
  // be found by their start or their spelling.
  Engine.prototype.stems = function (text) {
    var vocab = this.vocab;
    return words(text).map(function (word) {
      var s = vocab.get(word);
      if (s === undefined) {
        s = stem(word);
        vocab.set(word, s);
      }
      return s;
    });
  };

  Engine.prototype.idf = function (s) {
    var n = this.docs.length;
    var df = this.df.get(s) || 0;
    return Math.log(1 + (n - df + 0.5) / (df + 0.5));
  };

  // expand is what a word searched finds, as {stem: weight}: its stem, the
  // words it starts, and, when these are none, the words spelled close to
  // it, the best of which is told as the correction.
  Engine.prototype.expand = function (word, typing) {
    var found = new Map();
    var s = stem(word);
    if (this.known.has(s)) {
      found.set(s, 1);
    }
    if (word.length >= (typing ? 2 : 3)) {
      // A short word that is one weighs more than the longer words it
      // starts: ha is ha before haproxy.
      var weight = found.size && word.length <= 3 ? 0.25 : typing ? 0.7 : 0.5;
      this.vocab.forEach(function (ws, w) {
        if (w.length > word.length && w.lastIndexOf(word, 0) === 0 && !found.has(ws)) {
          found.set(ws, weight);
        }
      });
    }
    var correction = null;
    if (!found.size && word.length >= 4 && !/^[0-9]+$/.test(word)) {
      var max = word.length >= 7 ? 2 : 1;
      var best = null;
      var df = this.df;
      this.vocab.forEach(function (ws, w) {
        if (/[._]/.test(w) !== /[._]/.test(word)) {
          return;
        }
        var d = distance(word, w, max);
        if (d > max) {
          return;
        }
        var weight = d === 1 ? 0.6 : 0.4;
        if (!found.has(ws) || found.get(ws) < weight) {
          found.set(ws, weight);
        }
        var rank = [d, -(df.get(ws) || 0), w.length];
        if (!best || rank[0] < best.rank[0] || rank[0] === best.rank[0] && (rank[1] < best.rank[1] || rank[1] === best.rank[1] && rank[2] < best.rank[2])) {
          best = { word: w, rank: rank };
        }
      });
      if (best) {
        correction = best.word;
      }
    }
    return { word: word, stem: s, found: found, correction: correction };
  };

  // parse is the query as the words searched, the words that only tie the
  // others, such as "how to", left out when there are others.
  Engine.prototype.parse = function (query) {
    var all = terms(query);
    var kept = all.filter(function (word) {
      return !STOP[word];
    });
    if (!kept.length) {
      kept = all;
    }
    var typing = !/\s$/.test(query);
    var self = this;
    return kept.map(function (word, i) {
      return self.expand(word, typing && i === kept.length - 1);
    });
  };

  Engine.prototype.scoreDoc = function (doc, term) {
    var best = 0;
    var self = this;
    term.found.forEach(function (weight, s) {
      var f = 0;
      if (doc.head.has(s)) {
        f += 3;
      }
      if (doc.crumbs.has(s)) {
        f += 0.6;
      }
      if (doc.desc.has(s)) {
        f += 0.8;
      }
      var tf = doc.body.get(s);
      if (tf) {
        f += tf * (K1 + 1) / (tf + K1 * (1 - B + B * doc.len / self.avg));
      }
      if (f) {
        best = Math.max(best, weight * self.idf(s) * f);
      }
    });
    return best;
  };

  Engine.prototype.searchDocs = function (parsed, any) {
    var phrase = parsed.map(function (term) {
      return term.stem;
    }).join(" ");
    var said = parsed.map(function (term) {
      return term.word;
    }).join(" ");
    var self = this;
    var pages = new Map();
    this.docs.forEach(function (doc) {
      var score = 0;
      var matched = 0;
      var inHead = 0;
      parsed.forEach(function (term) {
        var s = self.scoreDoc(doc, term);
        if (s) {
          matched++;
          score += s;
          if (has(doc.head, term)) {
            inHead++;
          }
        }
      });
      if (!matched || !any && matched < parsed.length) {
        return;
      }
      if (any) {
        score *= matched / parsed.length;
      }
      var head = doc.headingStems;
      if (head === phrase) {
        score *= 3;
      } else if (phrase && head.lastIndexOf(phrase, 0) === 0) {
        score *= 1.6;
      } else if (phrase && (" " + head + " ").indexOf(" " + phrase + " ") >= 0) {
        score *= 1.3;
      } else if (inHead >= parsed.length) {
        score *= 1.5;
      }
      if (parsed.length > 1 && fold(doc.text).indexOf(said) >= 0) {
        score *= 1.3;
      }
      // A page is about what its first heading names, a section about a
      // part of it.
      if (doc.first) {
        score *= 1.25;
      }
      var page = pages.get(doc.page);
      if (!page) {
        page = { page: doc.page, hits: [] };
        pages.set(doc.page, page);
      }
      page.hits.push({ doc: doc, score: score, inHead: inHead >= parsed.length, exact: head === phrase });
    });
    var out = [];
    pages.forEach(function (page) {
      page.hits.sort(function (a, b) {
        return b.score - a.score;
      });
      page.score = page.hits[0].score + (page.hits[1] ? 0.15 * page.hits[1].score : 0);
      out.push(page);
    });
    out.sort(function (a, b) {
      return b.score - a.score;
    });
    return cut(out, CUT.docs);
  };

  function cut(hits, share) {
    var floor = hits.length ? hits[0].score * share : 0;
    return hits.filter(function (hit) {
      return hit.score >= floor;
    });
  }

  // scoreName is how well the name of a keyword or a driver matches: named
  // exactly, by one of the words searched, by its start, or by its words.
  Engine.prototype.scoreName = function (entry, parsed, whole, joined, typing) {
    var name = fold(entry.name);
    if (name === whole || name === joined) {
      return 100;
    }
    if (entry.type !== "keyword" && joined && name.lastIndexOf(joined + ".", 0) === 0) {
      return FAMILY;
    }
    if (parsed.some(function (term) { return term.word === name; })) {
      // One of several words names it: the others are about it too, or it
      // is a word of a sentence, as nodes is of "upgrade the nodes".
      return parsed.every(function (term) {
        return term.word === name || has(entry.parts, term) || has(entry.body, term);
      }) ? 70 : 8;
    }
    // A name is found by its start as a word is: by two letters while they
    // are typed, by three after.
    if (joined.length >= (typing ? 2 : 3) && name.lastIndexOf(joined, 0) === 0) {
      return 50 - Math.min(10, name.length - joined.length);
    }
    if (parsed.length && parsed.every(function (term) {
      return has(entry.parts, term);
    })) {
      return 35;
    }
    // A name spelled close to what is searched, when what is searched is
    // not a word of the book: restart is not a misspelled start.
    if (joined.length >= 5 && parsed.some(function (term) { return term.correction; }) && distance(joined, name, 2) <= 2) {
      return 30;
    }
    return 0;
  };

  Engine.prototype.searchKeywords = function (parsed, whole, joined, typing) {
    var self = this;
    var out = [];
    this.keywords.concat(this.drivers).forEach(function (entry) {
      var score = self.scoreName(entry, parsed, whole, joined, typing);
      if (!score && entry.body.size && parsed.length) {
        // Named by none of the words searched: found by its description,
        // after those that are.
        var sum = 0;
        var all = parsed.every(function (term) {
          var best = 0;
          term.found.forEach(function (weight, s) {
            var tf = entry.body.get(s);
            if (tf) {
              best = Math.max(best, weight * self.idf(s) * Math.min(tf, 3));
            }
          });
          sum += best;
          return best > 0;
        });
        if (all) {
          score = 5 + Math.min(10, sum / parsed.length);
        }
      }
      if (score) {
        out.push({ entry: entry, score: score });
      }
    });
    // The drivers of a family found by their family, fs.* for fs, are one
    // result.
    var families = new Map();
    out = out.filter(function (hit) {
      var fam = family(hit.entry.name);
      if (hit.entry.type === "keyword" || hit.score !== FAMILY || !fam) {
        return true;
      }
      if (!families.has(fam)) {
        families.set(fam, []);
      }
      families.get(fam).push(hit.entry);
      return false;
    });
    families.forEach(function (entries, fam) {
      if (entries.length === 1) {
        out.push({ entry: entries[0], score: FAMILY });
        return;
      }
      var where = [];
      entries.forEach(function (entry) {
        where.push({ kind: entry.where[0].kind, driver: entry.name, url: entry.where[0].url, kinds: entry.where });
      });
      out.push({ entry: { type: "family", name: fam + ".*", where: where, short: entries.length + " drivers" }, score: FAMILY });
    });
    out.sort(function (a, b) {
      return b.score - a.score || a.entry.name.length - b.entry.name.length || (a.entry.name < b.entry.name ? -1 : 1);
    });
    return cut(out, CUT.keywords);
  };

  // search is the results of the query: {docs, keywords, keywordsFirst,
  // corrections, partial}.
  Engine.prototype.search = function (query) {
    var parsed = this.parse(query);
    var result = { docs: [], keywords: [], keywordsFirst: false, corrections: [], partial: false, terms: parsed };
    if (!parsed.length) {
      return result;
    }
    parsed.forEach(function (term) {
      if (term.correction) {
        result.corrections.push([term.word, term.correction]);
      }
    });
    result.docs = this.searchDocs(parsed, false);
    // A setting, such as orchestrate=ha, names its keyword on the left: the
    // value is for the documentation to find, not the keyword.
    var eq = query.indexOf("=");
    var named = eq > 0 ? query.slice(0, eq) : query;
    var nameTerms = terms(named);
    var whole = nameTerms.join(" ");
    result.keywords = this.searchKeywords(eq > 0 ? this.parse(named + " ") : parsed, whole,
      nameTerms.length === 1 ? whole : nameTerms.join("_"), eq < 0 && !/\s$/.test(query));
    if (!result.docs.length && parsed.length > 1) {
      result.docs = this.searchDocs(parsed, true);
      result.partial = result.docs.length > 0;
    }
    // The documentation comes first, but for a keyword named exactly that
    // no heading names, a family of drivers no heading is about, such as fs,
    // and what reads as a keyword or a driver, such as split_action, hb.relay
    // or orchestrate=ha.
    var top = result.keywords.length ? result.keywords[0] : null;
    var topKeyword = top ? top.score : 0;
    var best = result.docs.length ? result.docs[0].hits[0] : {};
    result.keywordsFirst = !result.docs.length ||
      topKeyword >= 100 && !best.inHead ||
      top && top.entry.type === "family" && !best.exact ||
      (terms(query).some(function (word) { return /[._]/.test(word); }) || /=/.test(query)) && topKeyword >= 35;
    return result;
  };

  // marker is the stems the terms found, for the snippets to mark the
  // words of the text that have them, or null.
  function marker(parsed) {
    var found = new Set();
    parsed.forEach(function (term) {
      term.found.forEach(function (_, s) {
        found.add(s);
      });
    });
    return found.size ? found : null;
  }

  // TOKEN is a word of a text, as words() reads it, in its case.
  var TOKEN = /[A-Za-z0-9\u00c0-\u024f]+(?:[._][A-Za-z0-9\u00c0-\u024f]+)*/g;

  // marks tells whether a word of a text is one the search found: a
  // compound word when one of its parts is.
  function marks(word, found) {
    var w = fold(word);
    if (found.has(stem(w))) {
      return true;
    }
    return /[._]/.test(w) && w.split(/[._]/).some(function (part) {
      return part && found.has(stem(part));
    });
  }

  function escape(text) {
    return text.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // snippet is the html of the part of the text around the first word
  // found, the words found marked.
  function snippet(text, found, size) {
    if (!text) {
      return "";
    }
    size = size || 160;
    var start = 0;
    var m;
    if (found) {
      var first = new RegExp(TOKEN.source, "g");
      while ((m = first.exec(text))) {
        if (marks(m[0], found)) {
          start = Math.max(0, m.index - 50);
          break;
        }
      }
    }
    if (start > 0) {
      var space = text.indexOf(" ", start);
      start = space >= 0 && space < start + 20 ? space + 1 : start;
    }
    var end = Math.min(text.length, start + size);
    if (end < text.length) {
      var cut = text.lastIndexOf(" ", end);
      end = cut > start + size / 2 ? cut : end;
    }
    var part = text.slice(start, end);
    var html = "";
    var last = 0;
    if (found) {
      var each = new RegExp(TOKEN.source, "g");
      while ((m = each.exec(part))) {
        if (marks(m[0], found)) {
          html += escape(part.slice(last, m.index)) + "<mark>" + escape(m[0]) + "</mark>";
          last = m.index + m[0].length;
        }
      }
    }
    html += escape(part.slice(last));
    return (start > 0 ? "…" : "") + html + (end < text.length ? "…" : "");
  }

  // kinds are the kinds a keyword or a driver is of, each once.
  function kinds(where) {
    var seen = [];
    where.forEach(function (w) {
      (w.kinds || [w]).forEach(function (k) {
        if (seen.indexOf(k.kind) < 0) {
          seen.push(k.kind);
        }
      });
    });
    return seen;
  }

  // chips are the drivers a keyword is documented under, each named once
  // whatever its kinds, a family of several, such as fs.*, as one.
  function chips(entry) {
    var drivers = new Map();
    entry.where.forEach(function (w) {
      if (!drivers.has(w.driver)) {
        drivers.set(w.driver, w);
      }
    });
    if (entry.type !== "keyword") {
      if (entry.type !== "family") {
        return [];
      }
      return Array.from(drivers.values()).map(function (w) {
        return { label: w.driver, url: w.url, title: w.driver };
      });
    }
    var families = new Map();
    drivers.forEach(function (w, driver) {
      var key = family(driver) || driver;
      if (!families.has(key)) {
        families.set(key, []);
      }
      families.get(key).push(w);
    });
    var out = [];
    families.forEach(function (list, key) {
      if (list.length === 1) {
        out.push({ label: list[0].driver, url: list[0].url, title: list[0].driver });
      } else {
        out.push({ label: key + ".*", n: list.length, url: list[0].url, title: list.map(function (w) { return w.driver; }).join(", ") });
      }
    });
    return out.length > 1 || out[0] && out[0].label !== entry.where[0].driver ? out : [];
  }

  // section is the content of the page doc the result links: from its
  // heading to the next heading of its level or above, a heading of the
  // keyword reference to the next keyword, the whole page for a page.
  function section(doc, anchor, reference) {
    var main = doc.querySelector("main");
    if (!main) {
      return [];
    }
    var start = anchor ? doc.getElementById(anchor) : null;
    if (!start || !main.contains(start)) {
      return Array.prototype.slice.call(main.childNodes);
    }
    while (start.parentNode !== main) {
      start = start.parentNode;
    }
    var match = /^H([1-6])$/.exec(start.nodeName);
    var level = match ? Number(match[1]) : 6;
    var limit = reference ? Math.max(level, 2) : level;
    var nodes = [start];
    for (var node = start.nextSibling; node; node = node.nextSibling) {
      var m = /^H([1-6])$/.exec(node.nodeName);
      if (m && Number(m[1]) <= limit) {
        break;
      }
      nodes.push(node);
    }
    return nodes;
  }

  var api = {
    Engine: Engine, fold: fold, terms: terms, words: words, stem: stem, distance: distance,
    snippet: snippet, marker: marker, chips: chips, kinds: kinds, section: section, INDEX_VERSION: INDEX_VERSION,
  };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  // The search of the page.
  var DOC = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5h5.5l3 3v10H4z M9.5 1.5v3h3 M6 8h4.5 M6 10.5h4.5"/></svg>';
  var KEY = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5.5" cy="10.5" r="3"/><path d="M7.6 8.4L14 2 M11.5 4.5l1.5 1.5 M10 6l1.5 1.5"/></svg>';
  var DRIVER = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4.5l6-3 6 3-6 3z M2 8l6 3 6-3 M2 11.5l6 3 6-3"/></svg>';
  var EYE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>';
  var PEEK = '<button type="button" class="bs-peek" tabindex="-1" title="Preview (Space)" aria-label="Preview">' + EYE + "</button>";
  var GLASS = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6.5" cy="6.5" r="5"/><path d="M10.2 10.2l4.3 4.3"/></svg>';
  var SHOWN = 5;
  var CHIPS = 6;

  var root = typeof path_to_root === "undefined" ? "" : path_to_root;
  var engine = null;
  var loading = null;
  var dialog;
  var backdrop;
  var input;
  var body;
  var count;
  var active = -1;
  var expanded = {};
  var timer = null;
  var lastFocus = null;
  // The preview: shown or not, the reader moving through the results with
  // the arrows, which makes Space the key of the preview, the stems found by
  // the search, to mark, and the pages read, by their URL.
  var preview;
  var previewing = false;
  var navigating = false;
  var previewTimer = null;
  var previewSerial = 0;
  var foundNow = null;
  var pages = new Map();
  // drawn is the link of the result the preview shows.
  var drawn = null;
  // VIEW is where the size and the zoom of the panel are kept, and ZOOMS
  // the steps of the zoom.
  var VIEW = "opensvc.search.view";
  // MOD is the key the zoom is pressed with, as the keyboard names it.
  var MOD = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "") ? "⌘" : "Ctrl";
  var ZOOMS = [0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.5];
  var view = { zoom: 1, max: false, w: 0, h: 0 };
  var zoomLabel;
  var maxButton;
  var MAXIMIZE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9"/></svg>';
  var RESTORE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 6.5h-4v-4M2.5 9.5h4v4M9.5 6.5 14 2M6.5 9.5 2 14"/></svg>';

  function loadView() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(VIEW));
      if (saved && typeof saved === "object") {
        view.zoom = ZOOMS.indexOf(saved.zoom) >= 0 ? saved.zoom : 1;
        view.max = saved.max === true;
        view.w = Number(saved.w) || 0;
        view.h = Number(saved.h) || 0;
      }
    } catch (e) {
      /* the panel opens at its size */
    }
  }

  function saveView() {
    try {
      window.localStorage.setItem(VIEW, JSON.stringify(view));
    } catch (e) {
      /* a reader who blocks storage sizes it again */
    }
  }

  // applyView sizes the panel as the reader chose: the whole screen, the size
  // they dragged it to, within the screen, or its own; and zooms its text.
  function applyView() {
    dialog.style.setProperty("--bs-zoom", String(view.zoom));
    var percent = Math.round(view.zoom * 100) + "%";
    zoomLabel.textContent = percent;
    zoomLabel.title = "Text at " + percent + ": back to 100% (" + MOD + " 0)";
    zoomLabel.setAttribute("aria-label", zoomLabel.title);
    // A small screen has the panel on the whole of it already.
    var small = window.innerWidth <= 600;
    dialog.classList.toggle("bs-max", view.max && !small);
    maxButton.innerHTML = view.max ? RESTORE : MAXIMIZE;
    maxButton.setAttribute("aria-pressed", String(view.max));
    maxButton.title = view.max ? "Restore the size" : "Enlarge to the screen";
    if (!small && !view.max && view.w && view.h) {
      dialog.style.width = Math.min(view.w, window.innerWidth - 32) + "px";
      dialog.style.height = Math.min(view.h, tallest()) + "px";
      dialog.style.maxHeight = "none";
    } else {
      dialog.style.width = "";
      dialog.style.height = "";
      dialog.style.maxHeight = "";
    }
  }

  // tallest is the height the panel has room for under its top, 10vh, the
  // grip of its corner in sight.
  function tallest() {
    return Math.round(window.innerHeight * 0.9) - 16;
  }

  function zoom(step) {
    var at = ZOOMS.indexOf(view.zoom);
    view.zoom = step === 0 ? 1 : ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, at + step))];
    applyView();
    saveView();
  }

  function tool(cls, label, html) {
    var button = el("button", "bs-tool " + cls, html);
    button.type = "button";
    button.title = label;
    button.setAttribute("aria-label", label);
    return button;
  }

  // resizer is the grip of the bottom right corner: dragged, it sizes the
  // panel, which stays centered, the corner under the pointer; double
  // clicked, it gives the panel its own size back.
  function resizer() {
    var grip = el("div", "bs-grip", '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M11 5 5 11M11 9l-2 2"/></svg>');
    grip.title = "Drag to resize, double-click for the default size";
    var start = null;
    grip.addEventListener("pointerdown", function (event) {
      var box = dialog.getBoundingClientRect();
      start = { x: event.clientX, y: event.clientY, w: box.width, h: box.height };
      grip.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    grip.addEventListener("pointermove", function (event) {
      if (!start) {
        return;
      }
      view.max = false;
      view.w = Math.round(Math.max(480, Math.min(window.innerWidth - 32, start.w + 2 * (event.clientX - start.x))));
      view.h = Math.round(Math.max(320, Math.min(tallest(), start.h + event.clientY - start.y)));
      applyView();
    });
    function end() {
      if (start) {
        start = null;
        saveView();
      }
    }
    grip.addEventListener("pointerup", end);
    grip.addEventListener("pointercancel", end);
    grip.addEventListener("dblclick", function () {
      view.w = 0;
      view.h = 0;
      view.max = false;
      applyView();
      saveView();
    });
    return grip;
  }

  // MEMORY is where the tab keeps the search: what was searched, the groups
  // shown whole, and the link of the result selected, which recalled is
  // until the search remembered is shown again.
  var MEMORY = "opensvc.search";
  var recalled = null;

  // selected is the address of the result selected, whole: the link is
  // written relative to the page, which the next page is not at.
  function selected() {
    var link = links()[active];
    return link ? link.href : null;
  }

  function remember() {
    try {
      if (input.value.trim()) {
        sessionStorage.setItem(MEMORY, JSON.stringify({ query: input.value, href: selected(), expanded: Object.keys(expanded) }));
      } else {
        sessionStorage.removeItem(MEMORY);
      }
    } catch (e) {
      /* a tab that keeps nothing searches afresh */
    }
  }

  function recall() {
    try {
      var state = JSON.parse(sessionStorage.getItem(MEMORY));
      return state && typeof state.query === "string" ? state : null;
    } catch (e) {
      return null;
    }
  }

  function load() {
    if (!loading) {
      loading = fetch(root + "searchindex.json").then(function (r) {
        if (!r.ok) {
          throw new Error("searchindex.json: " + r.status);
        }
        return r.json();
      }).then(function (index) {
        if (index.version !== INDEX_VERSION) {
          throw new Error("searchindex.json: version " + index.version + ", want " + INDEX_VERSION);
        }
        engine = new Engine(index);
        return engine;
      });
      loading.catch(function () {
        loading = null;
      });
    }
    return loading;
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) {
      node.className = cls;
    }
    if (html !== undefined) {
      node.innerHTML = html;
    }
    return node;
  }

  function build() {
    backdrop = el("div", "bs-backdrop");
    dialog = el("div", "bs-dialog");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "Search the book");
    var bar = el("div", "bs-bar");
    bar.appendChild(el("span", "bs-glass", GLASS));
    input = el("input", "bs-input");
    input.type = "search";
    input.placeholder = "Search the documentation and the keywords";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-controls", "bs-results");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-autocomplete", "list");
    bar.appendChild(input);
    var tools = el("div", "bs-tools");
    var smaller = tool("bs-zoom-out", "Smaller text (" + MOD + " -)", "−");
    zoomLabel = tool("bs-zoom-reset", "Text at 100%", "100%");
    var larger = tool("bs-zoom-in", "Larger text (" + MOD + " =)", "+");
    maxButton = tool("bs-max-toggle", "Enlarge to the screen", MAXIMIZE);
    smaller.addEventListener("click", function () {
      zoom(-1);
    });
    larger.addEventListener("click", function () {
      zoom(1);
    });
    zoomLabel.addEventListener("click", function () {
      zoom(0);
    });
    maxButton.addEventListener("click", function () {
      view.max = !view.max;
      applyView();
      saveView();
    });
    tools.appendChild(smaller);
    tools.appendChild(zoomLabel);
    tools.appendChild(larger);
    tools.appendChild(maxButton);
    bar.appendChild(tools);
    var esc = el("button", "bs-esc", "Esc");
    esc.type = "button";
    esc.setAttribute("aria-label", "Close the search");
    bar.appendChild(esc);
    body = el("div", "bs-body");
    body.id = "bs-results";
    body.setAttribute("role", "listbox");
    var foot = el("div", "bs-foot");
    foot.innerHTML = '<span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>␣</kbd> <span class="bs-preview-key">to preview</span></span>' +
      '<span><kbd>↵</kbd> to open</span><span><kbd>Esc</kbd> to close</span>';
    count = el("span", "bs-count");
    foot.appendChild(count);
    preview = el("aside", "bs-preview");
    preview.setAttribute("aria-label", "Preview of the result");
    var main = el("div", "bs-main");
    main.appendChild(body);
    main.appendChild(preview);
    dialog.appendChild(bar);
    dialog.appendChild(main);
    dialog.appendChild(foot);
    dialog.appendChild(resizer());
    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);
    loadView();
    applyView();
    window.addEventListener("resize", function () {
      if (document.documentElement.classList.contains("search-open")) {
        applyView();
      }
    });

    backdrop.addEventListener("click", close);
    esc.addEventListener("click", close);
    input.addEventListener("input", function () {
      clearTimeout(timer);
      expanded = {};
      navigating = false;
      timer = setTimeout(run, 40);
    });
    preview.addEventListener("click", function (event) {
      if (event.target.closest(".bs-preview-close")) {
        showPreview(false);
        input.focus();
      } else if (event.target.closest("a[href]")) {
        close();
      }
    });
    dialog.addEventListener("keydown", keys);
    body.addEventListener("click", function (event) {
      var peek = event.target.closest(".bs-peek");
      if (peek) {
        var at = links().indexOf(peek.parentNode.querySelector(".bs-link"));
        if (previewing && at === active) {
          showPreview(false);
        } else {
          select(at, false);
          showPreview(true);
        }
        input.focus();
        return;
      }
      var more = event.target.closest(".bs-more");
      if (more) {
        expanded[more.dataset.group] = true;
        run(true);
        input.focus();
        return;
      }
      var chips = event.target.closest(".bs-chip-more");
      if (chips) {
        chips.parentNode.classList.add("bs-chips-all");
        chips.remove();
        input.focus();
        return;
      }
      if (event.target.closest("a")) {
        close();
      }
    });
    body.addEventListener("mousemove", function (event) {
      var link = event.target.closest(".bs-link");
      if (link) {
        select(links().indexOf(link), false);
      }
    });
  }

  function links() {
    return Array.prototype.slice.call(body.querySelectorAll(".bs-link"));
  }

  function select(i, scroll) {
    var all = links();
    if (!all.length) {
      active = -1;
      input.removeAttribute("aria-activedescendant");
      if (previewing) {
        schedule();
      }
      return;
    }
    i = Math.max(0, Math.min(all.length - 1, i));
    if (all[active]) {
      all[active].classList.remove("bs-active");
    }
    active = i;
    all[i].classList.add("bs-active");
    input.setAttribute("aria-activedescendant", all[i].id);
    if (scroll) {
      all[i].scrollIntoView({ block: "nearest" });
    }
    // The preview follows the selection, not the pointer resting on it.
    if (previewing && all[i].href !== drawn) {
      schedule();
    }
  }

  // zoomStep is the step of the zoom a key asks for, or null: Ctrl or Cmd
  // with -, = or + and 0, by the character or by the key, for 0 is à on a
  // French keyboard and - the key of 6.
  function zoomStep(event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) {
      return null;
    }
    if (event.key === "-" || event.code === "Minus" || event.code === "NumpadSubtract") {
      return -1;
    }
    if (event.key === "=" || event.key === "+" || event.code === "Equal" || event.code === "NumpadAdd") {
      return 1;
    }
    if (event.key === "0" || event.code === "Digit0" || event.code === "Numpad0") {
      return 0;
    }
    return null;
  }

  // keys are the keys of the search, wherever its focus is: the keys of the
  // page, such as the arrows that turn its chapters, are not for it while
  // the search is in front of it, and the focus stays in the search.
  function keys(event) {
    event.stopPropagation();
    var step = zoomStep(event);
    if (step !== null) {
      // The zoom of the panel, not of the page behind it.
      event.preventDefault();
      zoom(step);
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (previewing) {
        showPreview(false);
      } else {
        close();
      }
    } else if (event.key === " " && !event.ctrlKey && !event.altKey && !event.metaKey &&
      (event.target === input ? navigating : event.target.classList.contains("bs-link"))) {
      event.preventDefault();
      var focused = links().indexOf(event.target);
      if (focused >= 0 && focused !== active) {
        // The result the keys reached, not the one selected before.
        select(focused, false);
        showPreview(true);
      } else {
        showPreview(!previewing);
      }
    } else if ((event.key === "PageDown" || event.key === "PageUp") && previewing) {
      // The preview is read with the keys too, the focus in the field.
      var reading = preview.querySelector(".bs-preview-body");
      if (reading) {
        event.preventDefault();
        reading.scrollBy({ top: (event.key === "PageDown" ? 1 : -1) * reading.clientHeight * 0.85 });
      }
    } else if (event.key === "Tab") {
      var all = Array.prototype.filter.call(dialog.querySelectorAll("input, button, a[href]"), function (node) {
        return node.offsetParent !== null;
      });
      var first = all[0];
      var last = all[all.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (document.activeElement !== input) {
        input.focus();
      }
      navigating = true;
      select(active + (event.key === "ArrowDown" ? 1 : -1), true);
    } else if (event.key === "Enter" && event.target === input) {
      var link = links()[active];
      if (link) {
        event.preventDefault();
        close();
        if (event.ctrlKey || event.metaKey) {
          window.open(link.href, "_blank");
        } else {
          window.location.href = link.href;
        }
      }
    }
  }

  function open(query) {
    if (!dialog) {
      build();
    }
    lastFocus = document.activeElement;
    navigating = false;
    document.documentElement.classList.add("search-open");
    // The screen may have changed size while the search was closed.
    applyView();
    if (typeof query === "string") {
      input.value = query;
    } else if (!input.value) {
      var state = recall();
      if (state) {
        input.value = state.query;
        recalled = typeof state.href === "string" ? state.href : null;
        expanded = {};
        (Array.isArray(state.expanded) ? state.expanded : []).forEach(function (name) {
          expanded[name] = true;
        });
      }
    } else {
      recalled = selected();
    }
    input.focus();
    input.select();
    run();
  }

  function close() {
    if (!dialog || !document.documentElement.classList.contains("search-open")) {
      return;
    }
    document.documentElement.classList.remove("search-open");
    remember();
    showPreview(false);
    if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  }

  // run shows the results of the field, from the first, or, keep, where the
  // reader was, when a group is shown whole.
  function run(keep) {
    var query = input.value;
    if (!query.trim()) {
      body.innerHTML = '<p class="bs-hint">Search pages, sections, keywords and drivers: <em>quorum</em>, <em>restart</em>, <em>hb.relay</em>, <em>monitor_action</em>.</p>';
      count.textContent = "";
      active = -1;
      if (previewing) {
        schedule();
      }
      return;
    }
    if (!engine) {
      body.innerHTML = '<p class="bs-hint">Loading the index…</p>';
      load().then(function () {
        run();
      }, function () {
        body.innerHTML = '<p class="bs-hint">The search index could not be loaded.</p>';
      });
      return;
    }
    render(query, engine.search(query), keep === true);
  }

  function more(group, total) {
    if (expanded[group] || total <= SHOWN) {
      return "";
    }
    return '<button type="button" class="bs-more" data-group="' + group + '">Show ' + (total - SHOWN) + " more</button>";
  }

  var serial = 0;

  function docItem(hit, found) {
    var best = hit.hits[0].doc;
    var page = hit.page;
    var title = best.first ? page.title : best.heading;
    var path = [page.part, page.path, best.first ? "" : page.title].filter(Boolean).join(" > ");
    var text = best.text || (best.first ? page.desc : "");
    var html = '<li class="bs-item"><a class="bs-link" role="option" id="bs-opt-' + serial++ + '" href="' + escape(root + best.url) + '">' +
      '<span class="bs-icon">' + DOC + "</span>" +
      '<span class="bs-text"><span class="bs-title">' + escape(title) + "</span>" +
      (path ? '<span class="bs-path">' + escape(path) + "</span>" : "") +
      (text ? '<span class="bs-snippet">' + snippet(text, found) + "</span>" : "") +
      "</span></a>" + PEEK;
    var named = {};
    named[best.heading] = true;
    var also = hit.hits.slice(1).filter(function (h) {
      if (h.doc.first || named[h.doc.heading]) {
        return false;
      }
      named[h.doc.heading] = true;
      return true;
    }).slice(0, 3);
    if (also.length) {
      html += '<div class="bs-also">' + also.map(function (h) {
        return '<a href="' + escape(root + h.doc.url) + '">' + escape(h.doc.heading) + "</a>";
      }).join("") + "</div>";
    }
    return html + "</li>";
  }

  function keywordItem(hit, found) {
    var entry = hit.entry;
    var icon = entry.type === "keyword" ? KEY : DRIVER;
    var label = entry.type === "keyword" ? "keyword" : entry.type === "section" ? "section" : "driver";
    var url = entry.where[0].url;
    var html = '<li class="bs-item"><a class="bs-link" role="option" id="bs-opt-' + serial++ + '" href="' + escape(root + url) + '">' +
      '<span class="bs-icon">' + icon + "</span>" +
      '<span class="bs-text"><span class="bs-title"><code>' + escape(entry.name) + "</code>" +
      '<span class="bs-kinds">' + escape(label + " · " + kinds(entry.where).join(" · ")) + "</span></span>" +
      (entry.short ? '<span class="bs-snippet">' + snippet(entry.short, found, 140) + "</span>" : "") +
      "</span></a>" + PEEK;
    var list = chips(entry);
    if (list.length) {
      html += '<div class="bs-chips">' + list.map(function (c, i) {
        return '<a class="bs-chip' + (i >= CHIPS ? " bs-chip-extra" : "") + '" href="' + escape(root + c.url) + '" title="' + escape(c.title) + '">' +
          escape(c.label) + (c.n ? "<span>" + c.n + "</span>" : "") + "</a>";
      }).join("") + (list.length > CHIPS ? '<button type="button" class="bs-chip bs-chip-more">+' + (list.length - CHIPS) + "</button>" : "") + "</div>";
    }
    return html + "</li>";
  }

  function group(name, label, items, render) {
    var shown = expanded[name] ? items.length : SHOWN;
    return '<section class="bs-group"><h3 class="bs-group-title">' + label + '<span class="bs-group-count">' + items.length + "</span></h3>" +
      "<ul>" + items.slice(0, shown).map(render).join("") + "</ul>" + more(name, items.length) + "</section>";
  }

  function render(query, result, keep) {
    serial = 0;
    var scroll = body.scrollTop;
    var was = active;
    var found = marker(result.terms);
    foundNow = found;
    var html = "";
    if (result.corrections.length) {
      var fixed = query;
      result.corrections.forEach(function (c) {
        fixed = fixed.replace(new RegExp(c[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), c[1]);
      });
      html += '<p class="bs-note">Showing results for <strong>' + escape(fixed.trim()) + "</strong>.</p>";
    }
    if (result.partial) {
      html += '<p class="bs-note">No page has every word searched: these have some of them.</p>';
    }
    var docs = result.docs.length ? group("docs", "Documentation", result.docs, function (hit) {
      return docItem(hit, found);
    }) : "";
    var keywords = result.keywords.length ? group("keywords", "Keywords", result.keywords, function (hit) {
      return keywordItem(hit, found);
    }) : "";
    html += result.keywordsFirst ? keywords + docs : docs + keywords;
    if (!docs && !keywords) {
      html += '<p class="bs-hint">No results for “' + escape(query.trim()) + "”.</p>";
    }
    body.innerHTML = html;
    body.scrollTop = keep ? scroll : 0;
    var n = result.docs.length + result.keywords.length;
    count.textContent = n ? n + (n > 1 ? " results" : " result") : "";
    active = -1;
    var at = recalled === null ? -1 : links().map(function (link) {
      return link.href;
    }).indexOf(recalled);
    select(keep ? was : Math.max(at, 0), at >= 0);
    recalled = null;
  }

  // showPreview shows the preview of the result selected, or hides it.
  function showPreview(on) {
    if (!dialog) {
      return;
    }
    previewing = on;
    dialog.classList.toggle("bs-previewing", on);
    dialog.querySelector(".bs-preview-key").textContent = on ? "to hide the preview" : "to preview";
    clearTimeout(previewTimer);
    previewSerial++;
    drawn = null;
    if (on) {
      draw();
      var link = links()[active];
      if (link) {
        link.scrollIntoView({ block: "nearest" });
      }
    } else {
      preview.textContent = "";
    }
  }

  // schedule draws the preview once the selection rests: the arrows held
  // down do not load every page they pass.
  function schedule() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(draw, 80);
  }

  // page is the document of the page at url, read once.
  function page(url) {
    if (!pages.has(url)) {
      var read = fetch(url).then(function (r) {
        if (!r.ok) {
          throw new Error(url + ": " + r.status);
        }
        return r.text();
      }).then(function (text) {
        return new DOMParser().parseFromString(text, "text/html");
      });
      read.catch(function () {
        pages.delete(url);
      });
      pages.set(url, read);
    }
    return pages.get(url);
  }

  // mark marks, in the text under root, the words the search found.
  function mark(root, found) {
    if (!found) {
      return;
    }
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var texts = [];
    while (walker.nextNode()) {
      texts.push(walker.currentNode);
    }
    texts.forEach(function (text) {
      if (text.parentNode.closest("mark, script, style")) {
        return;
      }
      var value = text.nodeValue;
      var re = new RegExp(TOKEN.source, "g");
      var m;
      var last = 0;
      var parts = [];
      while ((m = re.exec(value))) {
        if (marks(m[0], found)) {
          parts.push(document.createTextNode(value.slice(last, m.index)));
          var tag = document.createElement("mark");
          tag.textContent = m[0];
          parts.push(tag);
          last = m.index + m[0].length;
        }
      }
      if (!parts.length) {
        return;
      }
      parts.push(document.createTextNode(value.slice(last)));
      parts.forEach(function (part) {
        text.parentNode.insertBefore(part, text);
      });
      text.remove();
    });
  }

  // draw draws the preview of the result selected: its title and the path
  // of its page, as the result names them, then its section.
  function draw() {
    if (!previewing) {
      return;
    }
    var serialNow = ++previewSerial;
    var link = links()[active];
    drawn = link ? link.href : null;
    preview.textContent = "";
    if (!link) {
      preview.appendChild(el("p", "bs-hint", "No result to preview."));
      return;
    }
    var head = el("div", "bs-preview-head");
    var names = el("div", "bs-preview-names");
    var title = el("div", "bs-preview-title");
    title.textContent = link.querySelector(".bs-title").firstChild.textContent;
    names.appendChild(title);
    var where = link.querySelector(".bs-path, .bs-kinds");
    if (where) {
      var path = el("div", "bs-path");
      path.textContent = where.textContent;
      names.appendChild(path);
    }
    head.appendChild(names);
    var go = el("a", "bs-preview-open", "Open <kbd>↵</kbd>");
    go.href = link.href;
    head.appendChild(go);
    var shut = el("button", "bs-preview-close", "×");
    shut.type = "button";
    shut.setAttribute("aria-label", "Hide the preview");
    head.appendChild(shut);
    var content = el("div", "bs-preview-body content");
    content.appendChild(el("p", "bs-hint", "Loading…"));
    preview.appendChild(head);
    preview.appendChild(content);

    var url = link.href.split("#")[0];
    var anchor = decodeURIComponent(link.hash.slice(1));
    var reference = url.indexOf("/" + KEYWORDS) >= 0;
    page(url).then(function (doc) {
      if (serialNow !== previewSerial) {
        return;
      }
      var main = el("main");
      section(doc, anchor, reference).forEach(function (node) {
        main.appendChild(document.importNode(node, true));
      });
      main.querySelectorAll("script").forEach(function (node) {
        node.remove();
      });
      // The links of the section are relative to its page.
      main.querySelectorAll("[href], [src]").forEach(function (node) {
        ["href", "src"].forEach(function (name) {
          var value = node.getAttribute(name);
          if (value !== null) {
            node.setAttribute(name, new URL(value, url).href);
          }
        });
      });
      // The code colored as mdbook colors that of the page.
      if (window.hljs) {
        main.querySelectorAll("code").forEach(function (code) {
          if (!code.parentElement.classList.contains("header")) {
            window.hljs.highlightBlock(code);
            code.classList.add("hljs");
          }
        });
      }
      // The notes, labels and keyword tags drawn as on the page,
      // theme/content.js.
      if (window.bookContent) {
        window.bookContent.enhance(main, url);
      }
      mark(main, foundNow);
      content.textContent = "";
      content.appendChild(main);
      content.scrollTop = 0;
      // The first word found in sight, when the section is longer than the
      // preview.
      var first = main.querySelector("mark");
      if (first) {
        var below = first.getBoundingClientRect().top - content.getBoundingClientRect().top;
        if (below > content.clientHeight * 0.6) {
          content.scrollTop = below - content.clientHeight / 3;
        }
      }
    }, function () {
      if (serialNow === previewSerial) {
        content.textContent = "";
        content.appendChild(el("p", "bs-hint", "The page could not be loaded."));
      }
    });
  }

  // The buttons that open the search: the field of the sidebar head, which
  // theme/custom.js builds, and the button of the menu bar, shown while the
  // sidebar is hidden.
  function init() {
    var bar = document.querySelector("#mdbook-menu-bar .left-buttons, #menu-bar .left-buttons");
    if (bar && !document.querySelector(".bs-toggle")) {
      var toggle = el("button", "icon-button bs-toggle", GLASS);
      toggle.type = "button";
      toggle.title = "Search (S or /)";
      toggle.setAttribute("aria-label", "Search the book");
      toggle.setAttribute("aria-keyshortcuts", "s /");
      toggle.addEventListener("click", function () {
        open();
      });
      toggle.addEventListener("pointerenter", load);
      bar.appendChild(toggle);
    }
    var side = document.querySelector(".sidebar-search");
    if (side) {
      side.addEventListener("pointerenter", load);
    }
    // The keys of the search in the help of the keys of mdbook, which names
    // them only when its own search is on.
    var help = document.querySelector("#mdbook-help-popup > div, #help-popup > div");
    if (help && !help.querySelector(".bs-help")) {
      help.insertBefore(el("p", "bs-help", "Press <kbd>S</kbd> or <kbd>/</kbd> to search in the book"), help.children[1] || null);
    }
    // A link to the book can open it on a search: index.html?search=words,
    // as the page of a missing URL does.
    var params = new URLSearchParams(window.location.search);
    if (params.has("search")) {
      var asked = params.get("search");
      params.delete("search");
      var rest = params.toString();
      history.replaceState(null, "", window.location.pathname + (rest ? "?" + rest : "") + window.location.hash);
      open(asked);
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey || document.documentElement.classList.contains("search-open")) {
      return;
    }
    var target = event.target;
    if (target && (/^(input|select|textarea)$/i.test(target.nodeName) || target.isContentEditable)) {
      return;
    }
    if (event.key === "s" || event.key === "S" || event.key === "/") {
      event.preventDefault();
      open();
    }
  });

  window.bookSearch = { open: open, close: close, load: load };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
