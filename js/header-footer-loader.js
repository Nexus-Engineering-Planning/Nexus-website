document.addEventListener("DOMContentLoaded", function () {
  const version = 'v4'; // Change this whenever you update header/footer

  fetch(`/header.html?${version}`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("global-header").innerHTML = data;

      // Highlight active nav link based on current URL
      const path = window.location.pathname.split("/").pop() || "index.html";
      document.querySelectorAll(".nav-menu a").forEach(link => {
        if (link.getAttribute("href").includes(path)) {
          link.classList.add("active");
        }
      });

      setupMobileNav();
      setupHeaderScroll();
    });

  fetch(`/footer.html?${version}`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("global-footer").innerHTML = data;
    });
});

function setupMobileNav() {
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }
}

function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }
}
