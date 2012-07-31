function onDeviceReady() {
	PhoneGap.exec(function(success){}, function(error){}, "CDVLocalStorage", "restore", []);
	PhoneGap.exec(null, null, "CDVLocalStorage", "verifyAndFixDatabaseLocations", []);
	db = window.openDatabase("db", "1.0", "Test DB", 1000000);

	FB.init({ appId: "***", nativeInterface: PG.FB, useCachedDialogs: false });
	setTimeout("getXMLfeed()",100);
	
	document.addEventListener("resume", onResumeipad, false); 
	cb = ChildBrowser.install();
   window.plugins.pushNotification.startNotify();
   registerAPN();
	
	PhoneGap.addConstructor(function() {
	    if(!window.plugins) window.plugins = {};
	    window.plugins.twitter = new Twitter();
	});
	
	Twitter.prototype.isTwitterAvailable = function(response){
		PhoneGap.exec(response, null, "com.phonegap.twitter", "isTwitterAvailable", []);
	};
	
	Twitter.prototype.isTwitterSetup = function(response){
	   PhoneGap.exec(response, null, "com.phonegap.twitter", "isTwitterSetup", []);
	};
	
	Twitter.prototype.composeTweet = function(success, failure, tweetText, options){
	   options = options || {};
	   options.text = tweetText;
	   PhoneGap.exec(success, failure, "com.phonegap.twitter", "composeTweet", [options]);
	};
	
	isTwitterSetup();
	document.addEventListener("orientationchange", updateOrientation,false); 
};

function onResumeipad(){
	try{
		hideallpanels();
		document.getElementById('facebookpanel').style.webkitTransform = "translate(0px,-1500px)";
		setTimeout(function () {
			document.getElementById('facebookpanel').style.display = "none";
		}, 150);
	}catch(e){
		return false;
	}
	document.getElementById('loadingtext').innerHTML = "one sec...";
	setTimeout("getXMLfeed()",40);
	setTimeout("loadingindicator.start('white')",250);
	isTwitterSetup();
	loadFBimage();	
};

function convertAnchors(){
	var i = 0;
	var centerpanel = document.getElementById('mainarticleText')
	var allAnchors = centerpanel.getElementsByTagName('a')
	for(i=0; i<allAnchors.length; i++){
		allAnchors[i].onclick = function (){
			window.plugins.childBrowser.showWebPage(this.href)
			return false;
		};
	};
};

function showAbout(){
	navigator.notification.confirm(
		'Version 1.0.2 copyright 2012 CREDO Mobile, Inc. All rights reserved.        UI Design: Steven Lyons, @studiolyons                            Development: Henry Levak, @henrylevak',
		returnNull,              // callback to invoke with index of button pressed
	   'CREDO Action',          // title
		'OK,Cancel' 
	)
};
function returnNull(){
	return null;
}
function terms(){
	window.plugins.childBrowser.showWebPage("http://www.credomobile.com/lp/actionapp/terms.aspx");
}