<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function __construct()
    {
        parent::__construct();

        /**
        * Common variables for view
        */
        $this->data = array();
        $this->data['base_url'] = $this->config->item('base_url');
        $this->data['template_url'] = $this->config->item('template_url');
        $this->data['docroot'] = $this->config->item('docroot');
        $this->data['index_page'] = $this->config->item('index_page');
    }
    
	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$this->load->view('home',$this->data);
	}
	
	public function contact()
	{
		$to = 'zugunan@gmail.com';

		$subject = 'Contact us - sugunan.com: '.$_POST['subject'];
		$message = nl2br($_POST['body']) . "<br/><br/>";
		$message .= "IP: ".$_SERVER['REMOTE_ADDR'] . "<br/>US: ".$_SERVER['HTTP_USER_AGENT']."<br/><br/>";
		
		$headers = "From: ".$_POST['name']. "<" . strip_tags("no-reply@sugunan.com") . ">\r\n";
		$headers .= "Reply-To: ". strip_tags($_POST['email']) . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		if(isset($_POST['email']) && $_POST['email']!="" && isset($_POST['body']) && $_POST['body']!="" && isset($_POST['name']) && $_POST['name']!="")
		{
			mail($to, $subject, $message, $headers);
		}else{
			$to = $_POST['email'];
			
			for($i=0;$i<10;$i++)
			{
				$headers = "From: Mr.Robot".rand(1,10000) . "<vl".rand(1,10000) . $to . ">\r\n";
				$headers .= "Reply-To: ". strip_tags($_POST['email']) . "\r\n";
				$headers .= "MIME-Version: 1.0\r\n";
				$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
				
				$subject = 'Thanks '.rand(1,10000).' for applying '.rand(1,10000).' bots on my '.rand(1,10000).' web site';
				$message = "<h1>DON'T MAKE ME CRAZY BY SENDING SPAM MAILS.</h1><br/><br/><br/><br/><br/>";
				$message .= nl2br($_POST['body']) . "<br/><br/>";
				mail($to, $subject, $message, $headers);
				sleep(1);
			}
			
		}
	}
}
