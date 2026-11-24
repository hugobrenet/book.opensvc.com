// Content.
//
// The body of a page is the markdown mdbook renders, and some of it says in
// words what a reader takes in at a glance when it is drawn: a note written
// "> **Warning:** ...", a paragraph of one bold word ending with a colon that
// names what follows, the keyword reference listing its keywords as text and
// their properties as a block of "name: value" lines. This draws them, the
// markdown left as it is, and theme/content.css styles the whole body:
//
//   - a note, a blockquote opened by Note, Tip, Important, Warning or Caution
//     in bold, an html <div class="warning">, or a GitHub alert mdbook
//     renders, "> [!NOTE]", is a callout of its kind, its title and icon on
//     top;
//   - a paragraph that is only a bold word and a colon, "**Example:**", is
//     the label of what follows;
//   - a code block of a language is labeled with it;
//   - a page of the keyword reference lists the keywords of its driver as
//     links to them, shows the properties of a keyword as tags, and names
//     what a heading is, keyword, driver or section, apart from its name, in
//     the outline of the page too.
//
// The preview of the search draws the sections it shows the same way:
// window.bookContent.enhance(root, url).
//
// What reads the words, kindOf and headingKind, is exported to node, for
// tools/content_test.js.
(function () {
  "use strict";

  var KINDS = {
    note: "Note",
    tip: "Tip",
    important: "Important",
    warning: "Warning",
    caution: "Caution",
  };
  var ICONS = {
    note: '<circle cx="8" cy="8" r="6.25"/><path d="M8 7.25v4M8 4.9v.1"/>',
    tip: '<path d="M6 12.5h4M6.5 14.5h3M8 1.75a4.25 4.25 0 0 0-2.5 7.7c.6.45 1 1.1 1 1.8h3c0-.7.4-1.35 1-1.8A4.25 4.25 0 0 0 8 1.75z"/>',
    important: '<path d="M2.5 2.5h11v8.5h-6l-3 2.5v-2.5h-2zM8 5v3M8 9.4v.1"/>',
    warning: '<path d="M8 1.9 14.6 13.6H1.4zM8 6.2v3.6M8 11.6v.1"/>',
    caution: '<path d="M5.4 1.75h5.2l3.65 3.65v5.2l-3.65 3.65H5.4L1.75 10.6V5.4zM8 4.8v4M8 11v.1"/>',
  };
  // LANGS are the names a code block is labeled with, by its language.
  var LANGS = { bash: "shell", sh: "shell", bashscript: "shell", ini: "ini", yaml: "yaml", json: "json", xml: "xml" };
  var KEYWORDS = /\/agent\.reference\.keywords\//;
  var REFERENCE_HEADING = /^(Keyword|Driver|Section)\s+$/;

  // kindOf is the kind of note a word opens, "Warning" of a warning, or null.
  function kindOf(word) {
    var kind = String(word || "").toLowerCase();
    return Object.prototype.hasOwnProperty.call(KINDS, kind) ? kind : null;
  }

  // headingKind is what a heading of the keyword reference is, keyword,
  // driver or section, from the text before its name and the name, which
  // the reference writes as code: "Keyword `restart`". A heading with no
  // name in code, such as "Keyword changes", is a title, not one of these.
  function headingKind(text, next) {
    var match = REFERENCE_HEADING.exec(text || "");
    return match && next === "CODE" ? match[1].toLowerCase() : null;
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { kindOf: kindOf, headingKind: headingKind };
    return;
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

  function title(kind) {
    var head = el("p", "callout-title");
    head.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true">' + ICONS[kind] + "</svg>";
    head.appendChild(document.createTextNode(KINDS[kind]));
    return head;
  }

  // lead is the bold word a paragraph opens with, its colon after, when the
  // paragraph opens with it: [strong, its text without the colon].
  function lead(p) {
    var first = p && p.firstChild;
    while (first && first.nodeType === 3 && !first.nodeValue.trim()) {
      first = first.nextSibling;
    }
    if (!first || first.nodeName !== "STRONG") {
      return null;
    }
    return [first, first.textContent.replace(/\s*:\s*$/, "").trim()];
  }

  function callouts(root) {
    // The alerts mdbook renders, "> [!NOTE]".
    root.querySelectorAll("blockquote.blockquote-tag").forEach(function (quote) {
      var kind = Object.keys(KINDS).filter(function (k) {
        return quote.classList.contains("blockquote-tag-" + k);
      })[0];
      if (kind) {
        quote.classList.add("callout", "callout-" + kind);
        var head = quote.querySelector(".blockquote-tag-title");
        if (head) {
          head.classList.add("callout-title");
        }
      }
    });
    // "> **Warning:** ..." and <div class="warning">, of the kind of their
    // first word, a warning box a warning when it has none.
    root.querySelectorAll("blockquote:not(.callout)").forEach(function (quote) {
      callout(quote, null);
    });
    root.querySelectorAll("div.warning:not(.callout)").forEach(function (box) {
      callout(box, "warning");
    });
  }

  // callout makes box a note of the kind its first bold word names, the word
  // then its title, or of kind fallback, or leaves it.
  function callout(box, fallback) {
    var p = box.firstElementChild;
    var found = p && p.nodeName === "P" ? lead(p) : null;
    var kind = found && kindOf(found[1]);
    // A paragraph of the word alone, "Note:", not in bold.
    var alone = !kind && p && p.nodeName === "P" && /^\s*\w+\s*:\s*$/.test(p.textContent) ? kindOf(p.textContent.replace(/[\s:]/g, "")) : null;
    if (alone) {
      kind = alone;
      p.remove();
    } else if (kind) {
      found[0].remove();
      // The colon that followed the word, and the space.
      var next = p.firstChild;
      if (next && next.nodeType === 3) {
        next.nodeValue = next.nodeValue.replace(/^\s*:?\s*/, "");
      }
      if (!p.textContent.trim()) {
        p.remove();
      }
    } else if (fallback) {
      kind = fallback;
    } else {
      return;
    }
    box.classList.add("callout", "callout-" + kind);
    box.insertBefore(title(kind), box.firstChild);
  }

  // labels are the paragraphs of a bold word and a colon, "**Example:**".
  function labels(root) {
    root.querySelectorAll("p").forEach(function (p) {
      if (p.closest(".callout-title")) {
        return;
      }
      var found = lead(p);
      if (!found || p.children.length !== 1 || p.textContent.trim() !== found[0].textContent.trim() || !/:\s*$/.test(p.textContent)) {
        return;
      }
      p.classList.add("label");
      found[0].textContent = found[1];
    });
  }

  function code(root) {
    root.querySelectorAll("pre > code").forEach(function (block) {
      var match = /(?:^|\s)language-([\w+-]+)/.exec(block.className);
      var lang = match && LANGS[match[1]];
      if (lang) {
        block.parentNode.setAttribute("data-lang", lang);
      }
    });
  }

  function reference(root, url) {
    root.classList.add("reference");
    // Keyword, Driver or Section, apart from the name it heads; the outline
    // of the page, theme/custom.js, names the heading by its name, whether
    // it is built before or after.
    root.querySelectorAll("h1, h2").forEach(function (heading) {
      var link = heading.querySelector("a.header") || heading;
      var text = link.firstChild;
      if (!text || text.nodeType !== 3) {
        return;
      }
      var kind = headingKind(text.nodeValue, text.nextSibling && text.nextSibling.nodeName);
      if (!kind) {
        return;
      }
      text.remove();
      link.insertBefore(el("span", "ref-kind", kind), link.firstChild);
      var name = link.textContent.slice(kind.length).trim();
      heading.dataset.tocLabel = name;
      // The outline is that of the page, not of a section the preview of
      // the search shows.
      if (!url) {
        document.querySelectorAll(".page-toc a").forEach(function (entry) {
          if (heading.id && entry.getAttribute("href") === "#" + heading.id) {
            entry.textContent = name;
          }
        });
      }
    });
    // The keywords of a driver, as links to them.
    root.querySelectorAll("p.label").forEach(function (p) {
      var list = p.nextElementSibling;
      if (!/^Supported keywords$/.test(p.textContent.trim()) || !list || list.nodeName !== "UL") {
        return;
      }
      list.classList.add("kw-grid");
      list.querySelectorAll("li").forEach(function (item) {
        var name = item.textContent.trim();
        var target = "keyword-" + name;
        if (!root.querySelector("#" + CSS.escape(target))) {
          return;
        }
        var link = el("a");
        // In the preview of the search, the page of the keyword.
        link.href = (url || "") + "#" + target;
        link.textContent = name;
        item.textContent = "";
        item.appendChild(link);
      });
    });
    // The properties of a keyword, "required:    false", as tags.
    root.querySelectorAll('h2[id^="keyword-"]').forEach(function (heading) {
      var pre = heading.nextElementSibling;
      if (!pre || pre.nodeName !== "PRE") {
        return;
      }
      var lines = pre.textContent.split("\n").filter(function (line) {
        return line.trim();
      });
      if (!lines.length || !lines.every(function (line) { return /^\s*[a-z][\w ]*:\s+\S/.test(line); })) {
        return;
      }
      var props = el("div", "kw-props");
      lines.forEach(function (line) {
        var at = line.indexOf(":");
        var key = line.slice(0, at).trim();
        var value = line.slice(at + 1).trim();
        var prop = el("span", "kw-prop");
        prop.setAttribute("data-k", key);
        prop.setAttribute("data-v", value);
        var k = el("span", "k");
        k.textContent = key;
        var v = el("span", "v");
        v.textContent = value;
        prop.appendChild(k);
        prop.appendChild(v);
        props.appendChild(prop);
      });
      pre.parentNode.replaceChild(props, pre);
    });
  }

  function enhance(root, url) {
    if (!root || root.dataset.content === "1") {
      return;
    }
    root.dataset.content = "1";
    callouts(root);
    labels(root);
    code(root);
    if (KEYWORDS.test(url || window.location.pathname)) {
      reference(root, url);
    }
  }

  function init() {
    enhance(document.querySelector(".content main"));
  }

  window.bookContent = { enhance: enhance };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
