<?php
// HOW TO SET ENVIRONMENT VARIABLES IN CPANEL:
// 1. Log in to your cPanel.
// 2. Find the "Software" section and click on "Setup Node.js App" or "Setup Python App".
// 3. Even though this is a PHP script, this interface allows setting environment variables for the whole account.
// 4. Create a new application if you haven't already, or edit an existing one.
// 5. Scroll down to the "Environment Variables" section.
// 6. Add a variable with the name 'RECAPTCHA_SECRET' and your actual secret key as the value.
// 7. Save the changes. The variable will now be available to your PHP scripts via $_ENV.

// CONFIGURATION
$recaptcha_secret = $_ENV['RECAPTCHA_SECRET'] ?? '';
$recipient_email = "support@nexuseng.org";

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check reCAPTCHA response
    $recaptcha_response = $_POST["g-recaptcha-response"] ?? "";
    $recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";

    $response = file_get_contents($recaptcha_url . "?secret=" . urlencode($recaptcha_secret) . "&response=" . urlencode($recaptcha_response));
    $responseKeys = json_decode($response, true);

    if (!$responseKeys["success"]) {
        http_response_code(403);
        echo "reCAPTCHA verification failed.";
        exit;
    }

    // Sanitize and validate input
    $name = htmlspecialchars(strip_tags(trim($_POST["name"] ?? "")));
    $email = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(strip_tags(trim($_POST["message"] ?? "")));

    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
        http_response_code(400);
        echo "Please fill in all required fields with valid information.";
        exit;
    }

    // Compose the email
    $subject = "New Contact Form Submission from $name";
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Send the email
    $mail_success = mail($recipient_email, $subject, $email_content, $headers);

    if ($mail_success) {
        header("Location: thank-you.html");
        exit;
    } else {
        http_response_code(500);
        echo "Something went wrong. Please try again later.";
        exit;
    }
} else {
    http_response_code(405);
    echo "Method not allowed.";
    exit;
}
?>
