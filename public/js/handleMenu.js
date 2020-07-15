/**
 * Open dropdown
 * @param {get dropdown menu} dropdown
 * @param {get toggle button} btn
 * @param {class to be added} className
 * @param {focus first element when menu is open} getFirstItem
 */
export function openMenu(dropdown, btn, className = "expanded", getFirstItem) {
  if (!dropdown.classList.contains(className)) {
    btn.setAttribute("aria-expanded", "true");
    btn.classList.add("active");
    dropdown.classList.add(className);
  }

  // Focus on first item from the menu
  const firstItem = dropdown.querySelector(getFirstItem);
  activateItem(firstItem);
}

/**
 * Close dropdown
 * @param {get dropdown menu} dropdown
 * @param {get toggle button} btn
 * @param {class to be removed} className
 */
export function closeMenu(dropdown, btn, className = "expanded") {
  if (dropdown.classList.contains(className)) {
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("active");
    dropdown.classList.remove(className);
  }
}

/**
 * Make the current item active by giving focus
 * @param {focus item} item
 */
export function activateItem(item) {
  item.focus();
}
