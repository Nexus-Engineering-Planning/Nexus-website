<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize form inputs
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = htmlspecialchars(trim($_POST["email"]));
    $message = htmlspecialchars(trim($_POST["message"]));

    // Recipient email
    $to = "femiolamijulo@yahoo.com"; // Replace with your email

    // Email subject and body
    $subject = "New Contact Form Submission from $name";
    $body = "Name: $name\n";
    $body .= "Email: $email\n\n";
    $body .= "Message:\n$message";

    // Email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        // Redirect to a thank you page or display success
        echo "<script>alert('Thank you! Your message has been sent.'); window.location.href='contact.html';</script>";
    } else {
        echo "<script>alert('Sorry, something went wrong. Please try again later.'); window.history.back();</script>";
    }
} else {
    echo "Invalid Request";
}
?>
