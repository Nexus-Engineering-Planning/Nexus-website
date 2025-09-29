function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) {
    return;
  }

  // Basic form validation
  form.addEventListener("submit", function (e) {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      e.preventDefault();
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      e.preventDefault();
      return;
    }

    // Ensure reCAPTCHA v2 checkbox has been completed
    const recaptchaField = document.getElementById("g-recaptcha-response");
    let recaptchaValue = recaptchaField ? recaptchaField.value.trim() : "";

    if (!recaptchaValue && typeof grecaptcha !== "undefined" && typeof grecaptcha.getResponse === "function") {
      recaptchaValue = grecaptcha.getResponse() || "";
      if (recaptchaField && recaptchaValue) {
        recaptchaField.value = recaptchaValue;
      }
    }

    if (!recaptchaValue) {
      alert("Please complete the reCAPTCHA challenge.");
      e.preventDefault();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}
