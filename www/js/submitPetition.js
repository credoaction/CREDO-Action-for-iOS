function quickcheckformValdity(that,trueorfalse,iphoneipad){
	that.setAttribute("class", "");
	if (touched == true){
		var errorField 	= document.getElementById('pettionerrorMessage');
		var emailForm 		= document.getElementById('emailForm');
		var fullnameForm 	= document.getElementById('fullnameForm');
		var addressForm 	= document.getElementById('addressForm');
		var cityForm 		= document.getElementById('cityForm');
		var stateForm 		= document.getElementById('stateForm');
		var zipForm 		= document.getElementById('zipForm');
		
		if (!emailForm.validity.valid && !fullnameForm.validity.valid && !addressForm.validity.valid && !cityForm.validity.valid && (!stateForm.value || stateForm.value =="State") && !zipForm.validity.valid)	{
			slowhidepetition();
		}else if (!emailForm.validity.valid){
			errorField.innerHTML = "please correct your email entry"
			slowhidepetition();
		}else if (!fullnameForm.validity.valid){
			errorField.innerHTML = "please correct your name entry"
			slowhidepetition();
		}else if (!addressForm.validity.valid){
			errorField.innerHTML = "please correct your address entry"
			slowhidepetition();
		}else if (!cityForm.validity.valid){
			errorField.innerHTML = "please correct your city entry"
			slowhidepetition();
		}else if (!stateForm.value || stateForm.value =="State"){
			errorField.innerHTML = "please correct your state entry"
			slowhidepetition();
		}else if (!zipForm.validity.valid){
			errorField.innerHTML = "please correct your zip entry"
			slowhidepetition();
		}else{
			checkformValdity(that, true,'ipad');	
		}
	};
};

function quickiphonecheckformValdity(){
	var errorField 	= document.getElementById('pettionerrorMessage');
	var emailForm 		= document.getElementById('emailForm');
	var fullnameForm 	= document.getElementById('fullnameForm');
	var addressForm 	= document.getElementById('addressForm');
	var cityForm 		= document.getElementById('cityForm');
	var stateForm 		= document.getElementById('stateForm');
	var zipForm 		= document.getElementById('zipForm');
	
	if (!emailForm.validity.valid && !fullnameForm.validity.valid && !addressForm.validity.valid && !cityForm.validity.valid && (!stateForm.value || stateForm.value =="State") && !zipForm.validity.valid){
		return 0;
	}else if (!emailForm.validity.valid){
		errorField.innerHTML = "please correct your email entry"
		return 1;
	}else if (!fullnameForm.validity.valid){
		errorField.innerHTML = "please correct your name entry"
		return 2;
	}else if (!addressForm.validity.valid){
		errorField.innerHTML = "please correct your address entry"
		return 3;
	}else if (!cityForm.validity.valid){
		errorField.innerHTML = "please correct your city entry"
		return 4;
	}else if (!stateForm.value || stateForm.value =="State"){
		errorField.innerHTML = "please correct your state entry"
		return 5;
	}else if (!zipForm.validity.valid){
		errorField.innerHTML = "please correct your zip entry"
		return 6;
	}else{
		return 7;
	}
};

function checkformValdity(that, trueorfalse,iphoneipad){
	that.setAttribute("class", "");	
	if (touched == true){
		touched = false;
		var errorField 	= document.getElementById('pettionerrorMessage');
		var emailForm 		= document.getElementById('emailForm');
		var fullnameForm 	= document.getElementById('fullnameForm');
		var addressForm 	= document.getElementById('addressForm');
		var cityForm 		= document.getElementById('cityForm');
		var stateForm 		= document.getElementById('stateForm');
		var zipForm 		= document.getElementById('zipForm');
		
		if (trueorfalse == "iPad"){
			if(emailForm.validity.valid && fullnameForm.validity.valid && addressForm.validity.valid && cityForm.validity.valid && stateForm.validity.valid && stateForm.value !="" && stateForm.value !="State" && zipForm.validity.valid ){
				userinfo.settingsstore();
				userinfo.load();
			}
		}
		
		if (!emailForm.validity.valid){
			errorField.innerHTML = "please correct your email entry"
			return false;
		}else if (!fullnameForm.validity.valid){
			errorField.innerHTML = "please correct your name entry"
			return false;
		}else if (!addressForm.validity.valid){
			errorField.innerHTML = "please correct your address entry"
			return false;
		}else if (!cityForm.validity.valid){
			errorField.innerHTML = "please correct your city entry"
			return false;
		}else if (!stateForm.value || stateForm.value =="State"){
			errorField.innerHTML = "please correct your state entry"
			return false;
		}else if (!zipForm.validity.valid){
			errorField.innerHTML = "please correct your zip entry"
			return false;
		}else{
			var emailFormSubmit 		= "&email=" + encodeURI(emailForm.value);
			var fullnameFormSubmit 	= "&name=" + encodeURI(fullnameForm.value);
			var addressFormSubmit 	= "&address1=" + encodeURI(addressForm.value);
			var cityFormSubmit 		= "&city=" + encodeURI(cityForm.value);
			var stateFormSubmit 		= "&state=" + encodeURI(stateForm.value);
			var zipFormSubmit 		= "&zip=" + encodeURI(zipForm.value);
			
			var petitionID 	= document.getElementById('petition_id').value;
			var petition_id 	= "petition_id=" + escape(petitionID);
			var redirect_url 	= "&redirect_url=" + escape(document.getElementById('redirect_url').value);
			var referred_by 	= "&referred_by=" + escape(document.getElementById('referred_by').value);
			var pushToken     = "&pushToken=" + localStorage["deviceToken"];
			
			var url = "http://www.credoaction.com/petition/process_petition.html?" + petition_id  + emailFormSubmit + "&posted=1&track_referer=1" + redirect_url + referred_by + "&ga__full_name=&Q_test_group=control&referring_file=index.html" + fullnameFormSubmit + addressFormSubmit + cityFormSubmit + stateFormSubmit + zipFormSubmit + pushToken + "&country=United%20States&rc=credoappios1&comment=&x=120&y=31&error_json=1";
			
			console.log(url)
			
			errorField.innerHTML = "";
			submitPetition(iphoneipad, url);
		}
	}
};

function submitPetition(iphoneipad,url){
	var submitPetitionHTTPTimeout = setTimeout("submitPetitionHTTPTimeout()",10000);
		 submitPetitionHTTP 			= new XMLHttpRequest();
   var petitionID 					= document.getElementById('petition_id').value;
	var petition_id 					= "petition_id=" + escape(petitionID);
	
	loadingindicator.start('white');
	
	try{
		submitPetitionHTTP.abort();
		console.log('submitPetitionHTTP aborting...')
	}catch(e){
		console.log('submitPetitionHTTP error')
		console.log(e)
	}
	
	
   submitPetitionHTTP.onreadystatechange =	function(){
		var content = submitPetitionHTTP.responseText;
	//IF THERE IS A 4 READY STATE		
		if (submitPetitionHTTP.readyState == "4"){
	//IF RESPONSE HAS ERROR HEADER		
			if( submitPetitionHTTP.getResponseHeader("X-Petition-Errors") ){
				
				navigator.notification.alert(
					'Sorry, there seems to be a problem submitting your petition. Please try again later. ' + submitPetitionHTTP.getResponseHeader("X-Petition-Errors"),        // message
					loadingindicator.stop(), // callback
					'CREDO Action'  // Title
				);
				
				if(iphoneipad=="ipad"){
					setTimeout( "showhidepetition('-3.5%')", 200)
				}else{
					panel.loadPetition();
				}
			 }	
	// IF THERE IS A 200 RESPONSE
			 else if ( submitPetitionHTTP.status =="200"){
			 	document.getElementById('facebookpanel').style.zIndex ="300";
			 	
			 	if(iphoneipad == "ipad"){
				 	navigator.notification.alert(
						'Petition successfully submitted!',
						petitionSuccess('ipad'),
						'CREDO Action'
					);
			 	}else{
 					document.getElementById('decreasetextsize').style.display = "none";
					document.getElementById('increasetextsize').style.display = "none";
			 		
				 	navigator.notification.alert(
						'Petition successfully submitted!',
						petitionSuccess('iphone'),
						'CREDO Action'
					);
			 	}
			 	
			 	localStorage['submitted' + petitionID ] = '1';
			 	
			 	if(iphoneipad == "ipad"){
				 	settoSubmitted(petitionID);
			 	}else{
			 		panel.loadSharing();
			 		iphonesettoSubmitted(petitionID);
			 	}
			 }
	 //IF THERE WAS A 4 AND SOMETHING OTHER THAN 200
 			else{
 				//alert('2')
 				if(iphoneipad == "ipad"){
			 	 	navigator.notification.alert(
						'Sorry, there seems to be a problem submitting your petition. Please try again later. ',
						showhidepetition('-110%'),
						'CREDO Action'
					);
					loadingindicator.stop();
			 	}else{
				 	navigator.notification.alert(
						'Sorry, there seems to be a problem submitting your petition. Please try again later. ',
						loadingindicator.stop(),
						'CREDO Action'
					);
			 	}
			};
		}
	}
   submitPetitionHTTP.open("GET",url,true);
   submitPetitionHTTP.send();
   userinfo.store();
   userinfo.load();
};
function petitionSuccess(iphoneipad){
	var submittedtime = Math.round((new Date()).getTime() / 1000);
       localStorage.setItem("submittedtime", submittedtime)
	
	if (iphoneipad == "ipad"){
		showhidepetition('-110%')
		loadingindicator.stop();
		setTimeout(function () {
			showhidefacebookpanel('25%','ipad')
		}, 150);
	}else{
		loadingindicator.stop()
		setTimeout(function () {
			facebookpanel.show()
		}, 150);
	}
}

function submitPetitionHTTPTimeout(){
   submitPetitionHTTP.abort();
};