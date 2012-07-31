function showhidepetition(ammount){
	if (ammount == '-3.5%'){
		hideallpanels();
		setTimeout(function(){
			document.getElementById('petition').style.display='inline';	
			document.getElementById('blackscreen').style.display='inline';	
		},100);	
		setTimeout(function(){
			document.getElementById('petition').style.webkitTransform = 'translate3d(0%, 0%, 0px)';
			document.getElementById('blackscreen').style.opacity='.3';	
		},140);
		document.getElementById('cityForm').blur()
		document.getElementById('stateForm').blur()
		document.getElementById('zipForm').blur()
	}
	else{
		document.getElementById('petition').style.webkitTransform = 'translate3d(-110%, 0%, 0px)';
		document.getElementById('blackscreen').style.opacity='0';	
		
		setTimeout(function(){
			document.getElementById('petition').style.display='none';	
			document.getElementById('blackscreen').style.display='none';	
		},200);
	}
}

function showhidefacebookpanel(ammount,that){
	if (touched == true || that == 'ipad'){
		if (ammount == '25%'){
			try{that.setAttribute("class", "");}catch(e){}
			touched = false;
			hideallpanels();
			setTimeout(function(){
				document.getElementById('facebookpanel').style.display='inline';		
				document.getElementById('blackscreen').style.display='inline';	
			},100);	
			setTimeout(function(){
				document.getElementById('facebookpanel').style.webkitTransform = 'translate3d( 50%, '+ ammount +', 0px)';
				document.getElementById('blackscreen').style.opacity='.3';	
			},140);
		}
		else{
			that.setAttribute("class", "");
			touched = false;
			document.getElementById('facebookpanel').style.webkitTransform = 'translate3d( 50%,'+ ammount +', 0px)';
			document.getElementById('blackscreen').style.opacity='.0';		
			setTimeout(function(){
				document.getElementById('blackscreen').style.display='none';		
				document.getElementById('facebookpanel').style.display='none';	
			},200);
		}
		document.getElementById('FBMessage').value = "";
	}
}

function showhidesettingspanel(){
	hideallpanels();
	var settingspanel = document.getElementById('settingspanel');
	if (settingspanel.style.display == "none" || settingspanel.style.display == "" ){
		setTimeout(function(){
			document.getElementById('blackscreen').style.opacity='.001';	
			document.getElementById('blackscreen').style.display='inline';	
			settingspanel.style.display = "inline";
		},100);	
	}else{
		setTimeout(function(){
			document.getElementById('blackscreen').style.opacity='1';	
			document.getElementById('blackscreen').style.display='none';	
			settingspanel.style.display = "none";
		},200);	
	}
}

function hideallpanels(){
	document.getElementById('blackscreen').style.display='none';
	var facebook = document.getElementById('facebookpanel');
	var settingspanel = document.getElementById('settingspanel');
	var petition = document.getElementById('petition');
	var blackscreen = document.getElementById('blackscreen');
	
	facebook.style.webkitTransform = 'translate3d( 50%, -125%, 0px)';
	petition.style.webkitTransform = 'translate3d( -110%, 0%, 0px)';
	
	setTimeout(function(){
		//facebook.style.display='none';		
		settingspanel.style.display='none';		
		petition.style.display='none';		
	},20);
};

function checkRotation(){
	if (window.innerWidth > window.innerHeight){
		return 'landscape'
	}
	else{
		return 'portrait'
	}
}

function emailArticle(that){
	var doc = window.document;
	that.setAttribute("class", "");
	if (touched == true){
		touched = false;
		var imagebased 	= doc.getElementById('facebookmessageimage').src;
		var texttitle 		= doc.getElementById('facebookmessagetitle').innerHTML;
		var textarticle 	= doc.getElementById('facebookmessagedescription').innerHTML
		var linktoarticle = doc.getElementById('facebookmessageurl').innerHTML;
		var textsplit 		= textarticle.split("<p>", 1)
		window.plugins.emailComposer.showEmailComposer(texttitle,'<body><img src=' + imagebased + ' height="150" style="float: left; padding-right:12px;" /> ' + textsplit + '<a href="' + linktoarticle + '">Read more...</a></body>',"", "","","true"); 
	}
}

function tweetArticle(type,that){
	loadingindicator.start('white');
	that.setAttribute("class", "");
	if(touched == true){
		touched = false;
		var shortUrl;
		var xhrTweet = new XMLHttpRequest();
		xhrTweet.open("GET", "***"+document.getElementById('facebookmessageurl').innerHTML+ "?rc=credoappios2"  +"&format=xml");
		xhrTweet.onreadystatechange = function() { 
			if(xhrTweet.readyState == 4) { 
				if(xhrTweet.status==200) {
					launchTwitterbrowser( xhrTweet.responseXML.getElementsByTagName('url')[0].firstChild.nodeValue, type );         
				}else{
					launchTwitterbrowser('www.credoaction.com', type)
				}
			} 
		}
		xhrTweet.send();	
	}
};

function isTwitterSetup(){
	window.plugins.twitter.isTwitterSetup(function(r){
		isTweetset =  r;
	});        
};

function launchTwitterbrowser(shortUrl, type){
	var tweetiphone = document.getElementById('facebookmessagetitle').innerHTML;
	var tweetipad = document.getElementById('mainarticleTitle').innerHTML;

	if ( isTweetset == "1" ){
		if ( type == "iphone"){
	  		window.plugins.twitter.composeTweet(
	      		function(s){ 
	      			loadingindicator.stop();
      			}, 
	   			function(e){ 
	   				loadingindicator.stop();
   				}, 
	   			tweetiphone + ' ' + shortUrl + '  @CREDOMobile'
   			);
		}else{
	  		window.plugins.twitter.composeTweet(
				function(s){ 
					loadingindicator.stop();
				}, 
				function(e){ 
					loadingindicator.stop();
				}, 
				tweetiphone + ' ' + shortUrl + '  @CREDOMobile' 
			);
		}
	}else{
		loadingindicator.stop();
		if ( type == "iphone"){
			window.plugins.childBrowser.showWebPage("http://twitter.com/?status=" + encodeURI(document.getElementById('facebookmessagetitle').innerHTML + " ") + shortUrl );
		}else{
			window.plugins.childBrowser.showWebPage("http://twitter.com/?status=" + encodeURI(document.getElementById('mainarticleTitle').innerHTML + " ") + shortUrl );
		}
	}
}

var textsize = {
	increase: function(){
		var currentTextsize = document.getElementById('mainarticleText').style.fontSize;
		
		if (currentTextsize == ''){
			document.getElementById('mainarticleText').style.fontSize = '130%';
		}
		else if (currentTextsize == '200%'){
			return false;
		}
		else{
			document.getElementById('mainarticleText').style.fontSize = parseInt(currentTextsize) + parseInt('10') + "%";
		}
		myScroll.refresh();
	},
	decrease: function(){
		var currentTextsize = document.getElementById('mainarticleText').style.fontSize;
	
		if (currentTextsize == ''){
			document.getElementById('mainarticleText').style.fontSize = '110%';
		}
		else if (currentTextsize == '120%'){
			return false;
		}
		else{
			document.getElementById('mainarticleText').style.fontSize = parseInt(currentTextsize) - parseInt('10') + "%";
		}
		myScroll.refresh();
		myScroll.scrollTo(0,0,0);	
	}
};

var panels = {
	show: function(){
		var doc = window.document;
		document.getElementById('leftpanel').style.opacity="1";
		document.getElementById('rightpanel').style.opacity="1";
		document.getElementById('centerpanel').style.opacity="1";
	}
};

function updateOrientation(e) {
	setTimeout(function () {myScroll2.refresh();}, 50);
	setTimeout(function () {myScroll.refresh();}, 50);
}

var userinfo = {
	store: function(){
		var doc = window.document;
		localStorage["emailForm"] = doc.getElementById('emailForm').value;
		localStorage["fullnameForm"] = doc.getElementById('fullnameForm').value;
		localStorage["addressForm"] = doc.getElementById('addressForm').value;
		localStorage["cityForm"] = doc.getElementById('cityForm').value;
		localStorage["stateForm"] = doc.getElementById('stateForm').value;
		localStorage["zipForm"] = doc.getElementById('zipForm').value;
	},
	settingsstore: function(){
		var doc = window.document;
		localStorage["emailForm"] = doc.getElementById('settingsemailForm').value;
		localStorage["fullnameForm"] = doc.getElementById('settingsfullnameForm').value;
		localStorage["addressForm"] = doc.getElementById('settingsaddressForm').value;
		localStorage["cityForm"] = doc.getElementById('settingscityForm').value;
		localStorage["stateForm"] = doc.getElementById('settingsstateForm').value;
		localStorage["zipForm"] = doc.getElementById('settingszipForm').value;
	},
	load: function(){
		var doc = window.document;
		if (localStorage["emailForm"] ) {
			try{
				doc.getElementById('emailForm').value = localStorage["emailForm"];
			}catch(e){}
				
			try{	
				doc.getElementById('settingsemailForm').value = localStorage["emailForm"];
			}catch(e){}
		}
		if (localStorage["emailForm"] ) {
			try{
				doc.getElementById('fullnameForm').value = localStorage["fullnameForm"];
			}catch(e){}
			
			try{
				doc.getElementById('settingsfullnameForm').value = localStorage["fullnameForm"];
			}catch(e){}
		}
		if (localStorage["emailForm"] ) {
			try{
				doc.getElementById('addressForm').value = localStorage["addressForm"];
			}catch(e){}
			
			try{
				doc.getElementById('settingsaddressForm').value = localStorage["addressForm"];
			}catch(e){}
		}
		if (localStorage["emailForm"] ) {
			try{
				doc.getElementById('cityForm').value = localStorage["cityForm"];
			}catch(e){}
			
			try{
				doc.getElementById('settingscityForm').value = localStorage["cityForm"];
			}catch(e){}
		}
		if (localStorage["emailForm"] ) {
			try{
				doc.getElementById('stateForm').value = localStorage["stateForm"];
			}catch(e){}
			
			try{
				doc.getElementById('settingsstateForm').value = localStorage["stateForm"];
			}catch(e){}	
		}
		if (localStorage["emailForm"] ) {
			try{
				doc.getElementById('zipForm').value = localStorage["zipForm"];
			}catch(e){}
			
			try{
				doc.getElementById('settingszipForm').value = localStorage["zipForm"];
			}catch(e){}
		}
	},
	clear: function() {
		var i = 0, doc = window.document;
		var allInputes = doc.getElementsByTagName('input');
		for ( i = 0; i<= allInputes.length -1; i++){
			allInputes[i].value ="";
		}
		showAlert('All information has been cleared. Tap "Update Action List" to re-sync the Action list.')
		localStorage.clear();
		resetDB();
		
		var scoller2Selected = doc.getElementById('scroller2');
		doc.getElementById('petitionReads').innerHTML = "";
		doc.getElementById('petitionReads2').innerHTML = "";
		doc.getElementById('mainarticleTitle').innerHTML = "";
		doc.getElementById('mainarticleText').innerHTML = "";
		doc.getElementById('mainArticleimage').style.backgroundImage="url()";
		
		while( scoller2Selected.getElementsByTagName('div').length){
			scoller2Selected.removeChild(scoller2Selected.lastChild)
		}
	},
	cleariphone: function(){
		var allInputes = document.getElementsByTagName('input');
		var i = 0;
		for ( i = 0; i<= allInputes.length -1; i++){
			allInputes[i].value ="";
		}
		showAlert('All information has been cleared. Tap "Update Action List" to re-sync the Action list.')
		localStorage.clear();
		resetDB();
		document.getElementById('mainarticleText').innerHTML = "";
		document.getElementById('scroller').innerHTML = "";
		document.getElementById('mainarticleTitle').innerHTML = "";
	}
}

function showAlert(message) {
	navigator.notification.alert(
		message,        // message
		alertDismissed, // callback
		'CREDO Action'  // Title
	);
};

function updatemyopposite(value,id){
	document.getElementById(id).value = value;
	userinfo.settingsstore();
}

function updatemySELECTopposite(value,id){
	document.getElementById(id).value = value;
	userinfo.settingsstore();
}

function slowhidepetition(){
	setTimeout("showhidepetition('-3.5%')",220)
}  
    
function alertDismissed(){return true}

function preloadImages(){
	var i = 0;
	imageObj = new Image();
	images = new Array();
	
	images[0] = "img/signthispetitiontouched.png";
	images[1] = "img/signthispetitiontouched@2x.png";
	
	images[2] = "img/decreaseTextsizetouched.png";
	images[3] = "img/increaseTextsizetouched.png";
	
	images[4] = "img/icon-settingstouched.png";
	images[5] = "img/icon-settingstouched@2x.png";
	
	images[6] = "img/emailittouched.png";
	images[7] = "img/emailittouched@2x.png";
	
	images[8] = "img/facebooksharethislinktouched.png";
	images[9] = "img/facebooksharethislinktouched@2x.png";
	
	images[10]= "img/tweetittouched.png";
	images[11]= "img/tweetittouched@2x.png";
	
	images[12]= "img/settingspanel.png";
	images[13]= "img/settingspanel@2x.png";
	
	images[14]= "img/icon-settingstouched.png";
	images[15]= "img/icon-settingstouched@2x.png";
	
	images[16] = "img/decreaseTextsizetouched@2x.png";
	images[17] = "img/increaseTextsizetouched@2x.png";
	
	images[18] = "img/fbcancelittouched.png";
	images[19] = "img/fbcancelittouched@2x.png";
	
	images[20] = "img/fbshareittouched.png";
	images[21] = "img/fbshareittouched@2x.png";
	
	for(i=0; i<=21; i++){
		imageObj.src=images[i];
	}
} 

function imageSuccess(that){
	that.style.opacity ="1";
}

function settoSubmitted (petitionID) {
	var allarticles = document.getElementById('scroller2').getElementsByTagName('div');
	for (var x=0; x<= allarticles.length; x++ ){
		if ( allarticles[x] && allarticles[x].getAttribute('data-petitionid') == petitionID ) {
		 	allarticles[x].firstChild.setAttribute('class', 'submittedAction');
		};
	};
};

var loadingindicator = {
	start: function(color){
		document.getElementById('loadingicon').className='spin';
		document.getElementById('loadingindicator').style.display='inline';
		blackpanel.show(color);
	},
	stop: function(){
		document.getElementById('loadingicon').className='';	
		document.getElementById('loadingindicator').style.display='none';
		blackpanel.hide()
		document.getElementById('loadingtext').innerHTML = "one sec...";
	}
};

var blackpanel = {
	show: function(color){
		if(color){
			document.getElementById('blackscreen').style.backgroundColor=color;
		}else{
			document.getElementById('blackscreen').style.backgroundColor="black";
		}
		document.getElementById('blackscreen').style.display='inline';
		document.getElementById('blackscreen').style.zIndex='300';
		setTimeout(function () {
			document.getElementById('blackscreen').style.opacity='.8';	
		}, 10);
	},
	hide: function(){
		document.getElementById('blackscreen').style.opacity='0';	
		setTimeout(function () {
			document.getElementById('blackscreen').style.display='none';
			document.getElementById('blackscreen').style.zIndex='100';
		}, 150);
	}
};