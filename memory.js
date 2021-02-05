//Server URL
var iTiles 		= new Array();
var iBlocks 	= 36;
var iClicks 	= 0;
var iHelp  		= [0,0];
var iClicked  	= false;
var iHelped  	= 0;
var iPairs 		= 0;
var iTurns 		= 0;
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
jQuery(document).ready(function() {
		
    function playAudio(sAudio) {
        var audioElement = document.getElementById('audioEngine');
        if (audioElement !== null) {
            audioElement.src = sAudio;
            audioElement.play();
        }
    }

	function cardSearch(needle, haystack, argStrict) {
		var strict = !! argStrict;
		var key = '';
		var nArray = new Array();
		var index = 0;
		for (key in haystack) {
			if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
				nArray[index] = key;
				index++;
			}
		}
		return nArray;
	}
	
    function cardOccurance(randomnumber) {
        var count = 0;
        for (var i = 0; i < iTiles.length; i++) {
            if (iTiles[i] == randomnumber) count++;
        }
        if (count == 2) return true;
        return false;
    }

    function initCards() {
        jQuery('#game-container').empty();
        for (var iCounter = 0; iCounter < iBlocks; iCounter++) {
            var randomnumber = Math.floor(Math.random() * Math.round(iBlocks / 2));
            while (cardOccurance(randomnumber)) {
                randomnumber = Math.floor(Math.random() * Math.round(iBlocks / 2));
            }
            jQuery(document.createElement("div")).attr("class", "card down").appendTo("#game-container");
            iTiles.push(randomnumber);
        }
//		alert(iTiles.join(','))
//		jQuery(".card").each(function() {
//			jQuery(this).children('img').hide();
//		});
    }

    function cardsFaceUp() {
        return jQuery(".up").length == 2;
    }

    function checkCardsMatched() {
        return jQuery(".up:eq(0)").children("img").attr("src") == jQuery(".up:eq(1)").children("img").attr("src");
    }

    function markCardsAsMatched() {
		setTimeout(function() {
			jQuery(".up").each(function() {
				jQuery(this).removeClass().addClass("matched");
			});	
		}, iControl.interval);	
    }
		
    function updateScoreCard(player) {
        var el = jQuery(player).find(".noPairs");
        	iPairs++;
			el.text( iPairs );
			updategame ();
    }

    function incrementTurns(player) {
        var el = jQuery(player).find(".noTurns");
			iTurns++;
        	el.text( iTurns );
		iClicked = false;
    }
	
	function incrementClicks() {
		iClicks++;
        jQuery(".noClicks").html(iClicks);
	}
	
    function allCardsMatched() {
        return (jQuery(".matched").length == iBlocks);
    }

    function flipCardsBackOver() {
        setTimeout(function() {
            jQuery(".up").each(function() {
				jQuery(this).addClass("down").removeClass("up");
				jQuery(this).children('img').delay(250).slideUp('fast').remove();
            });
        }, iControl.interval);
    }
	
	function cardGame() {
        if (cardsFaceUp()) {
			iHelp = [0,0];
            return false;
        }
        var curElem = jQuery(this);
        	curElem.removeClass("down").addClass("up");
			curElem.html('<img src="' + globserverurl + 'assets/cards/' + iTiles[curElem.index()] + '.jpg" class="img-responsive" />');
			curElem.children('img').hide().delay(250).slideDown('fast');
			iHelp[0] = iTiles[curElem.index()];
			iHelp[1] = curElem.index();
//		if (curElem.children('img').is(":hidden")) {
//			curElem.children('img').slideDown('fast');
//			iHelp[0] = curElem.children('img').attr('src').match(/[0-9]+/g);
//			iHelp[1] = curElem.index();
//		}
		iClicked = true;
        if (cardsFaceUp()) {
            incrementTurns("#game-player");
            if (checkCardsMatched()) {
                markCardsAsMatched();
				iHelp = [0,0];
                updateScoreCard("#game-player");
                playAudio(globserverurl + "assets/mp3/applause.mp3");
				setTimeout(function() {
					if (allCardsMatched()) {
						endgame();
					}
				}, iControl.interval);				
            } else {
                playAudio(globserverurl + "assets/mp3/no.mp3");
                flipCardsBackOver();
            }
        }			
	}
	
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
			tsHtml = ((tmHtml!='') ? tmHtml + ":" + tsHtml : tsHtml); 
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
		//endTimer();
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
		//endTimer();
	}

	function startTimer() {
		jQuery(document).on("click", '.card', cardGame);
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
		jQuery(document).off("click", '.card', cardGame);
		if ( jQuery("#help_game").length ) { jQuery("#help_game").remove(); }
		jQuery(".card").each(function() {
			jQuery(this).removeClass().addClass("matched").children('img').slideDown("slow");
		});
		var dform = jQuery("#form_game");
		var fdata = dform.serializeArray();
			fdata.push({name: "action", value: "save_memory"});
			fdata.push({name: "help", value: iHelped});
			fdata.push({name: "timer", value: iSeconds});
			fdata.push({name: "turns", value: iTurns});
			fdata.push({name: "pairs", value: iPairs});
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

	function updategame () {
		iSeconds  = formatMyTime();
		var dform = jQuery("#form_game");
		var fdata = dform.serializeArray();
			fdata.push({name: "action", value: "save_memory"});
			fdata.push({name: "help", value: iHelped});
			fdata.push({name: "timer", value: iSeconds});
			fdata.push({name: "turns", value: iTurns});
			fdata.push({name: "pairs", value: iPairs});
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
									
	jQuery("#help_game").click(function() {
		if(iClicked) {
			var matchTiles = cardSearch(parseInt(iHelp[0]), iTiles, true);
			jQuery.each(matchTiles, function( index, value ) {
				var ielem   = jQuery('#game-container div').eq( value );
				ielem.html('<img src="' + globserverurl + 'assets/cards/' + iTiles[value] + '.jpg" class="img-responsive" />');
				ielem.children('img').slideDown('fast');
//				if (ielem.children('img').is(":hidden")) {
//					ielem.children('img').slideDown('fast');
//				}
				ielem.removeClass().addClass("matched");
			});
			jQuery("#help_game").remove();
			iHelped	 = 1;
			iClicked = false;
			updateScoreCard("#game-player");
			if (allCardsMatched()) {
				endgame();
			}
		}
	});
	
	jQuery(".simple-pagination-skip").click(function() {
		startTimer();
		jQuery.fancybox.close();
	});

	jQuery(".simple-pagination-close").click(function() {
		startTimer();
		jQuery.fancybox.close();
	});
				
	initCards();
});