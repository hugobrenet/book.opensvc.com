// Tabs.
//
// A page shows how to do a thing with the command line, and the same thing
// through the api. Both belong on the page, and only one belongs on the
// screen: the reader is doing one or the other.
//
// The markup is written in the page as
//
//     <div class="tabs">
//     <div class="tab" data-title="CLI">
//     ...markdown...
//     </div>
//     <div class="tab" data-title="API">
//     ...markdown...
//     </div>
//     </div>
//
// With no javascript the panes render one after the other, each under its own
// heading, which is the whole content in reading order rather than a broken
// control.
//
// The choice is remembered, and applies to every group on every page: a
// reader who came for the api came for the api.
(function () {
  var KEY = "opensvc.tab";

  function remembered() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function remember(title) {
    try {
      window.localStorage.setItem(KEY, title);
    } catch (e) {
      /* a reader who blocks storage just picks again */
    }
  }

  function select(group, title) {
    group.querySelectorAll(":scope > .tab").forEach(function (pane) {
      pane.classList.toggle("tab-selected", pane.dataset.title === title);
    });
    group.querySelectorAll(":scope > .tab-bar > button").forEach(function (button) {
      var on = button.textContent === title;
      button.classList.toggle("tab-selected", on);
      button.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function build(group) {
    var panes = Array.prototype.slice.call(group.querySelectorAll(":scope > .tab"));
    if (panes.length < 2) {
      return;
    }
    var titles = panes.map(function (pane) {
      return pane.dataset.title || "";
    });
    var bar = document.createElement("div");
    bar.className = "tab-bar";
    bar.setAttribute("role", "tablist");
    titles.forEach(function (title) {
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.textContent = title;
      button.addEventListener("click", function () {
        remember(title);
        // Every group moves together: the reader picked a way of working,
        // not a pane of one example.
        document.querySelectorAll(".tabs").forEach(function (other) {
          select(other, title);
        });
      });
      bar.appendChild(button);
    });
    group.insertBefore(bar, panes[0]);
    group.classList.add("tabs-ready");

    var wanted = remembered();
    select(group, titles.indexOf(wanted) >= 0 ? wanted : titles[0]);
  }

  function init() {
    document.querySelectorAll(".tabs").forEach(build);
  }

  // The script is loaded at the end of the body, so the document is still
  // parsing when it runs. Reading the state rather than assuming it keeps the
  // tabs working if it is ever loaded deferred or injected.
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Markdown.
//
// Every page is also published as markdown, next to its html page, for the
// language models and the assistants that read the book: llms.txt at the root
// lists them. The head of the page links its markdown. A menu on the right of
// the title of the page copies it, for the reader to paste it to an
// assistant, or opens it; its button copies at once. The print page, the
// whole book, has none.
(function () {
  // The copy, check, markdown and chevron icons of Font Awesome Free 6.2.0
  // (Icons: CC BY 4.0).
  var COPY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>';
  var CHECK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>';
  var MARKDOWN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"/></svg>';
  var CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>';

  // copy puts the markdown at href in the clipboard. The text is handed to
  // the clipboard as a promise when the browser can: one that copies only
  // what is at hand when clicked would refuse a text that arrives later.
  function copy(href) {
    var text = fetch(href).then(function (response) {
      if (!response.ok) {
        throw new Error(href + ": " + response.status);
      }
      return response.text();
    });
    var clipboard = navigator.clipboard;
    if (clipboard && clipboard.write && window.ClipboardItem) {
      return clipboard.write([new window.ClipboardItem({
        "text/plain": text.then(function (markdown) {
          return new Blob([markdown], { type: "text/plain" });
        }),
      })]);
    }
    if (clipboard && clipboard.writeText) {
      return text.then(function (markdown) {
        return clipboard.writeText(markdown);
      });
    }
    return Promise.reject(new Error("no clipboard"));
  }

  function icon(svg) {
    return '<span class="page-actions-icon">' + svg + "</span>";
  }

  // item is an entry of the menu: an icon, a name and what it does.
  function item(tag, svg, name, detail) {
    var entry = document.createElement(tag);
    entry.className = "page-actions-item";
    entry.setAttribute("role", "menuitem");
    entry.innerHTML = icon(svg) + '<span class="page-actions-text"><span class="page-actions-name">' + name +
      '</span><span class="page-actions-detail">' + detail + "</span></span>";
    return entry;
  }

  function init() {
    var markdown = document.querySelector('link[rel="alternate"][type="text/markdown"]');
    var title = document.querySelector(".content main h1");
    // The page of a missing URL has nothing to copy.
    if (!markdown || !title || /\/print\.html$/.test(window.location.pathname) || /(^|\/)404\.md$/.test(markdown.getAttribute("href"))) {
      return;
    }
    var href = markdown.getAttribute("href");

    var actions = document.createElement("div");
    actions.className = "page-actions";
    // The button links the markdown too: with no script to copy it, or
    // opened in a new tab, it shows it.
    var main = document.createElement("a");
    main.className = "page-actions-main";
    main.href = href;
    main.innerHTML = icon(COPY) + '<span class="page-actions-label">Copy page</span>';
    var more = document.createElement("button");
    more.type = "button";
    more.className = "page-actions-more";
    more.setAttribute("aria-label", "More ways to read this page");
    more.setAttribute("aria-haspopup", "menu");
    more.setAttribute("aria-expanded", "false");
    more.innerHTML = icon(CHEVRON);
    var menu = document.createElement("div");
    menu.className = "page-actions-menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    var copyItem = item("button", COPY, "Copy page", "Copy this page as Markdown for LLMs");
    copyItem.type = "button";
    var viewItem = item("a", MARKDOWN, "View as Markdown", "View this page as plain text");
    viewItem.href = href;
    menu.appendChild(copyItem);
    menu.appendChild(viewItem);
    actions.appendChild(main);
    actions.appendChild(more);
    actions.appendChild(menu);

    function close() {
      menu.hidden = true;
      more.setAttribute("aria-expanded", "false");
    }
    var label = main.querySelector(".page-actions-label");
    var mark = main.querySelector(".page-actions-icon");
    function run() {
      close();
      copy(href).then(function () {
        label.textContent = "Copied";
        mark.innerHTML = CHECK;
      }, function () {
        label.textContent = "Copy failed";
      }).then(function () {
        window.setTimeout(function () {
          label.textContent = "Copy page";
          mark.innerHTML = COPY;
        }, 2000);
      });
    }
    main.addEventListener("click", function (event) {
      event.preventDefault();
      run();
    });
    copyItem.addEventListener("click", run);
    viewItem.addEventListener("click", close);
    more.addEventListener("click", function (event) {
      event.stopPropagation();
      menu.hidden = !menu.hidden;
      more.setAttribute("aria-expanded", String(!menu.hidden));
    });
    document.addEventListener("click", function (event) {
      if (!actions.contains(event.target)) {
        close();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        close();
      }
    });

    // The title and the menu share a row: the menu on the right of the
    // column, next to the outline of the page.
    var row = document.createElement("div");
    row.className = "page-title-row";
    title.parentNode.insertBefore(row, title);
    row.appendChild(title);
    row.appendChild(actions);
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// The page of a missing URL names the path asked, offers to search the book
// for its words, and points to the page of the same name under agent/ when
// there is one: most missing URLs are pages of the agent asked at the root,
// where the book had them before v3.
(function () {
  function init() {
    var box = document.querySelector(".not-found");
    if (!box) {
      return;
    }
    var path = window.location.pathname;
    var heading = box.querySelector("h1");
    var asked = document.createElement("p");
    asked.className = "not-found-path";
    asked.appendChild(document.createTextNode("No page at "));
    var code = document.createElement("code");
    code.textContent = path;
    asked.appendChild(code);
    asked.appendChild(document.createTextNode("."));
    heading.parentNode.insertBefore(asked, heading.nextSibling);

    var name = path.split("/").pop().replace(/\.(html|md)$/, "");
    var words = name.split(/[._-]+/).filter(function (word) {
      return word && word !== "index" && !/^v?\d+$/.test(word);
    }).join(" ");
    var search = box.querySelector(".not-found-search");
    if (search && words) {
      search.href = "index.html?search=" + encodeURIComponent(words);
      search.textContent = "Search the book for “" + words + "”";
    }

    if (!name || /^\/(v[^/]+\/)?agent\//.test(path)) {
      return;
    }
    var version = (path.match(/^\/v[^/]+\//) || ["/"])[0];
    var candidate = version + "agent/" + name + ".html";
    fetch(candidate, { method: "HEAD" }).then(function (r) {
      if (!r.ok) {
        return;
      }
      var link = document.createElement("a");
      link.className = "not-found-button not-found-primary";
      link.href = candidate;
      link.textContent = "Go to " + candidate;
      var actions = box.querySelector(".not-found-actions");
      actions.insertBefore(link, actions.firstChild);
    }).catch(function () { /* no hint */ });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Sidebar head.
//
// The logo of OpenSVC at the top left, the release picker next to it, and
// under them the search, as a field: it opens the search of the book, which
// the menu bar then shows only while the sidebar is hidden. The head is built
// here, not in the theme, for the book to keep the page template of the
// mdbook version that builds it.
(function () {
  var sidebar = document.querySelector("nav.sidebar");
  var scrollbox = sidebar && sidebar.querySelector(".sidebar-scrollbox");
  if (!scrollbox) {
    return;
  }
  var root = typeof path_to_root === "undefined" ? "" : path_to_root;

  var head = document.createElement("div");
  head.className = "sidebar-head";

  var top = document.createElement("div");
  top.className = "sidebar-brand";
  var home = document.createElement("a");
  home.className = "sidebar-home";
  home.href = root + "index.html";
  var logo = document.createElement("img");
  logo.src = root + "images/opensvc-logo.svg";
  logo.alt = "";
  var name = document.createElement("span");
  name.textContent = "OpenSVC";
  home.appendChild(logo);
  home.appendChild(name);
  var versions = document.createElement("span");
  versions.className = "sidebar-versions";
  top.appendChild(home);
  top.appendChild(versions);

  var search = document.createElement("button");
  search.type = "button";
  search.className = "sidebar-search";
  search.setAttribute("aria-label", "Search the book");
  search.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6.5" cy="6.5" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '<line x1="10.2" y1="10.2" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
    "<span>Search…</span><kbd>S</kbd>";
  // The search is theme/search.js.
  search.addEventListener("click", function () {
    if (window.bookSearch) {
      window.bookSearch.open();
    }
  });

  head.appendChild(top);
  head.appendChild(search);
  sections(head);
  parts();
  here();
  sidebar.insertBefore(head, scrollbox);
  sidebar.classList.add("sidebar-with-head");

  // The link of the page read does not load it again: it takes the reader
  // back to its top, and, on a screen too narrow to keep the sidebar open,
  // closes the sidebar as a page loaded would. A click to open it in another
  // tab or window is left to the browser.
  function here() {
    function path(pathname) {
      return decodeURIComponent(pathname).replace(/\/index\.html$/, "/");
    }
    scrollbox.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }
      if (link.origin !== window.location.origin || path(link.pathname) !== path(window.location.pathname)) {
        return;
      }
      if (link.hash && link.hash !== window.location.hash) {
        return;
      }
      event.preventDefault();
      var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      var toggle = document.getElementById("mdbook-sidebar-toggle-anchor") || document.getElementById("sidebar-toggle-anchor");
      if (toggle && toggle.checked && !window.matchMedia("(min-width: 1080px)").matches) {
        toggle.checked = false;
        toggle.dispatchEvent(new Event("change"));
      }
    });
  }

  // The parts of the summary, Get Started, Agent, Apps..., each with an icon
  // before its title, and their pages aligned on the title, under it: a part
  // stands apart from its pages by more than the weight of its name. A part
  // the list does not know has the icon of a folder.
  //
  // A part folds and unfolds its pages when its title, a button, is clicked,
  // or when Enter or Space is pressed on it, a chevron telling which.
  // The parts folded are remembered from a page to the next, by their names,
  // the release the keyword reference names left out; the part of the page
  // read opens unfolded.
  function parts() {
    var ICONS = [
      [/^Get Started\b/, '<path d="M9.5 2.5c2-1 4-1 4-1s0 2-1 4l-4 4-3-3zM6.5 6.5 4 6.2 2.2 8l3 .6M9.5 9.5l.3 2.5L8 13.8l-.6-3M4.6 11.4c-1 .5-1.6 2.1-1.6 2.1s1.6-.6 2.1-1.6"/><circle cx="10.6" cy="5.4" r=".9"/>'],
      [/^Agent Keywords Reference\b/, '<circle cx="5.5" cy="10.5" r="3"/><path d="M7.6 8.4 14 2M11.5 4.5l1.5 1.5M10 6l1.5 1.5"/>'],
      [/^Agent\b/, '<rect x="2" y="2.5" width="12" height="4.5" rx="1"/><rect x="2" y="9" width="12" height="4.5" rx="1"/><path d="M4.6 4.75h.01M4.6 11.25h.01"/>'],
      [/^Apps\b/, '<path d="M8 1.75 13.75 5v6L8 14.25 2.25 11V5zM2.25 5 8 8.25 13.75 5M8 8.25v6"/>'],
      [/^Dig\b/, '<rect x="4" y="4" width="8" height="8" rx="1"/><path d="M6 1.5V4M10 1.5V4M6 12v2.5M10 12v2.5M1.5 6H4M1.5 10H4M12 6h2.5M12 10h2.5"/>'],
      [/^AI Assistant\b/, '<path d="M6.5 2l1.1 3.4L11 6.5 7.6 7.6 6.5 11 5.4 7.6 2 6.5l3.4-1.1zM12 9.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z"/>'],
      [/^HOWTOs\b/i, '<path d="M8 4C6.5 2.8 4.5 2.5 2 2.75v9.5c2.5-.25 4.5.05 6 1.25 1.5-1.2 3.5-1.5 6-1.25v-9.5C11.5 2.5 9.5 2.8 8 4zM8 4v9.5"/>'],
      [/^Appendix\b/, '<path d="M10.5 5 6 9.5a1.4 1.4 0 0 0 2 2l5-5a2.8 2.8 0 0 0-4-4l-5 5a4.2 4.2 0 0 0 6 6l4-4"/>'],
    ];
    var FOLDER = '<path d="M2 4.5a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>';
    var titles = scrollbox.querySelectorAll("ol.chapter > li.part-title");
    if (!titles.length) {
      return;
    }
    Array.prototype.forEach.call(titles, function (item) {
      var name = item.textContent.trim();
      var icon = FOLDER;
      ICONS.some(function (entry) {
        if (entry[0].test(name)) {
          icon = entry[1];
          return true;
        }
        return false;
      });
      // The title is a button in the item of the list, which folds the part.
      var button = document.createElement("button");
      button.type = "button";
      button.className = "part-toggle";
      button.innerHTML = '<svg class="part-icon" viewBox="0 0 16 16" aria-hidden="true">' + icon + "</svg>";
      var label = document.createElement("span");
      label.className = "part-name";
      while (item.firstChild) {
        label.appendChild(item.firstChild);
      }
      button.appendChild(label);
      button.insertAdjacentHTML("beforeend", '<svg class="part-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>');
      item.appendChild(button);
    });
    sidebar.classList.add("sidebar-with-part-icons");
    folding(Array.prototype.slice.call(titles));
  }

  function folding(titles) {
    var KEY = "opensvc.sidebar.folded";
    function load() {
      try {
        var list = JSON.parse(window.localStorage.getItem(KEY));
        return Array.isArray(list) ? list : [];
      } catch (e) {
        return [];
      }
    }
    function save(list) {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(list));
      } catch (e) {
        /* a reader who blocks storage folds again */
      }
    }
    // The pages of a part are the items after its title, to the next one.
    function pages(title) {
      var out = [];
      for (var node = title.nextElementSibling; node && !node.classList.contains("part-title"); node = node.nextElementSibling) {
        out.push(node);
      }
      return out;
    }
    function fold(title, folded) {
      title.classList.toggle("part-folded", folded);
      title.querySelector(".part-toggle").setAttribute("aria-expanded", String(!folded));
      pages(title).forEach(function (node) {
        node.classList.toggle("part-folded-page", folded);
      });
    }
    var here = window.location.pathname.replace(/\/index\.html$/, "/");
    var folded = load();
    titles.forEach(function (title) {
      var name = title.querySelector(".part-name").textContent.replace(/\s*\(.*\)\s*$/, "").trim();
      var current = pages(title).some(function (node) {
        return node.querySelector("a.active") || Array.prototype.some.call(node.querySelectorAll("a[href]"), function (a) {
          return a.pathname.replace(/\/index\.html$/, "/") === here;
        });
      });
      fold(title, folded.indexOf(name) >= 0 && !current);
      function toggle() {
        var now = !title.classList.contains("part-folded");
        fold(title, now);
        var list = load().filter(function (other) {
          return other !== name;
        });
        if (now) {
          list.push(name);
        }
        save(list);
      }
      title.querySelector(".part-toggle").addEventListener("click", toggle);
    });
  }

  // The sidebar shows one of two sections, the documentation or the keyword
  // reference, its part of the summary: picked under the search, and set
  // by the page read. Picking the other opens its first page.
  function sections(head) {
    var chapters = scrollbox.querySelector("ol.chapter");
    var items = chapters ? Array.prototype.slice.call(chapters.children) : [];
    var start = -1;
    items.forEach(function (item, i) {
      if (start < 0 && item.classList.contains("part-title") && /^\s*Agent Keywords Reference\b/.test(item.textContent)) {
        start = i;
      }
    });
    if (start < 0) {
      return;
    }
    var keywords = items.slice(start);
    var documentation = items.slice(0, start);
    var first = keywords.map(function (item) { return item.querySelector("a[href]"); }).filter(Boolean)[0];
    var current = /\/agent\.reference\.keywords\//.test(window.location.pathname) ? "keywords" : "documentation";

    var picker = document.createElement("span");
    picker.className = "sidebar-section";
    var select = document.createElement("select");
    select.setAttribute("aria-label", "sidebar section");
    [["documentation", "Documentation"], ["keywords", "Keywords"]].forEach(function (choice) {
      var option = document.createElement("option");
      option.value = choice[0];
      option.textContent = choice[1];
      option.selected = choice[0] === current;
      select.appendChild(option);
    });
    select.addEventListener("change", function () {
      if (this.value === "keywords") {
        if (first) {
          window.location.href = first.href;
        }
      } else {
        window.location.href = root + "index.html";
      }
    });
    picker.appendChild(select);
    head.appendChild(picker);
    sidebar.classList.add("sidebar-with-sections");

    (current === "keywords" ? documentation : keywords).forEach(function (item) {
      item.classList.add("sidebar-section-hidden");
    });
  }

  // The theme button and its menu, then the link to the git repository,
  // move next to the release picker while the sidebar shows, and back to the
  // menu bar while it is hidden. Moved, not copied: the book script keeps its
  // listeners on them. The repository gets its icon drawn here: mdbook 0.4
  // has no GitHub icon in its font.
  var toggle = document.getElementById("mdbook-theme-toggle") || document.getElementById("theme-toggle");
  var list = document.getElementById("mdbook-theme-list") || document.getElementById("theme-list");
  var git = document.querySelector('#mdbook-menu-bar a[title="Git repository"], #menu-bar a[title="Git repository"]');
  if (git) {
    git.className = "sidebar-git";
    git.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
  }
  var groups = [];
  if (toggle && list) {
    var theme = document.createElement("span");
    theme.className = "sidebar-theme";
    top.appendChild(theme);
    groups.push({ slot: theme, items: [toggle, list] });
  }
  if (git) {
    groups.push({ slot: top, items: [git] });
  }
  groups.forEach(function (group) {
    group.anchor = document.createComment("moved");
    group.items[0].parentNode.insertBefore(group.anchor, group.items[0]);
  });
  var html = document.documentElement;
  function place() {
    var visible = html.classList.contains("sidebar-visible");
    groups.forEach(function (group) {
      var inSidebar = group.items[0].parentNode === group.slot;
      if (visible && !inSidebar) {
        group.items.forEach(function (item) { group.slot.appendChild(item); });
      } else if (!visible && inSidebar) {
        group.items.slice().reverse().forEach(function (item) {
          group.anchor.parentNode.insertBefore(item, group.anchor.nextSibling);
        });
      }
    });
  }
  place();
  new MutationObserver(place).observe(html, { attributes: true, attributeFilter: ["class"] });
})();

// Page outline.
//
// The headings of the page read, h2 and h3, are listed on its right on a wide
// screen, the one being read marked: the sidebar lists the pages, not their
// headings. A page with fewer than two headings has none. The headings of the
// panes of a tab group are left out: all but one are hidden.
(function () {
  function init() {
    var main = document.querySelector(".content main");
    if (!main) {
      return;
    }
    var headings = [].slice.call(main.querySelectorAll("h2[id], h3[id]")).filter(function (h) {
      return !h.closest(".tabs");
    });
    if (headings.length < 2) {
      return;
    }
    var nav = document.createElement("nav");
    nav.className = "page-toc";
    nav.setAttribute("aria-label", "On this page");
    var title = document.createElement("div");
    title.className = "page-toc-title";
    title.textContent = "On this page";
    nav.appendChild(title);
    var list = document.createElement("ol");
    var links = [];
    headings.forEach(function (heading) {
      var item = document.createElement("li");
      item.className = "page-toc-" + heading.tagName.toLowerCase();
      var link = document.createElement("a");
      link.href = "#" + heading.id;
      // A heading of the keyword reference is named by its name, without
      // what it is, theme/content.js.
      link.textContent = heading.dataset.tocLabel || heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
      links.push(link);
    });
    nav.appendChild(list);
    document.body.appendChild(nav);
    document.documentElement.classList.add("has-page-toc");

    // The heading read is the last one above a quarter of the window, the
    // first one before the reader scrolled to any.
    var current = -1;
    function mark() {
      var line = window.innerHeight / 4;
      var found = 0;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top > line) {
          break;
        }
        found = i;
      }
      // At the foot of the page, the last headings never reach the line:
      // the last one is the one read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        found = headings.length - 1;
      }
      if (found === current) {
        return;
      }
      if (current >= 0) {
        links[current].classList.remove("active");
      }
      links[found].classList.add("active");
      current = found;
    }
    var pending = false;
    window.addEventListener("scroll", function () {
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(function () {
          pending = false;
          mark();
        });
      }
    }, { passive: true });
    mark();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Pager.
//
// The previous and the next page are offered at the foot of the page read,
// each with its title as the sidebar names it, rather than as arrows on the
// sides of the screen. mdbook draws both: the arrows of the sides are hidden,
// and the links at the foot, which it shows only on a narrow screen, get
// their titles here.
(function () {
  function titleOf(href) {
    var target = new URL(href, window.location.href).pathname;
    var links = document.querySelectorAll(".sidebar a[href]");
    for (var i = 0; i < links.length; i++) {
      if (new URL(links[i].href).pathname === target) {
        var copy = links[i].cloneNode(true);
        copy.querySelectorAll("strong").forEach(function (number) {
          number.remove();
        });
        return copy.textContent.trim();
      }
    }
    return "";
  }

  // The keyword reference and the documentation are two sections of the
  // sidebar: the pager does not lead from one to the other.
  function keywords(href) {
    return /\/agent\.reference\.keywords\//.test(new URL(href, window.location.href).pathname);
  }

  function init() {
    var nav = document.querySelector(".content .nav-wrapper");
    if (!nav) {
      return;
    }
    var here = keywords(window.location.href);
    // The arrows of the sides go too: the arrow keys follow them.
    document.querySelectorAll(".nav-wrapper a[href], .nav-wide-wrapper a[href]").forEach(function (link) {
      if (keywords(link.getAttribute("href")) !== here) {
        link.remove();
      }
    });
    nav.classList.add("pager");
    nav.querySelectorAll("a.mobile-nav-chapters").forEach(function (link) {
      var next = link.classList.contains("next");
      var direction = document.createElement("span");
      direction.className = "pager-direction";
      direction.textContent = next ? "Next" : "Previous";
      var title = document.createElement("span");
      title.className = "pager-title";
      title.textContent = titleOf(link.getAttribute("href")) || (next ? "Next page" : "Previous page");
      link.textContent = "";
      link.appendChild(direction);
      link.appendChild(title);
      link.classList.add("pager-link");
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Fixed sidebar.
//
// On a wide screen the sidebar always shows: its toggle and its resize handle
// are hidden, and a sidebar the reader hid before is shown again. On a narrow
// screen it keeps folding, as it would cover the page. mdbook 0.4 and 0.5
// name the toggle differently.
(function () {
  var wide = window.matchMedia("(min-width: 1080px)");
  function show() {
    if (!wide.matches) {
      return;
    }
    var anchor = document.getElementById("mdbook-sidebar-toggle-anchor") || document.getElementById("sidebar-toggle-anchor");
    var sidebar = document.querySelector(".sidebar");
    if (anchor) {
      anchor.checked = true;
    }
    // mdbook hides the sidebar it found folded with display: none, which the
    // checkbox alone does not undo.
    if (sidebar) {
      sidebar.style.display = "";
    }
    document.documentElement.classList.remove("sidebar-hidden");
    document.documentElement.classList.add("sidebar-visible");
    if (sidebar) {
      sidebar.setAttribute("aria-hidden", "false");
      sidebar.querySelectorAll("a").forEach(function (link) {
        link.tabIndex = 0;
      });
    }
    try {
      localStorage.setItem("mdbook-sidebar", "visible");
    } catch (e) {}
  }
  show();
  wide.addEventListener("change", show);
})();

// Back to top.
//
// A button at the bottom right of the screen takes the reader back to the top
// of the page, once they read a screen below it: a long page, the pages of
// the keyword reference above all, is otherwise climbed back by scrolling.
// The focus goes to the title of the page, for the keys to read on from
// there.
(function () {
  var button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.title = "Back to top";
  button.setAttribute("aria-label", "Back to top");
  button.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>';
  document.body.appendChild(button);

  var shown = false;
  function update() {
    var on = window.scrollY > window.innerHeight;
    if (on !== shown) {
      shown = on;
      button.classList.toggle("back-to-top-shown", on);
    }
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  button.addEventListener("click", function () {
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
    var title = document.querySelector(".content main h1");
    if (title) {
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });
    }
  });
})();

// Prefetch.
//
// A page of the book is fetched while the reader is about to open it, when
// the pointer rests on its link, a finger touches it or the keys focus it, so
// it shows at once when the link is followed: the book is static, and each
// page is loaded whole. Only the page is fetched, not its scripts, and none
// runs: a page prefetched and never opened is not a page view.
//
// Chrome and Edge do it themselves, told by speculation rules which links
// are the pages of the book. The other browsers are given a <link
// rel=prefetch> for the page of the link, once.
(function () {
  var supports = window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules");
  if (supports) {
    var rules = document.createElement("script");
    rules.type = "speculationrules";
    rules.textContent = JSON.stringify({
      prefetch: [{
        source: "document",
        where: { and: [{ href_matches: "/*.html" }, { not: { selector_matches: "[download], [target=_blank]" } }] },
        eagerness: "moderate",
      }],
    });
    document.head.appendChild(rules);
    return;
  }

  var fetched = {};
  var timer = null;

  // page is the page a link opens, when it is another page of the book.
  function page(link) {
    if (!link || !link.href || link.hasAttribute("download") || link.origin !== window.location.origin) {
      return null;
    }
    if (!/\.html$/.test(link.pathname) || link.pathname === window.location.pathname) {
      return null;
    }
    return link.origin + link.pathname;
  }

  function prefetch(url) {
    if (!url || fetched[url]) {
      return;
    }
    fetched[url] = true;
    var hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = url;
    document.head.appendChild(hint);
  }

  document.addEventListener("mouseover", function (event) {
    var url = page(event.target.closest && event.target.closest("a[href]"));
    clearTimeout(timer);
    if (url) {
      timer = setTimeout(function () {
        prefetch(url);
      }, 65);
    }
  }, { passive: true });
  document.addEventListener("mouseout", function () {
    clearTimeout(timer);
  }, { passive: true });
  ["touchstart", "focusin"].forEach(function (type) {
    document.addEventListener(type, function (event) {
      prefetch(page(event.target.closest && event.target.closest("a[href]")));
    }, { passive: true });
  });
})();
