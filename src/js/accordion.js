const accordionDetails = document.getElementById("accordionDetails");
const headings = accordionDetails.querySelectorAll(".accordion__heading");
const panels = accordionDetails.querySelectorAll(".accordion__panel");

headings.forEach((heading) => {
  heading.addEventListener("click", () => {
    const iconsHeading = heading.querySelector(".accordion__icons");

    // Allow multiple panel to be expanded
    // ==================================
    // heading.nextElementSibling.classList.toggle("show");

    // Animate icon
    // iconsHeading.firstElementChild.classList.contains("active")
    //   ? collapseIcon(iconsHeading)
    //   : expandIcon(iconsHeading);
    
    // Allow only one panel to be expanded at once
    // ==================================
    panels.forEach((panel) => {
      if (panel.classList.contains("show")) {
        panel.classList.remove("show");
        panel.previousElementSibling.firstElementChild.setAttribute("aria-expanded", "false");
      }
    });
    heading.nextElementSibling.classList.add("show");
    heading.firstElementChild.setAttribute("aria-expanded", "true");

    // Animate icon
    Array.from(accordionDetails.getElementsByClassName("accordion__icons")).forEach(icons => {
      if (icons.firstElementChild.classList.contains("active")) {
        collapseIcon(icons);
      }
    })

    expandIcon(iconsHeading);
  });
});

function expandIcon(icons) {
  if (!icons.firstElementChild.classList.contains("active")) {
    icons.firstElementChild.classList.add("active");
    icons.lastElementChild.classList.remove("active");
  }
}

function collapseIcon(icons) {
  if (icons.firstElementChild.classList.contains("active")) {
    icons.firstElementChild.classList.remove("active");
    icons.lastElementChild.classList.add("active");
  }
}
