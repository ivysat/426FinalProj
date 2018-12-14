api_base_url = "http://comp426.cs.unc.edu:3001/";







$(document).ready(() => {

    let user = "parkerbl";
    let pass =  "googleg";            // Current logged in user info




  const data = seedData['tickets'];
    
	$.ajax(api_base_url+'sessions',{
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
	})

    seed("tickets", data);


    
});

        
             
        /**
         * Retrieves the index route for one type of resource
         * @param resourceName  The plural name of the resource as a string
         * 
         * @return  Returns a promise object that resolves with the records
         */
        function index(resourceName) {
            return $.ajax({
              url: api_base_url + resourceName,
              xhrFields: { withCredentials: true }
            });
          }

                  /**
         * Makes a series of ajax requests, one at a time, to seed the database
         *   with one type of resource
         * 
         * @param resourceName  The plural name of the resource as a string
         * @param dataArray     An array of data objects representing the
         *                      records to create
         * @param callback  An optional callback to execute after each request
         *                  completes
         * @return  Returns a promise object that resolves once all requests
         *          have completed
         */
        function seed(resourceName, dataArray, callback) {
            // Start with an empty promise
            let prom = $().promise();
            // Build up a long chain of promises, one for each record request
            dataArray.forEach(function(data) {
              let wrappedData = {};
              wrappedData["ticket"] = data;
              console.log(wrappedData);
              prom = prom.then(function() {
                return $.ajax({
                  url: api_base_url + resourceName,
                  type: 'POST',
                  data: wrappedData,
                  xhrFields: { withCredentials: true },
                }).then(function(result) {
                  data.db_id = result.id;
                  if (callback) {
                    callback(data, result);
                  }
                });
              });
            });
            return prom;
          }


          function loadFile() {
            var input, file, fr;
        

              file = 'tickets.json';
              fr = new FileReader();
              fr.onload = receivedText;
              fr.readAsText(file);

        
            function receivedText(e) {
              let lines = e.target.result;
              return JSON.parse(lines); 
            }
          }
  