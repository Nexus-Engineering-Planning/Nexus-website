// reCAPTCHA token assignment
grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6Lcd5QIrAAAAAAZ9pEaBdnbjKbdMccuofeKfIHcS', {
      action: 'contact_form'
    });
    document.getElementById('recaptcha_token').value = token;
  });
  
  // Basic form validation
  document.getElementById("contactForm").addEventListener("submit", function (e) {
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
    }
  });
  