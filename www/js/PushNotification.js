var PushNotification = function() {};

// call this to register for push notifications
PushNotification.prototype.register = function(success, fail, options) {
    PhoneGap.exec(success, fail, "PushNotification", "registerAPN", options);
};

// call this to notify the plugin that the device is ready
PushNotification.prototype.startNotify = function(notificationCallback) {
    PhoneGap.exec(null, null, "PushNotification", "startNotify", []/* BUG - dies on null */);
};

// use this to log from JS to the Xcode console - useful!
PushNotification.prototype.log = function(message) {
    PhoneGap.exec(null, null, "PushNotification", "log", [{"msg":message,}]);
};

PhoneGap.addConstructor(function() {
	if(!window.plugins){
		window.plugins = {};
	}
	window.plugins.pushNotification = new PushNotification();
});
 /**
  * Customize following callbacks in your application
  */
 // Customized callback for receiving notification
PushNotification.prototype.notificationCallback = function (notification) {
		window.plugins.pushNotification.log("Received a notification.");
        
		if(notification['petition']){
			//showAlert(notification['petition']);
		}else{
			//showAlert(notification['alert']);
		}		
		setTimeout("getXMLfeed()",40);
		setTimeout("loadingindicator.start('white')",250);
	};

 // when APN register succeeded
function successCallback(e) {
   //result.innerHTML="Device registered. Device token:<br>" + e.deviceToken + '<br><br>';
	registerUAPush(e.deviceToken, e.host, e.appKey, e.appSecret);
}
 
 // when APN register failed
 function errorCallback(e) {
//result.innerHTML='Error during registration: '+e.error;
 }

 // register button action
 function registerAPN() {
	window.plugins.pushNotification.log("Registering with APNS via the App Delegate");
	window.plugins.pushNotification.register(successCallback, errorCallback, [{ alert:true, badge:true, sound:true }]);
 }

 // register urban airship push service after APN is registered successfully
 function registerUAPush(deviceToken, host, appKey, appSecret) {
     localStorage["deviceToken"] = deviceToken;
     localStorage["host"] = host;
     localStorage["appKey"] = appKey;
     localStorage["appSecret"] = appSecret;
     window.plugins.pushNotification.log("Registering with Urban Airship.");
     
     var request = new XMLHttpRequest();

     request.open('PUT', host+'api/device_tokens/'+deviceToken, true, appKey, appSecret);
     request.onreadystatechange = function() {
     	if (this.readyState == 4){
         if(this.status == 200 || this.status == 201) {
         		localStorage["usenotificantions"] = 'yes';
         		//turnnotificationspinneronoff('on');
         }else{
         		//turnnotificationspinneronoff('off');
         }
      }
         
     };
     request.send();
 };
 
function unregisterUAPush() {
     var request2 = new XMLHttpRequest();
     request2.open('DELETE', localStorage["host"]+'api/device_tokens/'+localStorage["deviceToken"], true, localStorage["appKey"], localStorage["appSecret"]);
     
     request2.onreadystatechange = function() {
			if (this.readyState == 4){
			   if(this.status == 204) {
			   		localStorage["usenotificantions"] = 'no';
			   		//('off');
			   }else{
			   		//turnnotificationspinneronoff('on');
			   }
			}
     };
     request2.send();
};