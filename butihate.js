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
			build_second_interface();
		},
		error: () => {
			alert('error signing in, please try again');
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
	body.append('<div id = "containerDiv"> <div id = "leftDiv"><div id="whatTheyHateTitleContainer"><h2 id = "whatTheyHateTitle">What do you really hate?</h2><div id = "radioButtonContainer"></div></div></div> <div id = "rightDiv" class="rhsDiv"><div id="flightDataTitleContainer"><h2 id = "flightDataTitle">Maybe you won\'t hate these...</h2></div></div> </div>');
	let radioButtonContainerDiv = $('#radioButtonContainer').append('<input type="radio" name="age" value="babies"> Babies<br><input type="radio" name="age" value="children"> Children<br><input type="radio" name="age" value="Teenagers"> Teenagers<br><input type="radio" name="age" value="millenials"> Millenials<br><input type="radio" name="age" value="genXers"> Gen Xers<br><input type="radio" name="age" value="boomers"> Baby Boomers<br><input type="radio" name="age" value="traditionalists"> Traditionalists<br>');

    $('input[type="radio"]').on('click', () => {
		let selected = document.querySelector('input[name="age"]:checked').value;
		console.log(selected);
		let originLocation = $('#departure').val();
		try {
			let cont = document.getElementById('flightsContainer');
			cont.parentNode.removeChild(cont);
		} catch (err) {
			//For first load, do nothing
		}

		var $flightsContainer = $('<div id="flightsContainer">Howdy</>');
		

		//Make sure only returning flights today or later
		let currentDatetime = new Date(); 


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
						 console.log("Failed to find any airports in that city");
						 document.getElementById("rightDiv").innerHTML = "We couldn't find any flights";
						 return;
					 } else {
							for  (i = 0; i < airports.length; i++) {
								let airport = airports[i];
								
								$.ajax(root_url + "/flights?filter[departure_id]="+ airports[i].id, 
								{

									type: 'GET',
									xhrFields: {withCredentials: true},
									success: (flights) => {
								
										//Get each flight matching constraints
										for (j = 0; j < flights.length; j++) {
											//Store time to check valid booking
											let departsAt = new Date(flights[j].departs_at);

											//Get and store instances of that flight
											$.ajax(root_url + "/instances?filter[flight_id]=" + flights[j].id, {
												type: 'GET',
												xhrFields: {withCredentials: true},
												success: (instances) => {
													
													if (instances.length == 0) {
														document.getElementById("rightDiv").innerHTML = "We couldn't find any matching flights";
														console.log("We couldn't find any flight instances from that destination");
														return;
													}
													
													//Only do flights that are in the future and not cancelled
													for (k = 0; k < instances.length; k++) {
														let date = String(instances[k].date).split('-');
														let flightDatetime = new Date(parseInt(date[0]), parseInt(date[1]) -1, parseInt(date[2]), departsAt.getHours(), departsAt.getMinutes(),0,0);
														if (flightDatetime > currentDatetime && instances[k].is_cancelled != true) {
														//Get number of seats on flight containing age range
														count = 0;

														if (selected == "babies") {
															for (l = 0; l < 6; l++) {
																console.log(getNumTickets(String(instances[k].id), l));
																count += getNumTickets(String(instances[k].id), l);
															}
															
														} else if (selected == "children") {
															for (l = 6; l < 13; l++) {
																count += getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "Teenagers") {
															for (l = 13; l < 19; l++) {
																count += getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "millenials") {
															for (l = 19; l < 31; l++) {
																count += getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "genXers") {
															for (l = 31; l < 54; l++) {
																count += getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "boomers") {
															for (l = 54; l < 73; l++) {
																count += getNumTickets(String(instances[k].id), l);
															}
														} else {
															for (l = 73; l < 101; l++) {
																count += getNumTickets(String(instances[k].id), l);
															}
														}
														console.log(count);

													
															
															
														//For each ticket that matches that flight id, check value from radio button
														//Append to RHS sorted by that value
														let $flightDiv = ('<div class="flight">Airport:' + airport.name + '<br/>\
														Destination:\
														Departure time:   Arrival Time:\
														Flight Number:\
														Number of' + selected +':' + '</div>');
														let $sortAlph = $('<button type="button" id="checkout" class="sort">Buy Ticket</>');
														$flightDiv.appendTo($flightsContainer);




														}
													}
												},
												error:(e) => {
													console.log(e);
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
			   //Add airport div to RHS

			  });
			  $flightsContainer.appendTo($('.rhsDiv'));



		});



    function getNumTickets(instanceId, age) {
		$.ajax(root_url + "/tickets?filter[instance_id]="+instanceId+"&filter[age]="+age,
		{
		  type: 'GET',
		  xhrFields: {withCredentials: true},
		  success: (tickets) => {
			console.log(tickets.length);
			return parseInt(tickets.length);
		  },
		   error: () => {
			console.log("error getting number of unwanted people");
		  }
		});
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

	  function buyTicket() {
		//Give unique id to customer
		//Rebuild DOM for simple checkout screen
	  }

	  function returnToSearch() {
		//Button on second 
	  }

	  autocomplete(document.getElementById("departure"), cities);
};

var build_second_interface = function(){
	console.log("clearing");
	let outerContainer = $("#containerDiv");
	outerContainer.empty();
	outerContainer.html('<div id = bookFlightContainer><input type = "text" id = "firstName" placeholder = "First name"</input><input type = "text" id = "lastName" placeholder = "Last name"</input><input type = "text" id = "age" placeholder = "Age (1+)" </input><input type = "text" id = "gender" placeholder = "Gender"</input></div>');

};