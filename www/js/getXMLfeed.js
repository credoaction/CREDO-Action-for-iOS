function getXMLfeed(attempt){ 
	loadingindicator.start('white');
	getXMLfeedHTTP = new XMLHttpRequest();
	getXMLfeedHTTP.abort()
	db = window.openDatabase("db", "1.0", "Test DB", 1000000);
	if (attempt){
		var setXMLfeedTO = setTimeout("getXMLfeedHTTPTimeout('attempt')", 15000)
	}else{
		var setXMLfeedTO = setTimeout("getXMLfeedHTTPTimeout()", 15000)
	}

	getXMLfeedHTTP.onreadystatechange=function (){
		if (getXMLfeedHTTP.readyState == '4'){
			if (getXMLfeedHTTP.status == '200'){
				if(!localStorage.getItem('lasttime200') ||  Math.round(((new Date()).getTime() / 1000) - 2 ) > localStorage.getItem('lasttime200') ) {
					clearTimeout(setXMLfeedTO);
					localStorage.setItem('lasttime200', Math.round((new Date()).getTime() / 1000) );
					
					if(getXMLfeedHTTP && getXMLfeedHTTP.responseXML && getXMLfeedHTTP.responseXML.getElementsByTagName("item") ) {
						var allItems = getXMLfeedHTTP.responseXML.getElementsByTagName("item");
						
						resetDB();
						
						db.transaction(function(tx){
							tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (petitionID, articleTitle, articleLink, articleDescription, fbDescription, fbTitle, lastmodified, articlePetitiontext, imageURL, imageURI, readStatus)');
						});
						
						document.getElementById('loadingtext').innerHTML = "caching...";
						
						db.transaction(function (tx) {
								for (var i = 0; i <= allItems.length-6; i++){
									if(allItems[i] && allItems[i].getElementsByTagName("petition_id")[0] && allItems[i].getElementsByTagName("petition_id")[0].firstChild && allItems[i].getElementsByTagName("petition_id")[0].firstChild.nodeValue ){
										var petitionID = allItems[i].getElementsByTagName("petition_id")[0].firstChild.nodeValue;
									}else{
										var petitionID = 0000;
									}
									
									if (allItems[i] && allItems[i].getElementsByTagName("title")[0] && allItems[i].getElementsByTagName("title")[0].firstChild && allItems[i].getElementsByTagName("title")[0].firstChild.nodeValue){
										var articleTitle = allItems[i].getElementsByTagName("title")[0].firstChild.nodeValue;
									}else{
										var articleTitle = "No title";
									}	
									
									if (allItems[i] && allItems[i].getElementsByTagName("link")[0] &&  allItems[i].getElementsByTagName("link")[0].firstChild && allItems[i].getElementsByTagName("link")[0].firstChild.nodeValue){
										var articleLink = allItems[i].getElementsByTagName("link")[0].firstChild.nodeValue;
									}else{
										var articleLink = "";
									}
									
									if(allItems[i] && allItems[i].getElementsByTagName("main_body")[0] && allItems[i].getElementsByTagName("main_body")[0].firstChild && allItems[i].getElementsByTagName("main_body")[0].firstChild.nodeValue){
										var articleDescription = allItems[i].getElementsByTagName("main_body")[0].firstChild.nodeValue + '<div id="signthispetition2"  class="showme" ontouchstart="touchevent.ALLtouchstart(this)"  	ontouchmove="touchevent.ALLtouchmove(this)" ontouchend="quickcheckformValdity(this)"></div>';
									}else{
										var articleDescription = "";
									}
									
									if(allItems[i] && allItems[i].getElementsByTagName("fb_title")[0] && allItems[i].getElementsByTagName("fb_title")[0].firstChild && allItems[i].getElementsByTagName("fb_title")[0].firstChild.nodeValue){
										var fbTitle = allItems[i].getElementsByTagName("fb_title")[0].firstChild.nodeValue;
									}else if(articleDescription){
										var fbTitle = articleTitle;
									}else{
										var fbTitle = "";
									}
									
									if(allItems[i] && allItems[i].getElementsByTagName("fb_description")[0] && allItems[i].getElementsByTagName("fb_description")[0].firstChild && allItems[i].getElementsByTagName("fb_description")[0].firstChild.nodeValue){
										var fbDescription = allItems[i].getElementsByTagName("fb_description")[0].firstChild.nodeValue;
									}else if(articleDescription){
										var fbDescription = articleDescription;
									}else{
										var fbDescription = "";
									}
									
									if(allItems[i] && allItems[i].getElementsByTagName("lastmodified")[0] && allItems[i].getElementsByTagName("lastmodified")[0].firstChild && allItems[i].getElementsByTagName("lastmodified")[0].firstChild.nodeValue){
										var lastmodified = allItems[i].getElementsByTagName("lastmodified")[0].firstChild.nodeValue;
									}else{
										var lastmodified = "";
									}
									
									if (allItems[i] && allItems[i].getElementsByTagName("full_petition_text")[0] && allItems[i].getElementsByTagName("full_petition_text")[0].firstChild && allItems[i].getElementsByTagName("full_petition_text")[0].firstChild.nodeValue) {
										var articlePetitiontext = allItems[i].getElementsByTagName("full_petition_text")[0].firstChild.nodeValue;	
									}else{
										if(articleTitle =="No title"){
											var articlePetitiontext = "";
										}else{
											var articlePetitiontext = articleTitle;
										}
									}
									
									if(allItems[i] && allItems[i].getElementsByTagName("large_image")[0]	&& allItems[i].getElementsByTagName("large_image")[0].firstChild && allItems[i].getElementsByTagName("large_image")[0].firstChild.nodeValue){
								   		var imageURL = allItems[i].getElementsByTagName("large_image")[0].firstChild.nodeValue;	
									}else{
										var imageURL = "error";
									}
									
									(function(){
				        				tx.executeSql('INSERT INTO LOGS (petitionID, articleTitle, articleLink, articleDescription, fbDescription, fbTitle, lastmodified, articlePetitiontext, imageURL, imageURI, readStatus) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, "", "0")', [petitionID, articleTitle, articleLink, articleDescription, fbDescription, fbTitle, lastmodified, articlePetitiontext, imageURL]);        
								})(i);
							};	
			 			}) 
			 			dbTOlist();	
					}else{
						getXMLfeedHTTPTimeout('attempt')
					}		
				}else{
					dbTOlist();	
				}//end of timestamp check	
			}//end else to try again//ends status 200
		};//ends readystate
	};//end of statechange
	
	var randomnumber=Math.floor(Math.random()*11);
	getXMLfeedHTTP.open("GET","***" + randomnumber,true);
	getXMLfeedHTTP.send();	
};

function resetDB(){
	db.transaction(function(tx){
		(function(){
			tx.executeSql("DROP TABLE IF EXISTS LOGS"); 
		})();
	});
	
	db.transaction(function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (petitionID, articleTitle, articleLink, articleDescription, fbDescription, fbTitle, lastmodified, articlePetitiontext, imageURL, imageURI, readStatus)');
	});

};

function getXMLfeedHTTPTimeout(attempt){
	getXMLfeedHTTP.abort();
	if(erroredout.status){
		if(attempt){
			loadingindicator.stop();
			erroredout.status = false;
			navigator.notification.confirm(
				'Sorry but there was a problem retrieving new information... Press Cancel to load cached articles.',  // message
				onConfirm,              // callback to invoke with index of button pressed
				'CREDO Action',         // title
				'Try Again,Cancel'      // buttonLabels
		   )
		}else{
			setTimeout("getXMLfeed('second')",100);
		}
  	}
};

function onConfirm(button) {
	if(button=="2"){
		//cancel button pressed
		erroredout.status = true;
		document.getElementById('loadingtext').innerHTML = "caching...";
		dbTOlist()
	}else{
		erroredout.status = true;
		getXMLfeed()
	}
};

function imageError(that){
	that.src = "defaultimage.png";
	var petitionid = that.parentElement.getAttribute("data-petitionid");
	
	db.transaction(function (tx) {
		tx.executeSql("UPDATE logs SET imageURL ='defaultimage.png' WHERE petitionID = '" + petitionid + "'", [], function (tx, results) {});
	});
}

function imageError2(that){
	that.src = "credoactionlogo.png";
	var petitionid = that.parentElement.getAttribute("data-petitionid");
	
	db.transaction(function (tx) {
		tx.executeSql("UPDATE logs SET imageURL ='credoactionlogo.png' WHERE petitionID = '" + petitionid + "'", [], function (tx, results) {});
	});
}