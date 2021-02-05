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
		fdata.push({name: "action", value: "save_guessnwin"});
		fdata.push({name: "timer", value: iSeconds});
		fdata.push({name: "word", value: iWords.join(',') });
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

function update_puzzle () {
	iSeconds  = formatMyTime();
	var dform = jQuery("#form_game");
	var fdata = dform.serializeArray();
		fdata.push({name: "action", value: "save_guessnwin"});
		fdata.push({name: "timer", value: iSeconds});
		fdata.push({name: "word", value: iWords.join(',') });
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
						if (data.response == "SUCCESS") { } else {
							alert(data.response);
						}
					} else {
						alert("Something went wrong!");
					}						
				}
			});			
}
			
function start_puzzle(){
	startTimer();
	wordfindgame.create(gWords, '#puzzle-wrapper', '', 
							{
							  orientations: ['horizontal', 'vertical'],	  
							  fillBlanks: true
							}
						);						
}

function how_to_play() {
	
	jQuery('#tour_container').show();
	
    var $pagination = jQuery('#tour_container').simplePagination({
        previous_content: '<button class="btn custom_btn brown_btn">Back</button>', 
        next_content: '<button class="btn custom_btn brown_btn">Next</button>', 
        skip_content: '<button class="btn custom_btn brown_btn">Skip</button>', 
        close_content: '<button class="btn custom_btn brown_btn">Play</button>', 		
        number_of_visible_page_numbers: 2,
        items_per_page: 1,
        use_page_numbers: false,
        pagination_container: '.web_tour',
		pages_container: ".web_pages",
        html_prefix: 'simple-pagination',
        navigation_element: 'a',
		use_page_skip: true
    });
	
	jQuery.fancybox({
		content: $pagination,
		type: 'html',
		modal: true,
		helpers: {
			overlay: {
				closeClick: false
			}
		},
		afterClose   : function() {
			start_puzzle();
		},
		onComplete: function () {
			jQuery.fancybox.resize();
			jQuery.fancybox.center();
		}
	});
	jQuery(".fancybox-overlay").unbind();
}

jQuery( function() {		

	jQuery(".simple-pagination-skip").click(function() {
		jQuery.fancybox.close();
	});

	//Scrollbar
	jQuery(window).load( function() {
		jQuery(".question_container").mCustomScrollbar({axis:"y", theme: "dark-2"});
	});	
});