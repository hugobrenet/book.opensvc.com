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
  search.addEventListener("click", function () {
    var toggle = document.getElementById("mdbook-search-toggle") || document.getElementById("search-toggle");
    var wrapper = document.getElementById("mdbook-search-wrapper") || document.getElementById("search-wrapper");
    var field = document.getElementById("mdbook-searchbar") || document.getElementById("searchbar");
    if (!toggle) {
      return;
    }
    if (wrapper && !wrapper.classList.contains("hidden")) {
      if (field) {
        field.focus();
      }
      return;
    }
    toggle.click();
  });

  head.appendChild(top);
  head.appendChild(search);
  sections(head);
  sidebar.insertBefore(head, scrollbox);
  sidebar.classList.add("sidebar-with-head");

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
      link.textContent = heading.textContent;
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

// Search in front of the page.
//
// The search opens over the page read, which is grayed out behind it, rather
// than at its top: mdbook shows its search wrapper above the content and
// scrolls the page up to it. The wrapper moves to the end of the body, a
// backdrop covers the page while it shows, a click on the backdrop closes it
// as the search button does, and the page stays where the reader was.
(function () {
  function init() {
    var wrapper = document.getElementById("mdbook-search-wrapper") || document.getElementById("search-wrapper");
    var toggle = document.getElementById("mdbook-search-toggle") || document.getElementById("search-toggle");
    if (!wrapper || !toggle) {
      return;
    }
    var backdrop = document.createElement("div");
    backdrop.className = "search-backdrop";
    document.body.appendChild(backdrop);
    document.body.appendChild(wrapper);
    backdrop.addEventListener("click", function () {
      if (!wrapper.classList.contains("hidden")) {
        toggle.click();
      }
    });
    // Where the reader was before the search opened: mdbook scrolls to the
    // top when it opens the search.
    var y = window.scrollY;
    window.addEventListener("scroll", function () {
      if (wrapper.classList.contains("hidden")) {
        y = window.scrollY;
      }
    }, { passive: true });
    function sync() {
      var open = !wrapper.classList.contains("hidden");
      document.documentElement.classList.toggle("search-open", open);
      if (open) {
        window.scrollTo(0, y);
      }
    }
    new MutationObserver(sync).observe(wrapper, { attributes: true, attributeFilter: ["class"] });
    sync();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Search results.
//
// Each result shows an icon of its kind, a page of the documentation or a
// keyword of the reference, the heading found in bold, and under it where
// the heading is, the path of its page in the book, such as Configure >
// Cluster Quorum. mdbook writes a result as a link of its breadcrumbs,
// "Configure » Cluster Quorum » Enabling Quorum Enforcement", and a teaser:
// the link is rewritten here, the teaser hidden.
(function () {
  var DOC = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5h5.5l3 3v10H4z M9.5 1.5v3h3 M6 8h4.5 M6 10.5h4.5"/></svg>';
  var KEY = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5.5" cy="10.5" r="3"/><path d="M7.6 8.4L14 2 M11.5 4.5l1.5 1.5 M10 6l1.5 1.5"/></svg>';

  function format(item) {
    var link = item.querySelector("a");
    if (!link || item.dataset.formatted) {
      return;
    }
    item.dataset.formatted = "1";
    // mdbook asks the page opened to highlight the words searched, which
    // the reader cannot clear: the link opens the page as it is.
    var href = link.getAttribute("href");
    link.setAttribute("href", href.replace(/\?highlight=[^#]*/, ""));
    var keyword = /agent\.reference\.keywords\//.test(href);
    var parts = link.textContent.split(" » ").map(function (part) {
      return part.trim();
    });
    var title = parts.pop();
    // The heading of a page repeats its name in the breadcrumbs.
    if (parts.length && parts[parts.length - 1] === title) {
      parts.pop();
    }
    if (keyword) {
      title = title.replace(/^Keyword /, "");
      parts.unshift("Keywords");
    }
    var icon = document.createElement("span");
    icon.className = "sr-icon";
    icon.innerHTML = keyword ? KEY : DOC;
    var text = document.createElement("span");
    text.className = "sr-text";
    var strong = document.createElement("span");
    strong.className = "sr-title";
    strong.textContent = title;
    var path = document.createElement("span");
    path.className = "sr-path";
    path.textContent = parts.join(" > ");
    text.appendChild(strong);
    if (parts.length) {
      text.appendChild(path);
    }
    link.textContent = "";
    link.appendChild(icon);
    link.appendChild(text);
    link.setAttribute("aria-label", title + (parts.length ? ", " + parts.join(", ") : ""));
  }

  function init() {
    var list = document.getElementById("mdbook-searchresults") || document.getElementById("searchresults");
    if (!list) {
      return;
    }
    function all() {
      list.querySelectorAll(":scope > li").forEach(format);
    }
    new MutationObserver(all).observe(list, { childList: true });
    all();
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
