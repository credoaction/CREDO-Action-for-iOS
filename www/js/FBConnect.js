function posttoFB(type,that){
	window.plugins.pushNotification.log('post')
	that.setAttribute("class", "");
	if(touched == true){
		touched = false;
		
		window.plugins.pushNotification.log('testing vars')
	
		if(localStorage.getItem("FBaccessToken") == null || localStorage.getItem("FBID") == "FBaccessToken" || localStorage.getItem("FBID") == null || localStorage.getItem("FBID") == "null"){
		window.plugins.pushNotification.log('something is missing')
		window.plugins.pushNotification.log("FBaccessToken: " + localStorage.getItem("FBaccessToken") + "FBID: " +localStorage.getItem("FBID") )
		
			FB.login(function(response) {
				if (response.authResponse) {
					
					window.plugins.pushNotification.log('Welcome!  Fetching your information.... ');
			
				  	FB.api('/me', function(response) {
						window.plugins.pushNotification.log('Good to see you, ' + response.name + '.');
						window.plugins.pushNotification.log('Good to see you, ' + response.id + '.');
				    	localStorage.setItem("FBID", response.id);
						localStorage.setItem("FBIMG","http://graph.facebook.com/"+ response.userID +"/picture");
						loadFBimage();
						getAccessToken(type)
					});
				}else{
					showAlert( "You must authorize access for this app in order to share on Facebook.");
				}
			}, {scope: 'publish_stream,publish_actions'});
	 	}else{
	 		window.plugins.pushNotification.log('nothing is wrong')
		 		FBwallPost(type);
		 	};
	 	}
};   
	    
function getAccessToken(type){
	window.plugins.pushNotification.log('get access');
	FB.getLoginStatus(function(response){
		localStorage.setItem("FBaccessToken", response.authResponse.accessToken);
		FBwallPost(type);
	});
};

function FBwallPost(type) { 
	window.plugins.pushNotification.log('wall post it')
	var FBID = localStorage.getItem("FBID");
	var AccessToken = localStorage.getItem("FBaccessToken");
	var url = "https://graph.facebook.com/" + FBID + "/feed";
	var fbmessage =  document.getElementById('FBMessage').value;
	var fbimage =  document.getElementById('facebookmessageimage').src;
	
	if(fbimage.indexOf("http") == "-1"){
		fbimage = "http://credoaction.com/images/action-app-assets/action-icon.png";
	}
	
	var link =  document.getElementById('facebookmessageurl').innerHTML + "?rc=credoappios2";
	var description =  document.getElementById('facebookmessagedescription').innerHTML;
	var params = "access_token=" + AccessToken + "&message=" + escape(fbmessage) + "&link=" + link + "&picture=" + fbimage +"&description=" + escape(description) ; 
	console.log("Action: " + params)
	var req = new XMLHttpRequest();
	
	try{
		req.abort();
		console.log('req aborting...')
	}catch(e){
		console.log('req error')
		console.log(e)
	}
	 	 req.open("POST", url, true); 
		 req.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
		 req.setRequestHeader("Content-length", params.length); 
		 req.setRequestHeader("Connection", "close"); 
		 
	window.plugins.pushNotification.log('almsot at change')
	
	req.onreadystatechange = function() {
		if (req.readyState == 4){
			window.plugins.pushNotification.log('4 ' + req.status + " " )
			document.getElementById('facebookpanel').style.zIndex ="300";
			
			var responser = eval("("+req.responseText+")")
			
			if(!responser.error && req.status == 200) {
				loadingindicator.stop();
				openGraph(link);
				if (type == 'iphone'){
					navigator.notification.alert(
						'Posted to Facebook.',
						facebookpanel.hide(),
						'CREDO Action'
					);
				}else{
					navigator.notification.alert(
						'Posted to Facebook.',
						hideallpanels(),
						'CREDO Action'
					);
				};
			}else{
				var responser = eval("("+req.responseText+")")
				window.plugins.pushNotification.log('4 ' + req.status + " " + responser.error)
				window.plugins.pushNotification.log ("responser " +responser)
				window.plugins.pushNotification.log ("req.responseText " +req.responseText)
				localStorage.removeItem("FBaccessToken");
				localStorage.removeItem("FBID");
				posttoFB(type)
			};
			
		};
	} 
	req.send(params); 
}


function openGraph(url){
	var AccessToken 	= localStorage.getItem("FBaccessToken")
	var params2 		= "website=" + url +"?rc=credoappios2" + "&access_token=" + AccessToken; 
	var FBID 			= localStorage.getItem("FBID");
	var scrapeurl 		= "https://graph.facebook.com/me/credomo:took_an_action";
	var opengraphHTTP = new XMLHttpRequest(); 
		 opengraphHTTP.open("POST", scrapeurl, true); 
		 opengraphHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
		 opengraphHTTP.send(params2); 
	
		 opengraphHTTP.onreadystatechange = function() {
		 console.log("opengraphHTTP.readyState: " + opengraphHTTP.readyState)
			 if (opengraphHTTP.readyState == 4){
				 console.log("CREDO ACTION POST ACTION: 4 " + opengraphHTTP.status + opengraphHTTP.getAllResponseHeaders())	
			 }	
		 }
};


var tryagain = function(FBID, AccessToken, FBMessage, type) { 
	var url = "https://graph.facebook.com/" + FBID + "/feed";
	var fbmessage =  document.getElementById('FBMessage').value;
	var fbimage =  document.getElementById('facebookmessageimage').src;
	
	if(fbimage.indexOf("http") == "-1"){
		fbimage = "http://www.credomobile.com/Content/_img/header/credomobile_logo.gif";
	}
	
	var link =  document.getElementById('facebookmessageurl').innerHTML;
	var description =  document.getElementById('facebookmessagedescription').innerHTML;
	var params = "access_token=" + AccessToken + "&message=" + escape(fbmessage) + "&link=" + link + "&picture=" + fbimage +"&description=" + escape(description) ; 
	var req = new XMLHttpRequest(); 
	 	 req.open("POST", url, true); 
		 req.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
		 req.setRequestHeader("Content-length", params.length); 
		 req.setRequestHeader("Connection", "close"); 
	
	
	req.onreadystatechange = function() {
		if (req.readyState == 4){
			loadingindicator.stop();
			document.getElementById('facebookpanel').style.zIndex ="300";
			var responser = eval("("+req.responseText+")")
			
			if(!responser.error && req.status == 200) {
				if (type == 'iphone'){
					navigator.notification.alert(
						'Posted to Facebook.',
						facebookpanel.hide(),
						'CREDO Action'
					);
				}else{
					navigator.notification.alert(
						'Posted to Facebook.',
						hideallpanels(),
						'CREDO Action'
					);
				}
			}
			else{
				showAlert( "There was an error posting to Facebook, please try again later." + responser.error.message);
				localStorage.removeItem("FBaccessToken");
				localStorage.removeItem("FBID");
			};
		};
	} 
	req.send(params); 
	return req; 
}

function loadFBimage(){
	if (localStorage.getItem("FBID")){
		document.getElementById('facebookprofileimg').src = "http://graph.facebook.com/"+ localStorage.getItem("FBID")  + "/picture"
	};
};