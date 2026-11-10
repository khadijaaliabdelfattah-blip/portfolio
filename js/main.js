(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
      const label = themeToggle.querySelector(".theme-label");
      if (label) label.textContent = isDark ? "Light mode" : "Dark mode";
    }
  }

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("khadija-portfolio-theme");
  } catch (error) {
    console.warn("Theme preference could not be read from local storage.", error);
  }
  applyTheme(savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("khadija-portfolio-theme", nextTheme);
    } catch (error) {
      console.warn("Theme preference could not be saved to local storage.", error);
    }
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");
  const filterStatus = document.querySelector("[data-filter-status]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      projectCards.forEach((card) => {
        const isVisible = filter === "all" || card.dataset.category === filter;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });
      if (filterStatus) filterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"} shown.`;
    });
  });

  const contactForm = document.querySelector("[data-contact-form]");
  const formFeedback = document.querySelector("[data-form-feedback]");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    if (formFeedback) {
      formFeedback.classList.remove("is-error");
      formFeedback.textContent = "Your details look good. This static site cannot send the message yet; please use the email link to get in touch.";
    }
    contactForm.reset();
  });
})();
