//Server URL
var iSeconds	= '';
var iControl = {
    timer: null,
	interval: 1000,
	minutes: 5,
	seconds: 0	
};	
var iTimer = {
    days: 0,
    hours: 0,
	minutes: 0,
	seconds: 0
};

function formatMyTime() {
	var thHtml = '';
	var tmHtml = ''; 
	var tsHtml = ''; 
	if (iTimer.hours > 0) {
		thHtml = ((iTimer.hours < 10) ? "0" + iTimer.hours : iTimer.hours);
	}		
	if (iTimer.minutes > 0) {
		tmHtml = ((iTimer.minutes < 10) ? "0" + iTimer.minutes : iTimer.minutes);
		tmHtml = ((thHtml!='') ? thHtml + ":" + tmHtml : tmHtml); 
	}		
	if (iTimer.seconds > 0) {
		tsHtml = ((iTimer.seconds < 10) ? "0" + iTimer.seconds : iTimer.seconds);
		tsHtml = ((tmHtml!='') ? tmHtml + ":" + tsHtml : "00:" + tsHtml); 
	}
	return tsHtml;
}

function addTimer() {
	iTimer.seconds++;
	if (iTimer.seconds > 59) {
		iTimer.minutes++;
		iTimer.seconds = 0;
	}
	if (iTimer.minutes > 59) {
		iTimer.hours++;
		iTimer.minutes = 0;
	}
	if (iTimer.hours > 23) {
		iTimer.days++;
		iTimer.hours = 0;
	}	
	jQuery("#input_timer").val(((iTimer.minutes < 10) ? "0" + iTimer.minutes : iTimer.minutes) + ":" + ((iTimer.seconds < 10) ? "0" + iTimer.seconds : iTimer.seconds));
	startTimer();
}

function subTimer() {
	iTimer.seconds--;
	if (iTimer.seconds < 0) {
		iTimer.minutes--;
		iTimer.seconds = 59
	}
	if (iTimer.minutes < 0) {
		iTimer.hours--;
		iTimer.minutes = 59
	}
	if (iTimer.hours < 0) {
		iTimer.days--;
		iTimer.hours = 23
	}		
	jQuery("#input_timer").val(((iTimer.minutes < 10) ? "0" + iTimer.minutes : iTimer.minutes) + ":" + ((iTimer.seconds < 10) ? "0" + iTimer.seconds : iTimer.seconds));
	startTimer();
}

function startTimer() {
	iControl.timer = window.setTimeout(addTimer, iControl.interval);
}

function resetTimer() {
	clearInterval(iControl.timer);
	iSeconds = formatMyTime();
	iControl = {
		timer: null,
		interval: 1000,
		minutes: 0,
		seconds: 0	
	};
	iTimer = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	};				
}

function endTimer() {
	if (iTimer.seconds == iControl.seconds) {
		endgame ();
	}
}	

function endgame () {
	resetTimer();
	save_puzzle();		
}

function save_puzzle() {
	var dform = jQuery("#form_game");
	var fdata = dform.serializeArray();
	var fImg  =document.getElementById('input_img').value;
		fdata.push({name: "action", value: "save_puzzle"});
		fdata.push({name: "timer", value: iSeconds});
		fdata.push({name: "image_name", value: fImg});
	var ajaxURL = globserverurl + "send.php";				
		jQuery.ajax({
				type: "POST",
				cache: false,
				url: ajaxURL,
				dataType: 'json',
				data: fdata,
				beforeSend: function() {},
				error: function(data, textStatus, errorThrown) {
					alert('Request failed :' + textStatus + errorThrown);
				},
				success: function(data) {
					if (data.response) {
						if (data.response == "SUCCESS") {
							window.location.href='share.php';
						} else {
							alert(data.response);
						}
					} else {
						alert("Something went wrong!");
					}
				}
			});		
}

function init_puzzle() {
	window.setTimeout( 
	function() {
		jQuery('.snappuzzle-slot').css({'background' :'#ffffff'});
		jQuery('#pile').show();		
		start_puzzle(4);
		startTimer();
	}, 5000);
}
		
function start_puzzle(x){
	jQuery('#snappuzzle-image').snapPuzzle({
		rows: x, columns: x,
		pile: '#pile',
		containment: '#snappuzzle-wrapper',
		onComplete: function(){				
			endgame();			
		}
	});
}

jQuery( function() {		

	jQuery(window).resize(function(){
		jQuery('#snappuzzle-image').snapPuzzle('refresh');
	});

	jQuery(".simple-pagination-skip").click(function() {
		jQuery.fancybox.close();
	});
	
});