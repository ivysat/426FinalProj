root_url = "http://comp426.cs.unc.edu:3001";
instances = [];
count = 0;
$(document).ready(() => {



    let user = "parkerbl";
	let pass = "googleg";

	console.log(user);
    console.log(pass);
    
    let $dangit = $('<div class="dangit">Instances<br></div>');



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
		},
		error: () => {
			alert('error');
		}
	});

    $.ajax(root_url+'/flights?filter[departure_id]=194118',{
		type:'GET',
		xhrFields: {withCredentials: true},
		
		success: (flights) => {
            for (i = 0; i < flights.length; i++) {
                if (flights[i].departure_id != 194118) {
                    alert("wtf");
                }
            $.ajax(root_url+'/instances?filter[flight_id]='+flights[i].id,{
                type:'GET',
                xhrFields: {withCredentials: true},
                
                success: (instancesR) => {
                    for (j = 0; j < instancesR.length; j++) {
                        //if (instancesR[j].id != undefined) {
                            instances.push(instancesR[j].id);
                            $dangit.append(instancesR[j].id + ',');
                            count++;
                        //} 
                    }

                    console.log(count);
                    
                },
                error: () => {
                    alert('error');
                }
        
        
            });
        }
		},
		error: () => {
			alert('error');
		}


    });

    $.ajax(root_url+'/flights?filter[departure_id]=194168',{
		type:'GET',
		xhrFields: {withCredentials: true},
		
		success: (flights) => {
            for (i = 0; i < flights.length; i++) {
            $.ajax(root_url+'/instances?filter[flight_id]='+flights[i].id,{
                type:'GET',
                xhrFields: {withCredentials: true},
                
                success: (instancesR) => {
                    for (j = 0; j < instancesR.length; j++) {
                            if (instancesR[j].id != undefined) {
                                instances.push(instancesR[j].id);
                                $dangit.append(instancesR[j].id + ',');
                                count++;
                            } 

                    }
                    
                },
                error: () => {
                    alert('error');
                }
        
        
            });
        }
		},
		error: () => {
			alert('error');
        }


    });

    let body = $('body');
    body.append($dangit);

    console.log(count);



});

function dangit() {


    return instances;
}