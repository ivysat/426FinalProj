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

    body.empty();

	body.append('<h1>I Wanna Leave <input type = "text" id = "originLocation" placeholder = "Raleigh" </input> </h1>');
	body.append("<button id='search_loc'>Submit Location</button></div>");

    $('#search_loc').on('click', () => {
		let originLocation = $('#originLocation').val();
		console.log(root_url + "/airports?filter[city]="+originLocation);
	
		$.ajax(root_url + "/airports?filter[city]="+originLocation,
			   {
			   type: 'GET',
			   xhrFields: {withCredentials: true},
			   success: (airport) => {
				   for (i = 0; i < airport.length; i++) {
					console.log(airport[i].city);
					body.append("<li>" + airport[i].name + "</li>");
				   }				   
			   },
			   error: () => {
				   console.log("fuq");
			   }
			   });
		});
    
    let qlist = $('<div></div>');

    body.append(qlist);

    // $.ajax(root_url + "/questions",
	//    {
	//        type: 'GET',
	//        dataType: 'json',
	//        xhrFields: {withCredentials: true},
	//        success: (response) => {
	// 	   let qarray = response.data;
	// 	   for (let i=0; i<qarray.length; i++) {
	// 	       let qdiv = create_question_div(qarray[i]);
	// 	       qlist.append(qdiv);
	// 	       let qid = qarray[i].id
	// 	       $.ajax(root_url + 'answers/' + qid,
	// 		      {
	// 			  type: 'GET',
	// 			  dataType: 'json',
	// 			  xhrFields: {withCredentials: true},
	// 			  success: (response) => {
	// 			      if (response.data != null) {
	// 				  let answer = response.data;
	// 				  qdiv.append('<div class="answer" id="aid_' + answer.answer_id + '">' +
	// 					      answer.answer_text + '</div>');
	// 				  qdiv.addClass('answered');
	// 			      }
	// 			  }
	// 		      }); 
	// 	   }
	//        }
	//    });

    let create_question_div = (question) => {
	let qdiv = $('<div class="question" id="qid_' + question.id + '"></div>');
	qdiv.append('<div class="qtitle">' + question.title + '</div>');
	qdiv.append('<div class="count">' + question.answerCount + '</div>');
	return qdiv;
    }
};
