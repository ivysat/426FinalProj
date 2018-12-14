root_url = "http://comp426.cs.unc.edu:3001";
var $ticket = $('<div class="ticket"></>');

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
			alert('error signing in, please try again');
		}
	});
			
	
});

var build_first_interface = function () {
	$ticket.empty();
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
	body.append('<div id = "containerDiv"> <div id = "leftDiv"><div id="whatTheyHateTitleContainer"><h2 id = "whatTheyHateTitle">What do you really hate?</h2><div id = "radioButtonContainer"></div></div></div> <div id = "rightDiv" class="rhsDiv"><div id="flightDataTitleContainer"><h2 id = "flightDataTitle">Sheesh, you can check the counts on these flights...</h2><div class="loading"><\></div></div> </div>');
	let radioButtonContainerDiv = $('#radioButtonContainer').append('<input type="radio" name="age" value="babies"> Babies<br><input type="radio" name="age" value="children"> Children<br><input type="radio" name="age" value="Teenagers"> Teenagers<br><input type="radio" name="age" value="millenials"> Millenials<br><input type="radio" name="age" value="genXers"> Gen Xers<br><input type="radio" name="age" value="boomers"> Baby Boomers<br><input type="radio" name="age" value="traditionalists"> Traditionalists<br>');

	$(document).ajaxStart(function() {
		$(".loading").text("Updating flight information");
	});
	
	$(document).ajaxStop(function () {
		$(".loading").text("Everything is up to date!");
	});

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

		var $flightsContainer = $('<div id="flightsContainer"></>');
		

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
					//document.getElementById("rightDiv").innerHTML = "Searching for your ideal flight";
				   console.log(originLocation);
					
					 if (airports.length == 0) {
						 //LATER NEED TO UPDATE RHS TO BE EMPTY
						 console.log("Failed to find any airports in that city");
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
											let flightID = flights[j].id;
											//Store time to check valid booking
											let departsAt = new Date(flights[j].departs_at);
											let arrivesAt = new Date(flights[j].arrives_at);
											let number = String(flights[j].number);
											//Store Destination to generate ticket
											$.ajax(root_url+'/airports/' + flights[j].arrival_id,{
												type:'GET',
												xhrFields: {withCredentials: true},	
												success: (destinations) => {
													let destination = (String(destinations.city) + '(' +  String(destinations.code) + ")");

													//Get and store instances of that flight

												$.ajax(root_url + "/instances?filter[flight_id]=" + flightID, {
												type: 'GET',
												xhrFields: {withCredentials: true},
												success: (instances) => {
													
													if (instances.length == 0) {
														//document.getElementById("rightDiv").innerHTML = "We couldn't find any matching flights";
														return;
													}
													
													//Only do flights that are in the future and not cancelled
													for (k = 0; k < instances.length; k++) {
														
														let date = String(instances[k].date).split('-');
														let flightDatetime = new Date(parseInt(date[0]), parseInt(date[1]) -1, parseInt(date[2]), departsAt.getHours(), departsAt.getMinutes(),0,0);
														if (flightDatetime > currentDatetime && instances[k].is_cancelled != true) {
												

														//For each ticket that matches that flight id, check value from radio button
														//Append to RHS sorted by that value
														let $flightDiv = $('<div class="flight"> Destination:  ' + destination +
														'<br>' +  airport.name + '    on ' + flightDatetime +  
														'<br> Flight Number:  '+ number + '' + 
														'<br> Departure time:  ' + String(departsAt.getHours()) + ':' + String(departsAt.getMinutes()) +  
														'<br> Arrival Time:  ' + String(arrivesAt.getHours()) + ':' + String(arrivesAt.getMinutes()) + 
														'<br> Number of ' + selected +': </div>');

														let $countDiv = $('<div id=' + instances[k].id + '>0</div>');
														$countDiv.appendTo($flightDiv);

														if (selected == "babies") {
															for (l = 1; l < 6; l++) {
																getNumTickets(String(instances[k].id), l);
															}
															
														} else if (selected == "children") {
															for (l = 6; l < 13; l++) {
																getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "Teenagers") {
															for (l = 13; l < 19; l++) {
																getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "millenials") {
															for (l = 19; l < 31; l++) {
																getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "genXers") {
															for (l = 31; l < 54; l++) {
																getNumTickets(String(instances[k].id), l);
															}
														} else if (selected == "boomers") {
															for (l = 54; l < 73; l++) {
																getNumTickets(String(instances[k].id), l);
															}
														} else {
															for (l = 73; l < 101; l++) {
																getNumTickets(String(instances[k].id), l);
															}
														}

													
															



														let $checkOut = $('<button type="button" id="checkout" class="sort" onclick="$.xhrPool.abortAll();build_second_interface('+instances[k].id+');">Buy Ticket</>');

														//On checkout click, tear down and reacreate DOM
														$checkOut.appendTo($flightDiv);
														$flightDiv.appendTo($flightsContainer);




														}
													}
												},
												error:(e) => {
													console.log(e);
												} 
											});

													
												},
												error: () => {
													console.log('error getting destination');
												}
	
											});
										  


											
										}
									},
									error: () => {
										//NEED TO EMPTY RIGHTDIV
										document.getElementById("rightDiv").innerHTML = "We couldn't find any matching flights";
										console.log("Failed to find any flights from that city");
									}

								});

							}


				 }
				},
				 //Fail to find airport
			   error: () => {
					 //LATER NEED TO UPDATE RHS TO BE EMPTY
				   console.log("Error retrieving airport!");
			   }
			   //Add airport div to RHS

			  });
			  $flightsContainer.appendTo($('.rhsDiv'));

			  $(function() {
				$.xhrPool = [];
				$.xhrPool.abortAll = function() {
					$(this).each(function(i, jqXHR) {   //  cycle through list of recorded connection
						jqXHR.abort();  //  aborts connection
						$.xhrPool.splice(i, 1); //  removes from list by index
					});
				}
				$.ajaxSetup({
					beforeSend: function(jqXHR) { $.xhrPool.push(jqXHR); }, //  annd connection to list
					complete: function(jqXHR) {
						var i = $.xhrPool.indexOf(jqXHR);   //  get index for current connection completed
						if (i > -1) $.xhrPool.splice(i, 1); //  removes from list by index
					}
				});
			})



		});

	//Instance will be unique id for num div
	function getNumTickets(instance, age) {
		var request = $.ajax(root_url+'/tickets?filter[age]='+age+'&filter[instance_id]='+instance, {
			type:'GET',
			xhrFields: {withCredentials: true},
			success: (num) => {
				let curDiv = document.getElementById(instance);
				let curCount = parseInt(curDiv.textContent);
				curCount += num.length;
				curDiv.innerHTML = String(curCount);
			},
			error: (e) => {
				console.log('error retrieving tickets, please try again');
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

	

	  autocomplete(document.getElementById("departure"), cities);




};

var build_second_interface = function(instance){
	console.log("clearing");
	let outerContainer = $("#containerDiv");
	outerContainer.empty();
	outerContainer.html('<div id = bookFlightContainer>\
	<div id="dataInputContainer">\
	<form id ="booking">\
	<input type = "text" class="bookData" id = "firstName" placeholder = "First name"</input>\
	<input type = "text" class="bookData" id = "lastName" placeholder = "Last name"</input>\
	<input type = "text" class="bookData" id = "age" placeholder = "Age (1+)" </input>\
	<input type = "text" class="bookData" id = "gender" placeholder = "Gender"</input>\
	<br><button type = "submit" value ="Book My Flight!" id="book"></button>\
	<button type = "submit" id = "goBackButton" onclick = "build_first_interface();">I Hate This, Go Back!</button>\
	</form>\
	</div>');

	$('#book').click(function() {
		console.log('???');
		$("#firstName").value();
		console.log($("#firstName").value());
		//Update Seats (info = booked), get available seat then take
		$.ajax(root_url+'/seats',{
			type:'GET',
			xhrFields: {withCredentials: true},
			

			success: () => {
				console.log('Sign in gucci!');
				build_first_interface();
			},
			error: () => {
				console.log('not yeet');
			}
		});

		//Update Instance

		//Update Itenerary


		//Change Div to ticket (include all info from prev screen)
	});

};