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
// lists them. The head of the page links its markdown, the whole book on the
// print page. One button opens it, the other copies it, for the reader to
// paste it to an assistant.
(function () {
  // The markdown logo of Font Awesome Free 6.2.0, as the other buttons of the
  // menu bar draw theirs (Icons: CC BY 4.0).
  var ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"/></svg>';
  // The copy and check icons of Font Awesome Free 6.2.0.
  var COPY = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>';
  var CHECK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>';
  var COPY_TITLE = "Copy as Markdown for LLMs";

  function button(href, title, icon) {
    var link = document.createElement("a");
    link.href = href;
    link.title = title;
    link.setAttribute("aria-label", title);
    link.innerHTML = '<span class="fa-svg">' + icon + "</span>";
    return link;
  }

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

  // tell shows on the copy button what the copy did, then puts it back.
  function tell(link, title, icon) {
    link.title = title;
    link.setAttribute("aria-label", title);
    link.querySelector(".fa-svg").innerHTML = icon;
    window.setTimeout(function () {
      link.title = COPY_TITLE;
      link.setAttribute("aria-label", COPY_TITLE);
      link.querySelector(".fa-svg").innerHTML = COPY;
    }, 2000);
  }

  function init() {
    var markdown = document.querySelector('link[rel="alternate"][type="text/markdown"]');
    // mdbook 0.5 names the menu bar mdbook-menu-bar, earlier ones menu-bar.
    var buttons = document.querySelector("#mdbook-menu-bar .right-buttons, #menu-bar .right-buttons");
    if (!markdown || !buttons) {
      return;
    }
    var href = markdown.getAttribute("href");
    var open = button(href, "Markdown of this page", ICON);
    // The copy button links the markdown too: with no script to copy it, or
    // opened in a new tab, it shows it.
    var copier = button(href, COPY_TITLE, COPY);
    copier.addEventListener("click", function (event) {
      event.preventDefault();
      copy(href).then(function () {
        tell(copier, "Copied", CHECK);
      }, function () {
        tell(copier, "Copy failed: open the markdown instead", COPY);
      });
    });
    buttons.insertBefore(copier, buttons.firstChild);
    buttons.insertBefore(open, copier);
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
