function onDeviceReadyiphone() {	
	PhoneGap.exec(function(success){}, function(error){}, "CDVLocalStorage", "restore", []);
	PhoneGap.exec(null, null, "CDVLocalStorage", "verifyAndFixDatabaseLocations", []);
	db = window.openDatabase("db", "1.0", "Test DB", 1000000);

	FB.init({ appId: "***", nativeInterface: PG.FB, useCachedDialogs: false });
 	setTimeout("getXMLfeed()",100);

	document.addEventListener("resume", onResume, false); 
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
};

function onResume(){
	document.getElementById('loadingtext').innerHTML = "one sec...";
	var submittedtime = parseInt(localStorage.getItem("submittedtime")) + 15;
	var currenttime500 = Math.round((new Date()).getTime() / 1000);
			
	if ( submittedtime < currenttime500 || isNaN(submittedtime) ){
		panel.hide();
		document.getElementById('facebookpanel').style.webkitTransform = "translate(0px,-1500px)";
		setTimeout(function () {
			document.getElementById('facebookpanel').style.display = "none";
		}, 150);

		document.getElementById('loadingtext').innerHTML = "one sec...";		
	   setTimeout("getXMLfeed()",100);
		setTimeout("loadingindicator.start('white')",50);
	   loadFBimage();
	}
	isTwitterSetup();
};

function createScroll(){
	myScroll = new iScroll('wrapper', {
		vScrollbar: false
	});
}

function createScroll2(){
	myScroll2 = new iScroll('wrapper2', {
		vScrollbar: false
	});
}

function dbTOlist(){
	var createDIV 			= document.createElement("div");
	var scrollerSelected = document.getElementById('scroller');
	var fragment 			= document.createDocumentFragment();

	//creates a fragment 
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM logs', [], function (tx, results) {
			for (i=0; i<results.rows.length; i++){  
				var petitionID   = 				results.rows.item(i).petitionID;
				var articleTitle = 				results.rows.item(i).articleTitle;
				var articleLink  = 				results.rows.item(i).articleLink;
				var lastmodified = 				results.rows.item(i).lastmodified;
				var articlePetitiontext = 		results.rows.item(i).articlePetitiontext;
				var imageURL 	= 					results.rows.item(i).imageURL;
				var readStatus = 					results.rows.item(i).readStatus;
				
				var createDIV  = 			document.createElement("div");
				var createDIV2 = 			document.createElement("div");
				var createDIV3 = 			document.createElement("div");
				var createIMG  = 			document.createElement("img");
				var createDIV5 = 			document.createElement("div");
				var createDIV6 = 			document.createElement("div");
				var createDIV7 = 			document.createElement("div");
				var createDIV8 = 			document.createElement("div");
				
				var titleofarticle = 	document.createTextNode(articleTitle);
				var first50ofpetitiontext 		 = 	articlePetitiontext.substring(0,100);
				var articlePetitiontextfordiv  = 	document.createTextNode(first50ofpetitiontext);

				if( localStorage.getItem('submitted' + petitionID) == "1" ){
					createDIV2.setAttribute('class', 'submittedAction');
				}else if( localStorage.getItem('viewed' + petitionID) == "1" ){
					createDIV2.setAttribute('class', 'noAction' );
				}else{
					createDIV2.setAttribute('class', 'newAction');
				}
				
				createDIV3.appendChild(titleofarticle);
				createDIV5.appendChild(articlePetitiontextfordiv);
				createDIV7.setAttribute('class', 'bottomSpacer');
/* 				createDIV.setAttribute('id', i); */
				createDIV.setAttribute('data-petitionID', petitionID);
				
				createDIV3.setAttribute('class', 'titleofeachAction');
				createDIV5.setAttribute('class', 'descriptionofeachAction');

				createIMG.setAttribute('src', imageURL );
				createIMG.setAttribute('onerror', 'imageError(this)' );
				createIMG.setAttribute('onload', 'imageSuccess(this)' );
				
				createDIV.appendChild(createDIV2)
				createDIV.appendChild(createIMG)
				createDIV.appendChild(createDIV3)
				createDIV.appendChild(createDIV5)
				createDIV.appendChild(createDIV7)
				
				fragment.appendChild(createDIV);
			}
			scrollerSelected.innerHTML ="";
			fragment.appendChild(createDIV6)
			scrollerSelected.appendChild(fragment);
			
			for (var i=0; i<scrollerSelected.childNodes.length-1; i++){
				var child= scrollerSelected.childNodes[i];
		   	child.addEventListener("click", function(e){ markasreadiphone(this) }, false); 
		   	child.addEventListener("touchstart", function(e){ touchevent.ARTICLEtouchstart(this) }, false); 
		   	child.addEventListener("touchmove", function(e){ touchevent.ALLtouchmove(this) }, false); 
		   	child.addEventListener("touchend", function(e){ touchevent.touchend(this) }, false); 											
		   };
		   
			loadingindicator.stop();
			setTimeout(function () {myScroll.refresh();}, 500);
		});
	})
}; 

function loadArticle(articleID2){
	var doc = window.document;
	var allarticles = doc.getElementById('scroller').childNodes;
	var chosenPetitionID = articleID2.getAttribute('data-petitionid');
	
	db.transaction(function (tx) {
		tx.executeSql("SELECT * FROM logs WHERE petitionID = '" + chosenPetitionID + "'", [], function (tx, results2) {
			doc.getElementById('petition_id').value = chosenPetitionID;
			
			if (results2.rows.item(0).imageURL =="defaultimage.png"){
				doc.getElementById('facebookmessageimage').src = "credoactionlogo.png";
			}else{
				doc.getElementById('facebookmessageimage').src = results2.rows.item(0).imageURL;
			}
			
			doc.getElementById('facebookmessageurl').innerHTML = results2.rows.item(0).articleLink;
			doc.getElementById('facebookmessagetitle').innerHTML = results2.rows.item(0).fbTitle;
			doc.getElementById('mainarticleTitle').innerHTML = results2.rows.item(0).articleTitle;
			doc.getElementById('redirect_url').value = results2.rows.item(0).articleLink + "letter.html";
			doc.getElementById('mainarticleText').innerHTML = results2.rows.item(0).articleDescription;
			doc.getElementById('facebookmessagedescription').innerHTML = results2.rows.item(0).fbDescription;
			doc.getElementById('petitionReads').innerHTML = results2.rows.item(0).articlePetitiontext;
			doc.getElementById('petitionReads2').innerHTML = results2.rows.item(0).articlePetitiontext;
			doc.getElementById('mainarticleText').style.fontSize = localStorage.getItem("fontsize");
			setTimeout(function () {myScroll2.refresh();}, 150);
			convertAnchors();
		});
	})
};

var facebookpanel = {
	show: function(){
		blackpanel.show('black')
		document.getElementById('facebookpanel').style.display = "block";
		setTimeout(function () {
			document.getElementById('facebookpanel').style.webkitTransform = "translate(0px,-436px)";
		}, 150);
	},
	hide: function(){
		blackpanel.hide()
		document.getElementById('facebookpanel').style.webkitTransform = "translate(0px,-1500px)";
		setTimeout(function () {
			document.getElementById('facebookpanel').style.display = "none";
		}, 250);
	}
};

var panel = {
	show: function(){
		document.getElementById('panel').style.display = "inline";
		setTimeout(function () {document.getElementById('panel').style.webkitTransform = "translate(0px,-100%)";}, 50);
	},
	hide: function(){
		this.loadarticleTemplate();
		document.getElementById('panel').style.webkitTransform = "translate(0px,0px)";
		setTimeout(function () {document.getElementById('panel').style.display = "none";}, 350);
	},
	loadPetition: function(){
		document.getElementById('wrapper2').innerHTML = document.getElementById('petition').innerHTML;
		userinfo.load();
	},
	loadarticleTemplate: function(){
		setTimeout(function () {
			document.getElementById('wrapper2').innerHTML = document.getElementById('articleTemplate').innerHTML;
			createScroll2();
		}, 150);
	},
	loadSharing: function(){
		document.getElementById('wrapper2').innerHTML = document.getElementById('sharing').innerHTML;
	},
	loadSettings: function(){
		document.getElementById('wrapper2').innerHTML = document.getElementById('settingsTemplate').innerHTML;
	}
};

var iphonetextsize = {
	increase: function(){
		var mainarticleText = document.getElementById('mainarticleText');
		var currentTextsize = mainarticleText.style.fontSize;
		
		if (currentTextsize == ''){
			currentTextsize = '135%';
			localStorage.setItem("fontsize", "135%");
		}else if (currentTextsize > '200%'){
			return false;
		}else{
			mainarticleText.style.fontSize = parseInt(currentTextsize) + parseInt('10') + "%";
			localStorage.setItem("fontsize", mainarticleText.style.fontSize);
		}
		setTimeout(function () {
			myScroll2.refresh();
		}, 50);
	},
	decrease: function(){
		var mainarticleText = document.getElementById('mainarticleText');
		var currentTextsize = mainarticleText.style.fontSize;

		if (currentTextsize == ''){
			currentTextsize == '110%';
			localStorage.setItem("fontsize", "110%");
		}else if (currentTextsize < '120%'){
			return false;
		}else{
			mainarticleText.style.fontSize = parseInt(currentTextsize) - parseInt('10') + "%";
			localStorage.setItem("fontsize", mainarticleText.style.fontSize);
		}
		
		setTimeout(function () {
			myScroll2.refresh();
		}, 50);
	}
};

function markasreadiphone(that){
	var chosenPetitionID = that.getAttribute('data-petitionid');
	localStorage['viewed'+chosenPetitionID] = '1';
	if(that){
		if ( that.childNodes[0].getAttribute('class') == "newAction"){
			that.childNodes[0].setAttribute('class','noAction')
		};
	};
};

var touchevent ={
	ALLtouchstart: function(that){
		touched = true;
		that.setAttribute("class", "touched");
	},
	ALLtouchmove: function(that){
		that.setAttribute("class", "");
		touched = false;
	},
	ARTICLEtouchstart: function(that){
		loadArticle(that);
		touched = true;
		that.setAttribute("class", "touched");
	},
	SETTINGStouchstart: function(that){
		touched = true;
		that.setAttribute("class", "touched");
		panel.loadSettings();
	},
	touchend: function(that){
		if (touched){
			document.getElementById('decreasetextsize').style.display = "block";
			document.getElementById('increasetextsize').style.display = "block";
			panel.show();
		};
	},
	DONEtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			panel.hide();
		};
	},
	HOMEtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			panel.show();
			panel.loadSharing();
		};
	},
	INCREASEtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			iphonetextsize.increase()
		};
	},
	DECREASEtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			iphonetextsize.decrease()
		};
	},
	FACEBOOKtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			facebookpanel.show()
		};
	},
	FBITtouchend: function(that){
		loadingindicator.start('white');
		document.getElementById('facebookpanel').style.zIndex ="200";
		that.setAttribute("class", "");
		if (touched){
			posttoFB('iphone', that)
		};
	},
	FBITCANCELtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			facebookpanel.hide()
		};
	},
	EMAILITtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			emailArticle(that);
		};
	},
	SIGNITtouchend: function(that){
		userinfo.load();
		that.setAttribute("class", "");
		if( quickiphonecheckformValdity() == 7 ){
			if (touched){
				checkformValdity(that,false,'iphone');
			}
		}else{
			if (touched){
				document.getElementById('decreasetextsize').style.display = "none";
				document.getElementById('increasetextsize').style.display = "none";
				panel.loadPetition();
			};
		}
	},
	SUBMITITtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			checkformValdity(that,false,'iphone');
		};
	},
	TWEETITtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			tweetArticle('iphone',that);
		};
	},
	SETTINGStouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			document.getElementById('decreasetextsize').style.display = "none";
			document.getElementById('increasetextsize').style.display = "none";
			userinfo.load();
			panel.show();
		};
	}
};

function iphonesettoSubmitted(petitionID) {
	var allarticles = document.getElementById('scroller').getElementsByTagName('div');
	for (var x=0; x<= allarticles.length; x++ ){
		if ( allarticles[x] && allarticles[x].getAttribute('data-petitionid') == petitionID ) {
		 	allarticles[x].firstChild.setAttribute('class', 'submittedAction');
		}
	}
};

function iphonepreloadImages(){
	var i = 0;
	imageObj = new Image();
	images = new Array();
	
	images[0] = "../img/submitpetitiontouched.png";
	images[1] = "../img/submitpetitiontouched@2x.png";
	
	images[2] = "../img/decreaseTextsizetouched.png";
	images[3] = "../img/increaseTextsizetouched.png";
	
	images[4] = "../img/icon-settingstouched.png";
	images[5] = "../img/icon-settingstouched@2x.png";
	
	images[6] = "../img/emailittouched.png";
	images[7] = "../img/emailittouched@2x.png";
	
	images[8] = "../img/facebooksharethislinktouched.png";
	images[9] = "../img/facebooksharethislinktouched@2x.png";
	
	images[10]= "../img/tweetittouched.png";
	images[11]= "../img/tweetittouched@2x.png";
	
	images[12]= "../img/fbcancelittouched.png";
	images[13]= "../img/fbcancelittouched@2x.png";
	
	for(i=0; i<=13; i++){
		imageObj.src=images[i];
	}
};