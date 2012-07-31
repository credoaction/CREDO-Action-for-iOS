/**
 * Customize following callbacks in your application
 */

// Customized callback for receiving notification
PushNotification.prototype.notificationCallback = function (notification) {
	//alert('recieved')
	var msg = '';
	for (var property in notification) {
		msg += property + ' : ' + notification[property] + '<br>';
	}
	//message.innerHTML='notification received:<br><br>' + msg;
};

// when APN register succeeded
function successCallback(e) {
	//result.innerHTML="Device registered. Device token:<br>" + e.deviceToken + '<br><br>';
	registerUAPush(e.deviceToken, e.host, e.appKey, e.appSecret);
}

// when APN register failed
function errorCallback(e) {
	//result.innerHTML='Error during registration: '+e.error;
	//registerButton.disabled=false;
}

// register button action
function registerAPN() {
	//result.innerHTML='Registering...';
	//registerButton.disabled=true;
	
	navigator.pushNotification.register(successCallback, errorCallback, { alert:true, badge:true, sound:true });
	
	//or unregister
	//navigator.pushNotification.register();
}

// register urban airship push service after APN is registered successfully
function registerUAPush(deviceToken, host, appKey, appSecret) {
	//var resultStr = result.innerHTML;
	//result.innerHTML += 'Registering with Urban Airship Push Service...';
	var request = new XMLHttpRequest();
	
	// open the client and encode our URL
	request.open('PUT', host+'api/device_tokens/'+deviceToken, true, appKey, appSecret);
	
	// callback when request finished
	request.onload = function() {
		//result.innerHTML = resultStr + 'Status: ' + this.status + '<br>';
		
		if(this.status == 200 || this.status == 201) {
			// register UA push success
			//result.innerHTML = result.innerHTML + 'UA push service successfully registered.';
		} else {
			// error
			//result.innerHTML = result.innerHTML + 'Error when registering UA push service.<br>error: '+this.statusText;
		}
		
		// for demo, you can re-register again
		//registerButton.disabled=false;
	};
	
	request.send();
}