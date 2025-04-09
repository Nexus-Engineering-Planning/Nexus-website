document.addEventListener("DOMContentLoaded", function () {
  const version = 'v3'; // Change this whenever you update header/footer

  fetch(`/header.html?${version}`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("global-header").innerHTML = data;

      // Highlight active nav link based on current URL
      const path = window.location.pathname.split("/").pop();
      document.querySelectorAll(".nav-menu a").forEach(link => {
        if (link.getAttribute("href") === path) {
          link.classList.add("active");
        }
      });
    });

  fetch(`/footer.html?${version}`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("global-footer").innerHTML = data;
    });
});
