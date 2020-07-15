import { KEYCODE } from "./keycode.js";
import { openMenu, closeMenu, activateItem } from "./handleMenu.js";

const toggleBtn = document.getElementById("navbarBtn");
const dropdown = document.getElementById("navDropdown");

/**
 * Handle open close menu
 */
toggleBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  const isExpend = toggleBtn.getAttribute("aria-expanded");
  isExpend === "false"
    ? openMenu(
        dropdown,
        toggleBtn,
        "navbar__dropdown--extended",
        ".nav-account .btn"
      )
    : closeMenu(dropdown, toggleBtn, "navbar__dropdown--extended");
}

/**
 * Close dropdown menu when click outside of dropdown zone
 * @param {event target} e
 */
window.addEventListener("click", closeDropdownOnClickOutside);

function closeDropdownOnClickOutside(e) {
  const isExpend = toggleBtn.getAttribute("aria-expanded");
  if (isExpend === "true") {
    if (!toggleBtn.contains(e.target)) {
      if (!dropdown.contains(e.target)) {
        closeMenu(dropdown, toggleBtn, "navbar__dropdown--extended");
        activateItem(toggleBtn);
      }
    }
  }
}

/**
 * Handle focus with keys arrows
 */
dropdown.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  switch (e.keyCode) {
    case KEYCODE.ESC:
      closeMenu(dropdown, toggleBtn, "navbar__dropdown--extended");
      activateItem(toggleBtn);
      break;
  }
}
