root_url = "http://comp426.cs.unc.edu:3001";

var build_question_interface = function () {
    let body = $('body');

    body.empty();

    body.append('<h1>Questions and Answers</h1>');
    
    let qlist = $('<div></div>');

    body.append(qlist);

    $.ajax(root_url + "questions",
	   {
	       type: 'GET',
	       dataType: 'json',
	       xhrFields: {withCredentials: true},
	       success: (response) => {
		   let qarray = response.data;
		   for (let i=0; i<qarray.length; i++) {
		       let qdiv = create_question_div(qarray[i]);
		       qlist.append(qdiv);
		       let qid = qarray[i].id
		       $.ajax(root_url + 'answers/' + qid,
			      {
				  type: 'GET',
				  dataType: 'json',
				  xhrFields: {withCredentials: true},
				  success: (response) => {
				      if (response.data != null) {
					  let answer = response.data;
					  qdiv.append('<div class="answer" id="aid_' + answer.answer_id + '">' +
						      answer.answer_text + '</div>');
					  qdiv.addClass('answered');
				      }
				  }
			      }); 
		   }
	       }
	   });

    let create_question_div = (question) => {
	let qdiv = $('<div class="question" id="qid_' + question.id + '"></div>');
	qdiv.append('<div class="qtitle">' + question.title + '</div>');
	qdiv.append('<div class="count">' + question.answerCount + '</div>');
	return qdiv;
    }
};