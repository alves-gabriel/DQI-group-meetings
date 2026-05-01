(function () {
  function titleFromType(type) {
    return type
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }

  function transformCallout(blockquote) {
    var firstParagraph = blockquote.querySelector("p");
    if (!firstParagraph) {
      return;
    }

    var markerPattern = /^\s*\[!([A-Za-z0-9_-]+)(?:\|([^\]]+))?\]\s*([^\n\r]*)\r?\n?/;
    var firstText = firstParagraph.textContent || "";
    var match = firstText.match(markerPattern);
    if (!match) {
      return;
    }

    var calloutType = match[1].toLowerCase();
    var metadata = (match[2] || "").trim();
    var title = match[3].trim() || titleFromType(calloutType);
    var highlight = metadata.match(/highlight-[A-Za-z0-9_-]+/);

    firstParagraph.textContent = firstText.slice(match[0].length);
    if (firstParagraph.textContent.trim() === "") {
      firstParagraph.remove();
    }

    var titleElement = document.createElement("div");
    titleElement.className = "obsidian-callout-title";
    titleElement.textContent = title;

    var contentElement = document.createElement("div");
    contentElement.className = "obsidian-callout-content";
    while (blockquote.firstChild) {
      contentElement.appendChild(blockquote.firstChild);
    }

    blockquote.classList.add("obsidian-callout");
    blockquote.classList.add("obsidian-callout-" + calloutType);
    blockquote.dataset.callout = calloutType;
    if (metadata) {
      blockquote.dataset.calloutMetadata = metadata;
    }
    if (highlight) {
      blockquote.classList.add("obsidian-" + highlight[0]);
    }

    blockquote.appendChild(titleElement);
    blockquote.appendChild(contentElement);
  }

  function transformAllCallouts() {
    Array.prototype.forEach.call(document.querySelectorAll("blockquote"), function (blockquote) {
      if (!blockquote.classList.contains("obsidian-callout")) {
        transformCallout(blockquote);
      }
    });
    document.documentElement.dataset.obsidianCallouts = String(
      document.querySelectorAll(".obsidian-callout").length
    );
  }

  document.addEventListener("DOMContentLoaded", transformAllCallouts);
  window.addEventListener("load", transformAllCallouts);
})();
