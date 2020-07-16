import { KEYCODE } from "./keycode.js";
import { openMenu, closeMenu, activateItem } from "./handleMenu.js";

const dropdownMenu = document.querySelector(".dropdown .dropdown__content");
const toggleBtnDropdown = document.querySelector("[data-toggle='dropdown']");

/**
 * Handle open close menu
 */
toggleBtnDropdown.addEventListener("click", toggleMenu);

function toggleMenu() {
  const isExpend = toggleBtnDropdown.getAttribute("aria-expanded");
  isExpend === "false"
    ? openMenu(
        dropdownMenu.parentElement,
        toggleBtnDropdown,
        "dropdown--expanded",
        "li input"
      )
    : closeMenu(
        dropdownMenu.parentElement,
        toggleBtnDropdown,
        "dropdown--expanded"
      );
  resizeElm();
}

/**
 * Close dropdown menu when click outside of dropdown zone
 * @param {event target} e
 */
window.addEventListener("click", closeDropdownOnClickOutside);

function closeDropdownOnClickOutside(e) {
  const isExpend = toggleBtnDropdown.getAttribute("aria-expanded");
  if (isExpend === "true") {
    if (!toggleBtnDropdown.contains(e.target)) {
      if (!dropdownMenu.contains(e.target)) {
        closeMenu(
          dropdownMenu.parentElement,
          toggleBtnDropdown,
          "dropdown--expanded"
        );
        activateItem(toggleBtnDropdown);
      }
    }
  }
}

/**
 * Resize dropdown menu on resizing window
 */
window.addEventListener("resize", resizeElm);

function resizeElm() {
  const previousRightPos = parseInt(dropdownMenu.getBoundingClientRect().right);
  const windowWidth = window.innerWidth;
  const scrollBarWith = windowWidth - document.body.clientWidth;
  const currentRightPos = windowWidth - scrollBarWith;

  if (previousRightPos > windowWidth) {
    dropdownMenu.style.transform = `translateX(-${
      previousRightPos - currentRightPos
    }px)`;
  }
}

/**
 * Handle focus with keys arrows
 */
dropdownMenu.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  switch (e.keyCode) {
    case KEYCODE.ESC:
      closeMenu(
        dropdownMenu.parentElement,
        toggleBtnDropdown,
        "dropdown--expanded"
      );
      activateItem(toggleBtnDropdown);
      break;
  }
}
