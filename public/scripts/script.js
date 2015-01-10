(function ($) {

	$(document).ready(function(){
		plaatsFooter();
	});

	$(window).load(function(){

	});
	$(window).scroll(function(){
		
	});

	$(window).on('resize', function(){
	    plaatsFooter();
	});
	function plaatsFooter () {
		var width = $('.footerImg').width();
		var scrWidth = $(window).width();

		var left = (scrWidth -width)/2;
		$('.footerImg').css("left", left);
	}
	$("#chatTitle").click(function() {
	    if($(this).html() == "Verberg chat"){
	        $(this).html("Open chat");
	        $("#messagesChat").css("display","none");
	        $("#chat").css("display","none");
	    }
	    else{
	        $(this).html("Verberg chat");
	       	$("#messagesChat").css("display","block");
	       	$("#messagesChat").css("width","100% !important");
	       	$("#messagesChat").height(250);

	        $("#chat").css("display","inline");
	    }
	    $("#messageChat").slideToggle();
	});

})(jQuery);
