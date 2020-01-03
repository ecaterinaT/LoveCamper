<?php
// Check for empty fields
if(empty($_POST['fullname']) || empty($_POST['email']) || empty($_POST['telefon']) || empty($_POST['message']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(500);
  exit();
}

$name = strip_tags(htmlspecialchars($_POST['fullname']));
$email = strip_tags(htmlspecialchars($_POST['email']));
$phone = strip_tags(htmlspecialchars($_POST['telefon']));
$message = strip_tags(htmlspecialchars($_POST['message']));

// Create the email and send the message
$to = "lovecamper@yahoo.com"; // Add your email address inbetween the "" replacing yourname@yourdomain.com - This is where the form will send a message to.
$subject = "Website Contact Form:  $fullname";
$body = "Mesaj nou.\n\n"."Detalii:\n\nName: $fullname\n\nEmail: $email\n\nTelefon: $telefon\n\nMesaj:\n$message";
$header = "From: noreply@lovecamper.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$header .= "Reply-To: $email";	

if(!mail($to, $subject, $body, $header)){
  echo "Merge";
}else {
  echo "Nu merge";
}

?>
