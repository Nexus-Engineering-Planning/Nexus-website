<?php
// CONFIGURATION
$recaptcha_secret = "YOUR_SECRET_KEY"; // Replace with your actual reCAPTCHA v3 secret key
$recipient_email = "support@nexuseng.org";

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Verify reCAPTCHA token
    $recaptcha_token = $_POST["recaptcha_token"] ?? "";
    $recaptcha_url = "https://www.google.com/recaptcha/api/siteverify";

    $response = file_get_contents($recaptcha_url . "?secret=" . urlencode($recaptcha_secret) . "&response=" . urlencode($recaptcha_token));
    $responseKeys = json_decode($response, true);

    // Basic reCAPTCHA validation
    if (!$responseKeys["success"] || $responseKeys["score"] < 0.5) {
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

    // Compose main email
    $subject = "New Contact Form Submission from $name";
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Send email to admin
    $mail_success = mail($recipient_email, $subject, $email_content, $headers);


    // Redirect or show error
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
