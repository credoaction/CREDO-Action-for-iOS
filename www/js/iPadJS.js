function dbTOlist(){
	var createDIV = document.createElement("div");
	var scoller2Selected = document.getElementById('scroller2');
	
	//deletes all previous articles in scroller2
	while(scoller2Selected.getElementsByTagName('div').length){
		scoller2Selected.removeChild(scoller2Selected.lastChild)
	}
	
	//creates a fragment 
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM logs', [], function (tx, results) {
			
			var fragment = document.createDocumentFragment();
			
			for (i=0; i<results.rows.length; i++){  
				var petitionID = 					results.rows.item(i).petitionID;
				var articleTitle = 				results.rows.item(i).articleTitle;
				var articleLink = 				results.rows.item(i).articleLink;
				var lastmodified = 				results.rows.item(i).lastmodified;
				var articleDescription = 		results.rows.item(i).articleDescription;
				var imageURL = 					results.rows.item(i).imageURL;
				
				var readStatus = 		results.rows.item(i).readStatus;
			
				var createDIV = 		document.createElement("div");
				var createDIV2 = 		document.createElement("div");
				var createDIV3 = 		document.createElement("div");
				var createIMG = 		document.createElement("img");
				var titleofarticle = 	document.createTextNode(articleTitle);
				
				if(localStorage.getItem('submitted' + petitionID) == "1"){
					createDIV2.setAttribute('class', 'submittedAction');
				}
				else if(localStorage.getItem('viewed' + petitionID) == "1"){
					createDIV2.setAttribute('class', '123' );
				}
				else{
					createDIV2.setAttribute('class', 'newAction');
				}
				
				createDIV3.appendChild(titleofarticle);
				createDIV.setAttribute('id', i);
				createDIV.setAttribute('data-petitionID', petitionID);
				createDIV.setAttribute('onclick', 'loadArticle(this)');
				
				createIMG.setAttribute('src', imageURL );
				createIMG.setAttribute('onerror', 'imageError(this)' );
				createIMG.setAttribute('onload', 'imageSuccess(this)' );
				
				createDIV.appendChild(createDIV2)
				createDIV.appendChild(createIMG)
				createDIV.appendChild(createDIV3)
				fragment.appendChild(createDIV);
				if(fragment.childNodes.length >= 10){
					break;
				}
			}	
				scoller2Selected.appendChild(fragment);
	         setTimeout(function () {myScroll2.refresh()}, 200);
	         setTimeout(function () {panels.show();}, 300);
				loadArticle( document.getElementById('scroller2').firstChild );
		});
	})
}; 

function loadArticle(articleID2){
	var allarticles = document.getElementById('scroller2').childNodes;
	var x=0;
	for (x=0; x<= allarticles.length; x++ ){
		if (allarticles[x]){
	 		allarticles[x].setAttribute('class', 'newAction1');
		}
	}
	
	articleID2.setAttribute("class","selectedAction")
	var chosenPetitionID = articleID2.getAttribute('data-petitionid');
	if ( articleID2.childNodes[0].getAttribute('class') == "newAction"){
		articleID2.childNodes[0].setAttribute('class','')
	}
	
	localStorage['viewed'+chosenPetitionID] = '1';
	db.transaction(function (tx) {
		tx.executeSql("SELECT * FROM logs WHERE petitionID = '" + chosenPetitionID + "'", [], function (tx, results2) {
			var scoller2Selected = document.getElementById('scroller2');
			document.getElementById('mainArticleimage').style.backgroundImage="url(" + results2.rows.item(0).imageURL + ")";
			document.getElementById('facebookmessageimage').src= results2.rows.item(0).imageURL;
			document.getElementById('petition_id').value= results2.rows.item(0).petitionID;
			document.getElementById('mainarticleTitle').innerHTML = results2.rows.item(0).articleTitle;
			document.getElementById('redirect_url').value = results2.rows.item(0).articleLink + "letter.html";
			document.getElementById('petitionReads').innerHTML = results2.rows.item(0).articlePetitiontext;
			document.getElementById('petitionReads2').innerHTML = results2.rows.item(0).articlePetitiontext;
			document.getElementById('facebookmessagedescription').innerHTML = results2.rows.item(0).articlePetitiontext;
			document.getElementById('mainarticleText').innerHTML = results2.rows.item(0).articleDescription;
			document.getElementById('facebookmessagetitle').innerHTML = results2.rows.item(0).articleTitle;
			document.getElementById('facebookmessageurl').innerHTML = results2.rows.item(0).articleLink;
			setTimeout(function () {myScroll.refresh();}, 50);
			convertAnchors()
		});
		
	})
	loadingindicator.stop();
	myScroll.scrollTo(0, 0, 0)
};

var touchevent = {
	ALLtouchstart: function(that){
		touched = true;
		that.setAttribute("class", "touched");
	},
	ALLtouchmove: function(that){
		that.setAttribute("class", "");
		touched = false;
	},
	SETTINGStouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			showhidesettingspanel();
		};
	},
	INCREASEtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			textsize.increase()
		};
	},
	DECREASEtouchend: function(that){
		that.setAttribute("class", "");
		if (touched){
			textsize.decrease()
		};
	}
};