root_url = "http://comp426.cs.unc.edu:3001";


$(document).ready(() => {

	let user = "parkerbl";
	let pass = "googleg";

	console.log(user);
	console.log(pass);


	$.ajax(root_url+'/sessions',{
		type:'POST',
		xhrFields: {withCredentials: true},
		
		data: {
			"user":{
		  		"username":user,
		  		"password":pass
			}
		},
		success: () => {
			console.log('Sign in gucci!');
			build_first_interface();
		},
		error: () => {
			alert('error');
		}
	});
			
	
});

var build_first_interface = function () {
	let body = $('body');
	
	let cities = ["Kansas City","Phoenix","Newark","Fort Lauderdale","Miami","Long Beach","Savannah","Dayton","Little Rock","New York","Memphis","Boise","El Paso",
	"Seattle","Indianapolis","Lihue","San Antonio","Providence","Tampa","Nashville","Portland","Honolulu","Fort Myers","Windsor Locks","Palm Springs","Agana","Oakland",
	"Kahului","San Francisco","Cleveland","Kona","Washington","Houston","Norfolk","Raleigh-durham","Austin", "Jacksonville", "San Diego","Syracuse","Tulsa","Albany",
	"Charlotte","Boston", "Wichita","Spokane","Los Angeles","Pensacola", "Pittsburgh","White Plains","St. Petersburg","Tucson","Burbank","Knoxville","Atlanta","Ontario",
	"San Jose","Philadelphia","Anchorage","Reno","Buffalo","Chicago","Baltimore","Oklahoma City","Las Vegas","Albuquerque", "San Juan","Omaha","Madison","Cincinnati",
	"Myrtle Beach","Salt Lake City","Richmond","Rochester","Detroit","Dallas-Fort Worth","St. Louis","Grand Rapids","Milwaukee", "West Palm Beach","Charleston","Birmingham",
	"New Orleans", "Manchester NH","Des Moines","Denver","Columbus","Sacramento","Minneapolis","Santa Ana", "Greensboro","Louisville","Sanford","Orlando","Greenville"];

    body.empty();

	body.append('<h1 id = "titleHeader">I Hate  <div class="autocomplete"><input type = "text" id = "departure" placeholder = "Raleigh-durham" </input></div>, But I <i>Really</i> Hate...</h1>');
	body.append("<button id='search_loc'>Let's Go!</button></div>");
	body.append('<div id = "containerDiv"> <div id = "leftDiv"><div id="whatTheyHateTitleContainer"><h2 id = "whatTheyHateTitle">What do you really hate?</h2></div></div> <div id = "rightDiv"><div id="flightDataTitleContainer"><h2 id = "flightDataTitle">Maybe you won\'t hate these...</h2></div></div> </div>');

    $('#search_loc').on('click', () => {
		let originLocation = $('#departure').val();
	
		$.ajax(root_url + "/airports?filter[city]="+originLocation,
			   {
			   type: 'GET',
			   xhrFields: {withCredentials: true},
			   success: (airport) => {
				   for (i = 0; i < airport.length; i++) {
					body.append("<li>" + airport[i].name + "</li>");
					console.log(airport[i].name);
				   }				   
			   },
			   error: () => {
				   console.log("fuq");
			   }
			   });
		});



    
    let qlist = $('<div></div>');


    let create_question_div = (question) => {
	let qdiv = $('<div class="question" id="qid_' + question.id + '"></div>');
	qdiv.append('<div class="qtitle">' + question.title + '</div>');
	qdiv.append('<div class="count">' + question.answerCount + '</div>');
	return qdiv;
	}
	
	function autocomplete(inp, arr) {
		/*execute a function when someone writes in the text field:*/
		inp.addEventListener("input", function(e) {
			var autoList, autoElt, i, val = this.value;
			/*close any already open lists of autocompleted values*/
			closeAllLists();
			if (!val) { return false;}
			/*create a DIV element that will contain the items (values):*/
			autoList = document.createElement("DIV");
			autoList.setAttribute("id", this.id + "autocomplete-list");
			autoList.setAttribute("class", "autocomplete-items");
			this.parentNode.appendChild(autoList);

			for (i = 0; i < arr.length; i++) {
			  if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				autoElt = document.createElement("DIV");
				autoElt.append(arr[i]);
				/*insert a input field that will hold the current array item's value:*/
				autoElt.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				autoElt.addEventListener("click", function(e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				autoList.appendChild(autoElt);
			  }
			}

		});

		function closeAllLists(elmnt) {
		  /*close all autocomplete lists in the document,
		  except the one passed as an argument:*/
		  var x = document.getElementsByClassName("autocomplete-items");
		  for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
			x[i].parentNode.removeChild(x[i]);
		  }
		}
	  }
	  /*execute a function when someone clicks in the document:*/
	  document.addEventListener("click", function (e) {
		  closeAllLists(e.target);
	  });
	  }

	  autocomplete(document.getElementById("departure"), cities);
};
