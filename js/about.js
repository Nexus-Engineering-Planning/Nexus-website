document.addEventListener("DOMContentLoaded", () => {
  const teamMembers = document.querySelectorAll(".team-member");

  teamMembers.forEach(member => {
    const popup = member.querySelector(".bio-popup");

    const showPopup = () => {
      popup.classList.add("show");
      member.setAttribute("aria-expanded", "true");
    };

    const hidePopup = () => {
      popup.classList.remove("show");
      member.setAttribute("aria-expanded", "false");
    };

    member.addEventListener("click", () => {
      const isExpanded = member.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        hidePopup();
      } else {
        showPopup();
      }
    });

    member.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const isExpanded = member.getAttribute("aria-expanded") === "true";
        if (isExpanded) {
          hidePopup();
        } else {
          showPopup();
        }
      }
    });
  });

  // Close popups when clicking outside
  document.addEventListener("click", e => {
    if (!e.target.closest(".team-member")) {
      document.querySelectorAll(".bio-popup.show").forEach(popup => {
        popup.classList.remove("show");
        const member = popup.closest(".team-member");
        if (member) {
          member.setAttribute("aria-expanded", "false");
        }
      });
    }
  });

  // Close popups with the Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll(".bio-popup.show").forEach(popup => {
        popup.classList.remove("show");
        const member = popup.closest(".team-member");
        if (member) {
          member.setAttribute("aria-expanded", "false");
        }
      });
    }
  });
});
