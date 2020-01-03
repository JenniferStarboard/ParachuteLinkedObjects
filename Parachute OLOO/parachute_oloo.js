//Have Data Structure to reference for functions
//Avoid Recursion if Possible-I don't think its possible
//Use design rules suggested for OLOO in the 'You Don't Know JS' books

/*Style Guidelines For Self
	1. functions which return something start with a lowercase letter.
	2. Functions which are simply blocks of code tucked away start with an uppercase letter.
	3. ''is for things that do not end up a strings obj['propertyName']
	4. "" is for things that are outputed as strings.
*/

//Global Varables
var stopRec = 0;
var guard = 0;

var priAction = {
	recordWins: function(allMatches){ //'This' the priority object 
		function getMatches(el){ //'This' is defender, a string
			let list = el.options;
			let go = false;
			
			for(let i=0; i<list.length; i++){
				if(list[i].value===defender){
					go = true;
				}	
			}
			
			return go;
		};
		
		let defender = this.priority;
		let schedule = allMatches.filter(getMatches, defender);
		
		for(let i=0; i<this.wins.length; i++){
			for(let j=0; j<schedule.length; j++){
				let list = schedule[j].options
				if((list[0].value===this.wins[i].op)||(list[1].value===this.wins[i].op)||(list[2].value===this.wins[i].op)){
					this.wins[i].vic = (schedule[j].value===defender) ? true: false;
				}
			}
		}
	},
	scoreCount: function (arrWins){
		let sc = 0;
		for(let i=0; i<arrWins.length; i++){
			sc = (arrWins[i].vic===true)? sc + 1: sc;
		}
		
		this.score = sc;
	},
	reCount: function (e0, arr){
		let sc = 0;
		for(let i=0; i<arr.length; i++){
			for(let j=0; j<e0.wins.length; j++){
				if(arr[i]===e0.wins[j].op){
					sc = (e0.wins[j].vic===true)? sc + 1: sc;
				}
			}
		}
		
		e0.reScore = sc;
	},
	wonTwoTie: function (defend, chall){ 
		
		let comer = defend.wins.find(function(e1){return e1.op === chall.priority});
		let victor = (comer.vic===true)? defend: chall;
		
		return  victor;
	},
	lostTwoTie: function (defend, chall){
		
		let comer = defend.wins.find(function(e1){return e1.op === chall.priority});
		let lost = (comer.vic===false)? defend: chall;
		
		return  lost;
	}	
};

var dataBoxAction = {
	constructPriorityObjs: function (arrNames, arrHold){
		function priData(el){ //'this' is arrHold
			
			let priObj = Object.create(priAction);
			priObj.priority = el;
			priObj.wins = [];
			priObj.score = -1;
				
			this.push(priObj);
		}
		arrNames.forEach(priData, arrHold);
	},
	
	constructMatchObjs: function(arrNames, arrFulledRecord){
		function matchData(e1){ //'this' arrNames
			function insideConstruct(e3){ //'this' is el.wins
				let match = {
					op: e3
				};
				this.push(match);
			};
			let removeDuplicate = this.filter(function(e2){ return this.priority!==e2}, e1);
			
			removeDuplicate.forEach(insideConstruct, e1.wins);
		}
		arrFulledRecord.forEach(matchData, arrNames);
	},
	
	//methods to use on the array with priority Objects
	checkGreaterTies: function (arr, prop){//arr needs to be sorted by sc
		for(let i=0; i<arr.length-2; i++){
			if((arr[i][prop]===arr[i+1][prop])&&(arr[i][prop]===arr[i+2][prop])){
				return true;
			}
		}
		return false;
	},
	
	getTieSize: function (arr, start, prop){
		let n = 1;
		for(let i=start; i<arr.length-1; i++){
			if(arr[i][prop]===arr[i+1][prop]){
				n++;
			} else {	
				return n;
			}
		}
		return n;
	},
	
	getGreatTieLocation(arr, prop){
		for(let i=0; i<arr.length-2; i++){
			if((arr[i][prop]===arr[i+1][prop])&&(arr[i][prop]===arr[i+2][prop])){
				return i;
			}
		}
		
		return -1;
	},
	
	sortBy: function (arr, prop){
		arr.sort(function(e0, e2){return e2[prop] - e0[prop]});
	},
	
	doomCheck: function (arr, prop){
		return arr.every(function(e0){return e0[prop]===arr[0][prop]});
	}
}

var dataBox = Object.create(dataBoxAction);


//Label Collection
function SelectSetUp(pnt) {
		
	function makeBoxes(el, ind, arr){ //Set up dropboxes for user to enter data.
		function dropBox(first, other){
			let box = document.createElement('select');
			let s1 = document.createElement('option');
			let s2 = document.createElement('option');
			let s3 = document.createElement('option');
			
			box.setAttribute('onclick','SwitchColor(this)')
			
			s1.setAttribute('value','Undecided');
			s2.setAttribute('value', first);
			s3.setAttribute('value', other);
			
			s1.text = "Undecided";
			s2.text = first;
			s3.text = other;
			
			box.add(s1);
			box.add(s2);
			box.add(s3);
			
			return box;
		};
		
		let pnt = document.getElementById('selection');
		let heading = document.createElement('h3');
		let hText = document.createTextNode(el);
		let p = document.createElement('p');
		
		for(let i=ind+1; i<arr.length; i++){
			let b = dropBox(el, arr[i]);
			p.appendChild(b);
		}
		
		heading.appendChild(hText);
		pnt.appendChild(heading);
		pnt.appendChild(p);
	};
	
	let holders = Array.from(document.getElementsByTagName('input'));
	let names = holders.filter(function(el){return (el.type==='text')&&(el.value!=="")});
	dataBox.labels = [];
	
	//Reset values every time someone submits labels.
	document.getElementById('selection').innerHTML = "";
	document.getElementById('error').innerHTML = "";
	
	//Copy values of label into dataBox.labels
	names.forEach(function(el){
		dataBox.labels.push(el.value);
	});
	
	dataBox.labels.forEach(makeBoxes);
	//End of function	
}

function Chrunch(){
	
	function basicFromObjArr (arr, prop){
		
		let r0 = [];
		
		for(let i=0; i<arr.length; i++){
			r0.push(arr[i][prop]);
		}
		
		return r0;
	}
	
	function wrapRecordWins(e1){ //'this' is holder, the select elements in HTML
		e1.recordWins(this);
	}
	
	function wrapScoreCount(e1){
		e1.scoreCount(e1.wins);
	}
	
	function wrapReCount(e1){ //this is an array.
		let arr = [];
		
		for(let i=0; i<this.length; i++){ // Make Array of names
			if(e1.priority!==this[i].priority){
				arr.push(this[i].priority);
			}
		}
		
		e1.reCount(e1, arr)
	}
	
	function createListEl(input){
		let nodeT = document.createTextNode(input);
		let nodeE = document.createElement('li');
		
		nodeE.appendChild(nodeT);
		
		return nodeE;
	}
	
	function RankNoGreatTies(p, arr, sc){
		while(arr.length>1){
			
			if(arr[0][sc]!==arr[1][sc]){
				p.appendChild(createListEl(arr[0].priority));
				
				arr.shift();
				
			} else {
				p.appendChild(createListEl(arr[0].wonTwoTie(arr[0], arr[1]).priority));
				p.appendChild(createListEl(arr[0].lostTwoTie(arr[0], arr[1]).priority));
				
				arr.shift();
				arr.shift();
			}
		}
		
		if(arr.length===1){
			p.appendChild(createListEl(arr.shift().priority));
		}
	}
	
	function ChangeProps(obj, into, clear){
		
		for(let i=0; i<obj.trackRecord.length; i++){
			obj.trackRecord[i][into] = obj.trackRecord[i][clear];
			obj.trackRecord[i][clear] = -1;
		}
	}
	
	function RecursionLand(arr, p){
		
		console.log("Entered RecursionLand");
		
		//Set-up Recursion Guard
		guard++;
		if(guard===stopRec){
			document.getElementById('error').innerHTML = "We almost fell into endless loops";
			console.log('guard: ', guard, 'stopRec: ', stopRec);
			
			return
		}
		
		while(arr.trackRecord.length>0){
			
			let n = arr.getGreatTieLocation(arr.trackRecord, 'score');
			let choped = Object.create(dataBoxAction);
			choped.trackRecord = [];
			
			if(n===-1){ //if no greater ties n= -1.
				RankNoGreatTies(p, arr.trackRecord, 'score');
				
			} else if(n>0){
				let split = arr.trackRecord.splice(0, n);
				RankNoGreatTies(p, split, 'score');
				
			} else {
				let size = arr.getTieSize(arr.trackRecord, 0, 'score');
				choped.trackRecord = arr.trackRecord.splice(n, size);
				choped.trackRecord.forEach(wrapReCount, choped.trackRecord);
				choped.sortBy(choped.trackRecord, 'reScore');
				
				//Need a Doom-Circle Check Here
				if(choped.doomCheck(choped.trackRecord, 'reScore')===true){
					let output = basicFromObjArr(choped.trackRecord, 'priority').toString()
					p.appendChild(createListEl(output));
					
					continue;
				}
				
				if(choped.checkGreaterTies(choped.trackRecord, 'reScore')===false){
					RankNoGreatTies(p, choped.trackRecord, 'reScore');
					
					continue;
				} 
				
				//Move reScore values into score with function.
				ChangeProps(choped, 'score', 'reScore');
				
				RecursionLand(choped, p);	
			}
		}
	}
	
	
	let pntR = document.getElementById('result');
	let holder = Array.from(document.getElementsByTagName('select'));
	
	//Reset Values
	document.getElementById('error').innerHTML = "";
	pntR.innerHTML = "";
	
	//Find out if all comparisons were made
	if(holder.every(function(el){return el.value!=="Undecided"})===false){
		document.getElementById('error').innerHTML = "Make a choice in all the dropdown boxes.";
		return;
	}
	
	//Set-up place to hold data
	dataBox.trackRecord = [];
	dataBox.constructPriorityObjs(dataBox.labels, dataBox.trackRecord); //Create data objects for each priority, put into array
	dataBox.constructMatchObjs(dataBox.labels, dataBox.trackRecord); //Create objects to record comparison data in wins array
	
	//Get the data
	dataBox.trackRecord.forEach(wrapRecordWins, holder); //Track results of comparisons in wins property array.
	dataBox.trackRecord.forEach(wrapScoreCount); //Calculate scores
	
	//Do things with the data
	dataBox.sortBy(dataBox.trackRecord, 'score');
	
	var checkGreat = dataBox.checkGreaterTies(dataBox.trackRecord, 'score')

	if(checkGreat===false){
		RankNoGreatTies(pntR, dataBox.trackRecord, 'score');
	} else {
		
		while(dataBox.trackRecord.length>0){
			
			let n = dataBox.getGreatTieLocation(dataBox.trackRecord, 'score');
			let choped = Object.create(dataBoxAction);
			choped.trackRecord = [];
			
			if(n===-1){ //if no greater ties n= -1.
				RankNoGreatTies(pntR, dataBox.trackRecord, 'score');
				
			} else if(n>0){
				let split = dataBox.trackRecord.splice(0, n);
				RankNoGreatTies(pntR, split, 'score');
				
			} else {
				let size = dataBox.getTieSize(dataBox.trackRecord, 0, 'score');
				choped.trackRecord = dataBox.trackRecord.splice(n, size);
				choped.trackRecord.forEach(wrapReCount, choped.trackRecord);
				choped.sortBy(choped.trackRecord, 'reScore');
				
				//Need a Doom-Circle Check Here
				if(choped.doomCheck(choped.trackRecord, 'reScore')===true){
					let output = basicFromObjArr(choped.trackRecord, 'priority').toString()
					pntR.appendChild(createListEl(output));
					
					continue;
				}
				
				if(choped.checkGreaterTies(choped.trackRecord, 'reScore')===false){
					RankNoGreatTies(pntR, choped.trackRecord, 'reScore');
					
					continue;
				} 
				
				//Into Recursion Territory.  Set up Recursion Guard
				stopRec = choped.trackRecord.length; //Look at the Math closer later.
				guard = 0;
				
				//Move reScore values into score with function.
				ChangeProps(choped, 'score', 'reScore');
				
				RecursionLand(choped, pntR);	
			}
		}
	}
}
	

//Website Interaction Stuff

function SwitchColor(pnt){
	let value = pnt.value;
	
	pnt.style.backgroundColor = (value==="Undecided") ? "#FFFFFF": "#000000";
	pnt.style.color = (value==="Undecided") ? "#000000": "#FFFFFF";
}