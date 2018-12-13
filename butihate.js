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

		//Make sure only returning flights today or later
		let currentDatetime = new Date(); 
		console.log(currentDatetime);


		//Map flight -> instances
		//Map instances -> tickets	
		let flightInfo = new Map();
		
	
		$.ajax(root_url + "/airports?filter[city]="+originLocation,
			 {
			   type: 'GET',
			   xhrFields: {withCredentials: true},
			   success: (airports) => {

					 if (airports.length == 0) {
						 //LATER NEED TO UPDATE RHS TO BE EMPTY
						 alert("Failed to find any airports in that city");
						 return;
					 } else {
							for  (i = 0; i < airports.length; i++) {
								console.log(airports[i].name);
								
								$.ajax(root_url + "/flights?filter[departure_id]="+ airports[i].id, 
								{

									type: 'GET',
									xhrFields: {withCredentials: true},
									success: (flights) => {
								
										//Get each flight matching constraints
										for (j = 0; j < flights.length; j++) {
											//Store time to check valid booking
											let departsAt = new Date(flights[j].departs_at);

											//Get instances of that flight
											$.ajax(root_url + "/instances?filter[flight_id]=" + flights[j].id, {
												type: 'GET',
												xhrFields: {withCredentials: true},
												success: (instances) => {
													
													if (instances.length == 0) {
														alert("We couldn't find any flight instances from that destination");
														return;
													}
													
													for (k = 0; k < instances.length; k++) {
														let date = String(instances[k].date).split('-');
														let flightDatetime = new Date(parseInt(date[0]), parseInt(date[1]) -1, parseInt(date[2]), departsAt.getHours(), departsAt.getMinutes(),0,0);
														console.log(flightDatetime);
														console.log(instances[k]);
													}
												},
												error:(e) => {
													console.log(e);
													alert("Error finding instances!");
												} 
											});
										}
									},
									error: () => {
										//NEED TO EMPTY RIGHTDIV
										alert("Failed to find any flights from that city");
									}

								});

							}


				 }
				},
				 //Fail to find airport
			   error: () => {
					 //LATER NEED TO UPDATE RHS TO BE EMPTY
				   alert("Error retrieving airport!");
			   }
			  });
		});



    
	
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
