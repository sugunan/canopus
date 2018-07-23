$(document).ready(function(){
	
	$(window).bind('resize', function() {
		layout.fixHeightOnResize();
	});
	
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
	
	// 4. Initialize layout. Set up height and width for all pages and sub blocks
	layout.init();
	
	// 5. If URL hash are set then navigate to page and sub block
	var path = document.location.hash.toString().substr(1);
	if( path ){ 
		layout.clearFrameHeight();
		
		if(path.match(':')) { 
			var block = path.split(":");
			ap_id = block[0];
			$('.b-menu a').removeClass('active');
			$('.b-menu a[rel='+block[0]+']').addClass('active');
			if(block[0]) layout.changePage( block[0], null, 1 );
			if(block[1]) layout.setBlock( block[0], block[1] );
		}
		else {
			ap_id = path;
			$('.b-menu a[rel='+path+']').addClass('active');
			layout.changePage( path, path, 1 );
		}
	} 
	else {
		$('.b-menu a').removeClass('active');
		$('.b-menu li:first a').addClass('active');
	}
	
	// Main menu events
	$('a.nav').click(function() {
		$('.b-menu a').removeClass('active');
		$('.b-menu a[rel='+$(this).attr('rel')+']').addClass('active');
		layout.clearFrameHeight();
		layout.changePage( $(this).attr('rel'), $(this).attr('rel') );
		return false;
	});

	// Sub blocks events
	$('a.next').click(function() {
		layout.changeBlock( this );
		return false;
	});
	$('a.prev').click(function() {
		layout.changeBlock( this );
		return false;
	});
	
	// <a> with a class name 'goto' navigates directly to page and block 
	// This is used on start page Featured works section to navigate to particular page and block
	$('a.goto').click(function(){
		var path = $(this).attr('rel');
		if( path ){ 
			if(path.match(':')) { 
				var block = path.split(":");
				$('.b-menu a').removeClass('active');
				$('.b-menu a[rel='+block[0]+']').addClass('active');
				if(block[0]) layout.changePage( block[0], block[0] + ':' + block[1] );
				if(block[1]) layout.setBlock( block[0], block[1] );
			}
			else {
				layout.changePage( path, path );
			}
		}
		return false;
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


// main layout functions. Nothing to setup here
ap_id = null;

var layout = {
	frame:	'#frame',					//ID of main frame
	pages:	'.pages',					//class name of all pages conteiner
	page:	'.page',					//class name of each page wrapper
	blocks_holder: '.blocks-holder',	//class name of sub blocks frame
	blocks: '.blocks', 					//class name of sub blocks conteiner
	block:	'.block', 					//class name of each sub block wrapper
	content: '.content',				//class name for page content
	footer: '.footer',					//class name for footer. Then the page is loaded setupFootersAndHeader() function takes it and clone after each div.content
	//mainmenu: '.mainmenu',				//class name for mainmenu. Then the page is loaded setupFootersAndHeader() function takes it and clone before each div.content
	header: '.header',					//class name for header. Then the page is loaded setupFootersAndHeader() function takes it and clone before each div.content
	
	init: function(){
		if(!ap_id) ap_id = $(this.pages + ' ' + this.page).first().attr('id');
		this.setupFootersAndHeader();
		this.setupWidthForAllSubblocks();
		this.setupHeightForAllPages();
		this.setupDefaultHeight();
	},
	
	clearFrameHeight: function(){
		$('#frame').height($(window).height());
	},
	setupDefaultHeight: function(){
		$(this.frame).height($(this.pages + ' ' + this.page).first().height());	
	},
	setupHeightForAllPages: function(){
		var window_height = $(window).height();
		$(this.pages + ' ' + this.page).each(function(index) {
			if($(this).height() < window_height ){
				$(this).height(window_height);
			}
		});
	},
	setupWidthForAllSubblocks: function(){
		var block = this.block;
		
		$(this.blocks).each(function(index){
			var width = 0;
			$(block, this).each(function(index){
				width += $(this).width();
				$(this).css('width', $(this).width());
			});
			$(this).width(width);
		});
	},
	changePage: function(active_page_id, hash, duration){
		var frame = this.frame;
		if(!duration) var duration = 1500;
		
		//console.log(active_page_id);
		
		$(frame).scrollTo('#'+active_page_id, duration, {
			onAfter: function(){
				if(hash) document.location.hash = hash;
				$(frame).height( $('#'+active_page_id).height() ); 
			}
		});
		
		ap_id = active_page_id;
		
		var window_height = $(window).height();
		
		$('#'+ap_id).css('height','auto');
		if($('#'+ap_id).height() < window_height ){
			$('#'+ap_id).height(window_height);
		} else {
			$(this.frame).height( $('#'+ap_id).height() ); 
		}
		
		var duration = null;
	},
	changeBlock: function(o, hash){
		var direction = $(o).attr('rel');
		var frame = $(o).parents(this.blocks_holder).attr('id');
		var page = $(o).parents(this.page).attr('id');
		
		if(direction == 'next') var block = $(o).parents(this.block).next().attr('id');
		if(direction == 'prev') var block = $(o).parents(this.block).prev().attr('id');
		
		//console.log(frame);
		
		$('#'+frame).scrollTo('#'+block, 700,{
			onAfter: function(){
				document.location.hash = page+':'+block;
			},
			easing: 'easeOutSine'
		});
	},
	setBlock: function(page,block){
		var frame = $('#'+page).find(this.blocks_holder).attr('id');
		
		$('#'+frame).scrollTo('#'+block, 1);
	},
	fixHeightOnResize: function(){
		
		var window_height = $(window).height();
		$('#'+ap_id).css('height','auto');
		if($('#'+ap_id).height() < window_height ){
			$('#'+ap_id).height(window_height);
		} else {
			$(this.frame).height( $('#'+ap_id).height() ); 
		}
		
		this.changePage(ap_id, ap_id, 1);
		
	},
	setupFootersAndHeader: function(){
		var footer = this.footer
		var header = this.header;
		var content = this.content;
		
		var header_clone = $(header).clone()
		var footer_clone = $(footer).clone();
		
		var i = 0;
		$(this.page).each(function() {
			if($(header, this).size() == 0){
				$(content, this).before( $(header).first().clone() );
			}
			if($(footer, this).size() == 0){
				$(content, this).after( $(footer).first().clone() );
			}
			i++;
		});
	}
};
