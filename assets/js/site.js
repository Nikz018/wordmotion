(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    $$(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.title = dark ? "Switch to light mode" : "Switch to dark mode";
    });
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {}
  }

  function initTheme() {
    let dark = false;
    try {
      const saved = localStorage.getItem("theme");
      dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    applyTheme(dark);
    $$(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyTheme(document.documentElement.getAttribute("data-theme") !== "dark");
      });
    });
  }

  function initMenu() {
    const toggle = $(".nav-toggle");
    const menu = $("#mobile-menu");
    const overlay = $("#overlay");
    const closeBtn = $(".mobile-menu .close-btn");
    if (!toggle || !menu || !overlay) return;

    function openMenu() {
      menu.classList.add("open");
      overlay.classList.add("visible");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      closeBtn && closeBtn.focus();
    }
    function closeMenu() {
      menu.classList.remove("open");
      overlay.classList.remove("visible");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", () => {
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });
    closeBtn && closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
    });
    $$("#mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  function toast(message) {
    let el = $("#tms-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "tms-toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function initCopy() {
    $$("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const text = btn.getAttribute("data-copy");
        try {
          await navigator.clipboard.writeText(text);
          toast(btn.getAttribute("data-copy-ok") || "Copied");
        } catch (e) {
          toast("Could not copy");
        }
      });
    });
  }

  window.TMS = { applyTheme, toast, initTheme, initMenu };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initTheme();
      initMenu();
      initCopy();
    });
  } else {
    initTheme();
    initMenu();
    initCopy();
  }
})();
