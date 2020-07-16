const filters = document.querySelector(".filters");
let prevScrollPos = window.scrollY;

window.addEventListener("scroll", () => {
  let currentScrollPos = window.scrollY;
  if (prevScrollPos > currentScrollPos) {
    filters.classList.add("search__filters--sticky");
  } else {
    filters.classList.remove("search__filters--sticky");
  }
  prevScrollPos = currentScrollPos;
})

const toggleBtnMap = document.getElementById("toggleBtnMap");
const searchResults = document.querySelector(".search__results");
const map = document.querySelector(".map");

toggleBtnMap.addEventListener("click", displayMap);

/**
 * Switch between map and results
 */
function displayMap() {
  if (searchResults.classList.contains("search__results--active")) {
    searchResults.classList.remove("search__results--active");
    map.classList.add("search__map--active");
    toggleBtnMap.setAttribute("aria-pressed", "true");
    document.querySelector(".icon-map").classList.remove("active");
    document.querySelector(".icon-list").classList.add("active");
  } else {
    searchResults.classList.add("search__results--active");
    map.classList.remove("search__map--active");
    toggleBtnMap.setAttribute("aria-pressed", "false");
    document.querySelector(".icon-map").classList.add("active");
    document.querySelector(".icon-list").classList.remove("active");
  }
}
