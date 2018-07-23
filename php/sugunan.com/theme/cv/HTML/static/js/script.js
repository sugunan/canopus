$(document).ready(function(){

	// 1. start NivoSlider
	$('#slider').nivoSlider({
		pauseTime: 5000,
		effect: 'fade'
	});

	// 2. start Twitter
	$("#twitter").getTwitter({
		userName: "jquery",
		numTweets: 6,
		loaderText: "Loading tweets...",
		slideIn: true,
		slideDuration: 750,
		showHeading: true,
		headingText: "Latest Tweets",
		showProfileLink: true,
		showTimestamp: true
	});
	
	
	// 3. start form validating
	$('#contact_form').validate({
		rules: {
			name: "required",
			subject: "required",
			body: "required",
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			name: "Please enter your name",
			subject: "Please enter a subject",
			body: "Please enter a message text",
			email: "Please enter a valid email address"
		},
		submitHandler: function(form) {
			$('#contact_form .b-form-actions img').show();
			
			var timer_reached = false,
				response_received = false;
			 
			function checkStatus() {
				if(timer_reached && response_received) {
					$('#contact_form .b-form-actions img').hide();
					$('#contact_form input').val('');
					$('#contact_form textarea').val('');
					$('#contact_form_reply').show();
				}
			}
			
			setTimeout( function() {
				timer_reached = true;
				checkStatus();
			}, 1000);
			
			$('#contact_form').ajaxSubmit({
				target:        '#contact_form_reply',
				url:           'sendmail.php',
				beforeSubmit:  function(){},
				success:       function(){ 
					response_received = true;
					checkStatus();
				}
			});
		}
	});
	
	// Contact form submit events
	$('a#contact_submit').click(function(){
		$('#contact_form_reply').hide();
		$('#contact_form').submit();
		return false;
	});
	
	// Fancybox to all <a> with a class name 'fancy'
	$("a.fancy").fancybox({
		overlayColor: '#000',
		overlayOpacity: '0.8'
	});
	
});
