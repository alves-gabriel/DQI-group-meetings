(function () {
  const rows = Array.from(document.querySelectorAll(".event-row"));
  const sections = Array.from(document.querySelectorAll(".archive-year"));
  const tagButtons = Array.from(document.querySelectorAll(".tag-button"));
  const emptyMessage = document.getElementById("archive-empty");
  const activeTags = new Set();
  const controls = {
    search: document.getElementById("archive-search"),
    status: document.getElementById("archive-status"),
    year: document.getElementById("archive-year"),
    reset: document.getElementById("archive-reset")
  };

  if (!rows.length || !controls.search) {
    return;
  }

  function normalize(value) {
    return (value || "").trim().toLowerCase();
  }

  function uniqueValues(attribute) {
    return Array.from(
      new Set(
        rows
          .map((row) => row.dataset[attribute] || "")
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }

  function addOptions(select, values) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function rowTags(row) {
    return (row.dataset.tags || "")
      .split("|")
      .map(normalize)
      .filter(Boolean);
  }

  function rowMatches(row) {
    const search = normalize(controls.search.value);
    const status = controls.status.value;
    const year = controls.year.value;
    const tags = rowTags(row);

    return (
      (!search || (row.dataset.search || "").includes(search)) &&
      (!status || row.dataset.status === status) &&
      (!year || row.dataset.year === year) &&
      Array.from(activeTags).every((tag) => tags.includes(tag))
    );
  }

  function updateTagButtons() {
    tagButtons.forEach((button) => {
      const isActive = activeTags.has(normalize(button.dataset.tag));
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateSections() {
    let visibleRows = 0;

    rows.forEach((row) => {
      const isVisible = rowMatches(row);
      row.hidden = !isVisible;
      if (isVisible) {
        visibleRows += 1;
      }
    });

    sections.forEach((section) => {
      const hasVisibleRows = Array.from(section.querySelectorAll(".event-row")).some(
        (row) => !row.hidden
      );
      section.hidden = !hasVisibleRows;
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleRows > 0;
    }

    updateTagButtons();
  }

  addOptions(controls.year, uniqueValues("year").reverse());

  [
    controls.search,
    controls.status,
    controls.year
  ].forEach((control) => {
    control.addEventListener("input", updateSections);
    control.addEventListener("change", updateSections);
  });

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTag = normalize(button.dataset.tag);
      if (activeTags.has(selectedTag)) {
        activeTags.delete(selectedTag);
      } else {
        activeTags.add(selectedTag);
      }
      updateSections();
    });
  });

  controls.reset.addEventListener("click", () => {
    controls.search.value = "";
    controls.status.value = "";
    controls.year.value = "";
    activeTags.clear();
    updateSections();
    controls.search.focus();
  });

  updateTagButtons();
})();
