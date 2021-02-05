function trim(name) {
    name = name.replace(/^\s+/, "").replace(/\s+$/, "");
    return name;
}

function isValidPhonenumber(value) {
    return (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));
}

function getUrlVars(urls) {
    var vars = [];
    var hashes = urls.slice(urls.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        var hash = hashes[i].split('=');
        vars[hash[0]] = decodeURIComponent(hash[1]);
    }
    return vars;
}

jQuery(document).ready(function() {

	//Fancybox initialization
	jQuery('.fancybox').fancybox({ 
		afterClose   : function() {
			jQuery('.fancybox-overlay').remove();
		}		
	});
			
	//Numeric validation		
	jQuery('.num-txt').keydown(function(event) {
		jQuery(this).each(function() {
			// Allow special chars + arrows 
			if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 
				|| event.keyCode == 27 || event.keyCode == 13 
				|| (event.keyCode == 65 && event.ctrlKey === true) 
				|| (event.keyCode >= 35 && event.keyCode <= 39)){
					return;
			}else {
				// If it's not a number stop the keypress
				if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
					event.preventDefault(); 
				}   
			}
		});
	});

	jQuery('.alpha-txt').keydown(function(event) {
		jQuery(this).each(function() {
		   var charCode = (event.charCode) ? event.charCode : ((event.keyCode) ? event.keyCode : ((event.which) ? event.which : 0));
		   if (charCode > 33 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
			  event.preventDefault(); 
		   }
		   return;
		});
	});
});

function checkMailId(obj) {
    if (obj.value != "") {
        var arr = new Array('.com', '.net', '.org', '.biz', '.coop', '.info', '.museum', '.name', '.pro', '.edu', '.gov', '.int', '.mil', '.ac', '.ad', '.ae', '.af', '.ag', '.ai', '.al', '.am', '.an', '.ao', '.aq', '.ar', '.as', '.at', '.au', '.aw', '.az', '.ba', '.bb', '.bd', '.be', '.bf', '.bg', '.bh', '.bi', '.bj', '.bm', '.bn', '.bo', '.br', '.bs', '.bt', '.bv', '.bw', '.by', '.bz', '.ca', '.cc', '.cd', '.cf', '.cg', '.ch', '.ci', '.ck', '.cl', '.cm', '.cn', '.co', '.cr', '.cu', '.cv', '.cx', '.cy', '.cz', '.de', '.dj', '.dk', '.dm', '.do', '.dz', '.ec', '.ee', '.eg', '.eh', '.er', '.es', '.et', '.fi', '.fj', '.fk', '.fm', '.fo', '.fr', '.ga', '.gd', '.ge', '.gf', '.gg', '.gh', '.gi', '.gl', '.gm', '.gn', '.gp', '.gq', '.gr', '.gs', '.gt', '.gu', '.gv', '.gy', '.hk', '.hm', '.hn', '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.im', '.in', '.io', '.iq', '.ir', '.is', '.it', '.je', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki', '.km', '.kn', '.kp', '.kr', '.kw', '.ky', '.kz', '.la', '.lb', '.lc', '.li', '.lk', '.lr', '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.mg', '.mh', '.mk', '.ml', '.mm', '.mn', '.mo', '.mp', '.mq', '.mr', '.ms', '.mt', '.mu', '.mv', '.mw', '.mx', '.my', '.mz', '.na', '.nc', '.ne', '.nf', '.ng', '.ni', '.nl', '.no', '.np', '.nr', '.nu', '.nz', '.om', '.pa', '.pe', '.pf', '.pg', '.ph', '.pk', '.pl', '.pm', '.pn', '.pr', '.ps', '.pt', '.pw', '.py', '.qa', '.re', '.ro', '.rw', '.ru', '.sa', '.sb', '.sc', '.sd', '.se', '.sg', '.sh', '.si', '.sj', '.sk', '.sl', '.sm', '.sn', '.so', '.sr', '.st', '.sv', '.sy', '.sz', '.tc', '.td', '.tf', '.tg', '.th', '.tj', '.tk', '.tm', '.tn', '.to', '.tp', '.tr', '.tt', '.tv', '.tw', '.tz', '.ua', '.ug', '.uk', '.um', '.us', '.uy', '.uz', '.va', '.vc', '.ve', '.vg', '.vi', '.vn', '.vu', '.ws', '.wf', '.ye', '.yt', '.yu', '.za', '.zm', '.zw');
        var mai = trim(obj.value);
        var val = true;
        var dot = mai.lastIndexOf(".");
        var ext = mai.substring(dot, mai.length);
        var at = mai.indexOf("@");
        if (dot > 5 && at > 1) {
            for (var i = 0; i < arr.length; i++) {
                if (ext == arr[i]) {
                    val = true;
                    break;
                } else {
                    val = false;
                }
            }
            if (val == false) {
                alert("Your email id '" + mai + "' is not correct.");
                obj.value = "";
                obj.focus();
                return false;
            }
        } else {
            alert("Your email id '" + mai + "' is not correct.");
            obj.value = "";
            obj.focus();
            return false;
        }
        return true;
    }
}

function ajaxPost(method, turl, params, thandler, restype) {
    if (restype == undefined) restype = 'html';
    var xmlreq = false;
    if (window.XMLHttpRequest) xmlreq = new XMLHttpRequest(); //mozilla/safari
    else if (window.ActiveXObject) xmlreq = new ActiveXObject("Microsoft.XMLHTTP"); //IE
    if (xmlreq) {
        xmlreq.open(method, turl, true);
        xmlreq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlreq.onreadystatechange = function() {
            if (xmlreq.readyState == 4) {
                if (restype == 'xml') thandler(xmlreq.responseXML);
                else thandler(xmlreq.responseText);
            }
        }
        xmlreq.send(params);
    }
}

//Reload the Captcha image
function reloadCaptchaImg(id) {
    var obj = document.getElementById(id);
    var src = obj.src;
    var pos = src.indexOf('?');
    if (pos >= 0) {
        src = src.substr(0, pos);
    }
    var date = new Date();
    obj.src = src + '?datetime=' + date.getTime();
    return false;
}

function checkEmailExists(obj) {
    if (checkMailId(obj)) {
        checkEmailList(obj.value);
        return true;
    } else {
        return false;
    }
}

//Ajax Check Email
function checkEmailList(email) {
	if (trim(email) == "") return false;
    document.getElementById('divmailchecking').innerHTML = 'Checking...';
    var ajaxUrl  = globserverurl + "send.php";
    var argParam = 'action=check_email&email=' + email + '&rand=' + Math.random();
    ajaxPost('post', ajaxUrl, argParam, checkEmailListRes);
}

//Ajax Response
function checkEmailListRes(argRes) {
    if (parseInt(argRes) == 1) {
        document.getElementById('divmailchecking').innerHTML = "";
        alert("Email id is already participated");
        document.getElementById('input_email_id').value = "";
		document.getElementById('input_email_id').focus();
    } else if (parseInt(argRes) == 0) {
        document.getElementById('divmailchecking').innerHTML = "";
    }
}

//Ajax Check Phone
function checkPhoneList(phone) {
	if (trim(phone) == "") return false;
    document.getElementById('divphonechecking').innerHTML = 'Checking...';
    var ajaxUrl  = globserverurl + "send.php";
    var argParam = 'action=check_phone&phone=' + phone + '&rand=' + Math.random();
    ajaxPost('post', ajaxUrl, argParam, checkPhoneListRes);
}

//Ajax Response
function checkPhoneListRes(argRes) {
    if (parseInt(argRes) == 1) {
        document.getElementById('divphonechecking').innerHTML = "";
        alert("Phone no is already participated");
        document.getElementById('input_phone').value = "";
		document.getElementById('input_phone').focus();
    } else if (parseInt(argRes) == 0) {
        document.getElementById('divphonechecking').innerHTML = "";
    }
}

//Clear Form
function clearForm(form) {
    jQuery(":input", form).each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase(); // normalize case
        // text inputs, password inputs, and textareas
        if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'file') {
            this.value = "";
        }
        // checkboxes and radios
        else if (type == 'checkbox' || type == 'radio') {
            jQuery(this).attr('checked', false);
        }
        // select
        else if (tag == 'select') {
            this.selectedIndex = 0;
        }
    });
}

function textCounter(countedTextBox, countBody, opt_maxSize) {
    var maxSize = opt_maxSize ? opt_maxSize : 1024;
    var field = document.getElementById(countedTextBox);
    if (field && field.value.length >= maxSize) {
        field.value = field.value.substring(0, maxSize);
    }
    var txtField = document.getElementById(countBody);
    if (txtField) {
        txtField.innerHTML = parseInt(opt_maxSize) - parseInt(field.value.length);
    }
}

jQuery( document ).on( "click", "#but_login_cancel", function(e) {	
	if (e && e.preventDefault) {
		e.preventDefault();
	}
	parent.jQuery.fancybox.close(true);
});

//Validate Register
function validateMyForm() {
	jQuery("#form_register").validate({
		rules: {
			input_name: {
				required: true,
			},
			input_email_id: {
				required: true,
				email: true
			},
			input_phone: {
				required: true,
				number: true
			},		
			input_city: {
				required: true,
			},
			input_country: {
				required: true,
			},
			input_nationality: {
				required: true,
			},
			input_security_code: {
				required: true,
			}			
		},
		messages: {			
			input_name: {
				required: mylang.input_name_required
			},
			input_email_id: {
				required: mylang.input_email_id_required,
				email: mylang.input_email_id_email
			},
			input_phone: {
				required: mylang.input_phone_required,
				number: mylang.input_phone_number
			},	
			input_city: {
				required: mylang.input_city_required
			},
			input_country: {
				required: mylang.input_country_required
			},
			input_nationality: {
				required: mylang.input_nationality_required
			},
			input_security_code: {
				required: mylang.input_security_code_required
			}		
		},
		errorClass: "help-block",
		errorElement: "span",
		highlight:function(element, errorClass, validClass) {
			jQuery(element).parents('.form-group').addClass('has-error');
		},
		unhighlight: function(element, errorClass, validClass) {
			jQuery(element).parents('.form-group').removeClass('has-error');
			jQuery(element).parents('.form-group').addClass('has-success');
		},
		tooltip_options: {
			input_name: { placement: 'top' },
		   	input_email_id: { placement: 'top' },
			input_phone: { placement: 'top' },
			input_city: { placement: 'top' },
			input_country: { placement: 'top' },
			input_nationality: { placement: 'top' },
			input_security_code: { placement: 'top' }
		},
	}).form();
		
	if(jQuery("#form_register").valid()){
		var dform = jQuery("#form_register");
			jQuery("#action").val('savecontest');
		var fdata = dform.serializeArray();
		var ajaxURL = globserverurl + "send.php";				
			jQuery.ajax({
					type: 'POST',
					url: ajaxURL,
					dataType: 'json',
					data: fdata,					
					error: function(data, textStatus, errorThrown) {
						alert('Request failed :' + textStatus + errorThrown);
					},
					success: function(data, textStatus, xhr) {
						if (data.response) {
							if (data.response == "SUCCESS") {
								window.location.href= globserverurl + "game.php";
							} else {
								alert(data.response);
							}
						} else {
							alert("Something went wrong!");
						}
					}
				});			
	}
}

jQuery.validator.addMethod("lettersonly", function(value, element) {
	return this.optional(element) || /^[a-z\-.,'"\s]+$/i.test(value);
}, "Please enter only letter");
jQuery.validator.classRuleSettings.lettersonly = {
	lettersonly: true
};
function validateSharing() {
	
	jQuery("#frm_sharing").validate({
		rules: {
			source_name: {
				required: true,
				lettersonly: true
			},
			target_email: {
				required: true
			}			
		},
		messages: {
			source_name: {
				required: mylang.source_name_required
			},
			target_email: {
				required: mylang.target_email_required
			}		
		},
		errorClass: "help-block",
		errorElement: "span",
		highlight:function(element, errorClass, validClass) {
			jQuery(element).parents('.form-group').addClass('has-error');
		},
		unhighlight: function(element, errorClass, validClass) {
			jQuery(element).parents('.form-group').removeClass('has-error');
			jQuery(element).parents('.form-group').addClass('has-success');
		}
	}).form();  
	
	if(jQuery("#frm_sharing").valid()){
		jQuery.fancybox.showLoading();	
		var dform = jQuery("#frm_sharing");
		var fdata = dform.serializeArray();
			fdata.push({name: "action", value: "sharing"});
		var ajaxURL = globserverurl + "send.php";	
		
			jQuery.ajax({
				type: 'POST',
				url: ajaxURL,
				dataType: 'json',
				data: fdata,
				error: function(data, textStatus, errorThrown) {
					alert('Request failed :' + errorThrown);
				},
				success: function(result, textStatus, xhr) {
					sharingCallback(result);
				}
			});
	}	 
}

function sharingCallback(data) {
	jQuery.fancybox.hideLoading();

	if (data.response) {
		if (data.response == "SUCCESS") {
			jQuery.fancybox.open( 
			"<div class='alert alert-success'><strong>"+mylang.mail_sent+"</strong></div>", 
			{	
				afterClose   : function() {
					top.window.location.href= globserverurl + "index.php";
				}
			});
		} else {
			alert(data.response);
		}
	} else {
		alert("Something went wrong!");
	}	
}

//Event Function
function onEnterLogin(evt){
	evt = (evt) ? evt : ((window.event) ? window.event : "");
	if (evt) {
		if ( evt.keyCode==13 || evt.which==13 ) {
			validateLogin(1);
		}
	}	
}

function validateLogin(postby) {
	
	jQuery("#frm_login").validate({
		rules: {
			email_id: {
				required: true,
				email: true
			}			
		},
		messages: {
			email_id: {
				required: mylang.input_email_id_required,
				email: mylang.input_email_id_email
			}	
		},
		errorClass: "help-block",
		errorElement: "span",
		highlight:function(element, errorClass, validClass) {
			jQuery(element).parents('.form-group').addClass('has-error');
		},
		unhighlight: function(element, errorClass, validClass) {
			jQuery(element).parents('.form-group').removeClass('has-error');
			jQuery(element).parents('.form-group').addClass('has-success');
		}
	}).form();  
	
	if(postby == 0) {
		if(jQuery("#frm_login").valid()){
			jQuery.fancybox.showLoading();	
			jQuery("#login_data").val('login');	
			var dform = jQuery("#frm_login");
			var fdata = dform.serializeArray();
			var ajaxURL = globserverurl + "send.php";
				
				jQuery.ajax({
					type: 'POST',
					url: ajaxURL,
					dataType: 'json',
					data: fdata,
					error: function(data, textStatus, errorThrown) {
						alert('Request failed :' + errorThrown);
					},
					success: function(result, textStatus, xhr) {
						loginCallback(result);
					}
				});	
		}			
	} else if(postby == 1) {
		
		if(jQuery("#frm_login").valid()){
			jQuery("#login_data").val('loginby');	
			jQuery("#frm_login").submit();
			return false;		
		}
			
	}
}

function loginCallback(data) {
	jQuery.fancybox.hideLoading();

	if (data.response) {
		if (data.response == "SUCCESS") {
			top.window.location.href= globserverurl + "game.php";
		} else if (data.response == "ALERT") {
			var drs = data.results;
			if (drs) {
				iframePopupResult(drs.msg, drs.url);
			}
		} else {
			alert(data.response);
		}
	} else {
		alert("Something went wrong!");
	}	
}

//To activate/close Popup window
function iframePopupResult(msg, url) {
	if(msg!='' && url!='') {
		jQuery.fancybox.open(msg, {
			title 			: null,
			width 			: 250,
			height 			: 150,
			autoDimensions  : true,
			autoScale 		: false,
			autoSize		: false,			
			afterClose: function() {
				top.window.location.href = url;
			}
		});
	} else if(msg!='' && url=='') {
		jQuery.fancybox.open(msg, {
			title 			: null,
			width 			: 250,
			height 			: 150,
			autoDimensions  : true,
			autoScale 		: false,
			autoSize		: false
		});		
	} else if(msg=='' && url!='') {
		top.window.location.href = url;
	}
}

function resetSession() { 
	jQuery.ajax({
		type: 'POST',
		url: globserverurl + "send.php",
		dataType: 'json',
		data: {"action": "cleansession"},
		error: function(data, textStatus, errorThrown) {
			alert('Request failed :' + errorThrown);
		},
		success: function(result, textStatus, xhr) {
			resetSessionCallback(result);
		}
	});
}

function resetSessionCallback(data) {
	if (data.response) {
		if (data.response == "SUCCESS") {			
			location.href= globserverurl + 'index.php';			
		} else {
			alert(data.response);
		}
	} else {
		alert("Something went wrong!");
	}	
}