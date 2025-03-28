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

    // Send auto-reply to user
    $auto_subject = "Thanks for contacting Nexus Engineering & Planning Ltd.";
    $auto_headers = "MIME-Version: 1.0\r\n";
    $auto_headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $auto_headers .= "From: Nexus Engineering <support@nexuseng.org>\r\n";

    $auto_message = "
    <html>
    <head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; color: #333; padding: 0; margin: 0; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-height: 80px; }
        .content { font-size: 1rem; line-height: 1.6; }
        .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #7ed957;
        color: #0a2342;
        font-weight: 600;
        text-decoration: none;
        border-radius: 5px;
        }
        .footer { margin-top: 30px; font-size: 0.85rem; color: #777; text-align: center; }
    </style>
    </head>
    <body>
    <div class='email-container'>
        <div class='header'>
        <img src='https://www.nexuseng.org/images/expanded-logo.png' alt='Nexus Engineering Logo'>
        </div>
        <div class='content'>
        <p>Hi $name,</p>
        <p>Thank you for contacting <strong>Nexus Engineering & Planning Ltd.</strong> We’ve received your message and will get back to you shortly.</p>
        <p>If your inquiry is urgent, feel free to follow up directly at <a href='mailto:support@nexuseng.org'>support@nexuseng.org</a>.</p>
        <p>In the meantime, feel free to explore our latest insights or learn more about our work.</p>
        <a href='https://www.nexuseng.org/insights.html' class='button'>View Insights</a>
        <div class='footer'>
            <p>© " . date("Y") . " Nexus Engineering & Planning Ltd.</p>
            <p>52 Omorinre Johnson Street, Lekki Phase 1, Lagos, Nigeria</p>
        </div>
        </div>
    </div>
    </body>
    </html>
    ";
    $auto_success = mail($email, $auto_subject, $auto_message, $auto_headers);

    // Redirect or show error
    if ($mail_success && $auto_success) {
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
