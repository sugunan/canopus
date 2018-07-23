<?php
$to      = 'sergei@odincov.net';
$subject = $_REQUEST['subject'];
$message = $_REQUEST['body']. "\r\n\r\n\r\n" . $_REQUEST['name'];
$headers = 'From: '.$_REQUEST['email'].'' . "\r\n" .
    'Reply-To: '.$_REQUEST['email'].'' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if($to && $_REQUEST['subject'] && $_REQUEST['body'] && $_REQUEST['email']){
	if(@mail($to, $subject, $message, $headers)){
		echo 'Thank you!';
	}
	else {
		echo 'Error!';
	}
} else {
	echo 'Error!';
}
?>