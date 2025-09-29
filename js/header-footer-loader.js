document.addEventListener("DOMContentLoaded", function () {
  const version = 'v3'; // Change this whenever you update header/footer

  fetch(`/header.html?${version}`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("global-header").innerHTML = data;

      // Highlight active nav link based on current URL
      const normalizePath = path => {
        const pathname = path.replace(/\/+$/, "");
        return pathname === "" ? "/" : pathname;
      };

      const currentPath = normalizePath(new URL(window.location.href).pathname);

      document.querySelectorAll(".nav-menu a").forEach(link => {
        const linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
        if (linkPath === currentPath) {
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
