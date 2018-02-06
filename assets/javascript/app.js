var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap";
var detailQuery = "https://maps.googleapis.com/maps/api/place/details/json?" + "key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&placeid=" + placeId;
var opentableQuery  ="https://opentable.herokuapp.com/api/restaurants?name=";
var grubHubUrl = "https://www.grubhub.com/search?orderMethod=delivery&locationMode=DELIVERY&queryText=";
var grubTerm;
var placeId;
var grubSearch = false;
var searchTerm;
var currLoc;
var geoAllowed = false;


//////////Tung Tung - firebase/////////
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBqXH2dyl-dMJagS_0_FPDw7hmGhJhoibQ",
    authDomain: "foodme-51ff9.firebaseapp.com",
    databaseURL: "https://foodme-51ff9.firebaseio.com",
    projectId: "foodme-51ff9",
    storageBucket: "foodme-51ff9.appspot.com",
    messagingSenderId: "105401566238"
};

firebase.initializeApp(config);


// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var username = "";
var password = "";
var userRef = database.ref("/users");


// Capture Button Click
$("#login-btn").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  username = $("#usernameInput").val().trim();
  password = $("#defaultForm-pass").val().trim();

  // Code for handling the push
  database.ref('/users').push({
    username: username,
    password: password,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  // $('#modalLoginForm').modal('hide');
          $("#login-btn").trigger("reset");
          // $("#myform")[0].reset();

});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  // Console.loging the last user's data
  console.log(sv.username);
  console.log(sv.password);


  // Change the HTML to reflect
  $("#name-display").text(sv.name);
  $("#email-display").text(sv.email);
  $("#age-display").text(sv.age);
  $("#comment-display").text(sv.comment);

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});



//////////////////// Recipe (Food 2 Fork) API Variables and functions //////////////////////////////////

var recipeApiKey = "ea22f20d6e490ba43d99d8705330edc7";
var eatStreetApiKey = "67804766f0ca2e3a";
 
 ///When The user clicks on make it image 
 ///Clear the table. Validate their input with parsley 
 ///If the input is good. Hide the badInput div. 
 ///Empty the table 
 ///Grab the value Do Ajax call to Food 2 Fork 
 ///Make Row put Div in Row add info to div append to table 
$("#makeit-img").on("click", function(){

	var parsleyInstance = $("#searchTerm").parsley();

	if(parsleyInstance.isValid()){

		$("#bad-input").addClass("hidden-content");

		$("#table-body").empty();
		
		var query = $("#searchTerm").val().trim(); 
		var searchUrl = "http://food2fork.com/api/search?key=" + recipeApiKey + "&q=" + query;

		$.ajax({
	      url: "https://cors-anywhere.herokuapp.com/" + searchUrl,
	      method: "GET", 
	    }).done(function(response) {
	      
		      var responseObject = JSON.parse(response);

		      if (responseObject.recipes.length > 0) {

			    for(var i = 0; i < responseObject.recipes.length; i++){
			      	if (i >= 10){break;}
			      	else{
						var newRow = $("<tr>");
						var newDiv = $("<div>");
						//newDiv.attr("data-recipe-id", responseObject.recipes[i].recipe_id);
						newDiv.html('<div class="card"><div class="card-body"><div class="recipe-display" data-toggle="modal" data-target="#exampleModalCenter" data-recipe-id="' + 
					  		responseObject.recipes[i].recipe_id + '"><img src="' + responseObject.recipes[i].image_url + '"><br><p>Title:<span class="response-text">' 
					  		+ responseObject.recipes[i].title +'</span></p><br><br><p>URL: <span class="response-text">'
					  		+ responseObject.recipes[i].source_url +'</span></p><br></div></div></div>');
					 	newRow.append(newDiv);
					 	$("#table-body").append(newRow);
					}
			    } 
			  }
			  else {
          $("#contact").modal("show");
			  	console.log("We did not find any results for that search");
			  }
		});
	}
	else{
		console.log("You did not enter good input");
		$("#bad-input").removeClass("hidden-content");
	}

});

////If a user clicks on the recipe rows It should do an ajax call on the 
////Recipe ID Then Display info in the modal. 
$(document).on("click", ".recipe-display", function(){

	$("#search-results").empty();

	var recipeId = $(this).attr("data-recipe-id");
	var getUrl = "http://food2fork.com/api/get?key=" + recipeApiKey + "&rId=" + recipeId;

	$.ajax({
      url: "https://cors-anywhere.herokuapp.com/" + getUrl,
      method: "GET", 
    }).done(function(response) {

    	var responseObject = JSON.parse(response);
		var newDiv = $("<div>");

		newDiv.html('<img src="' + responseObject.recipe.image_url + '"><br><p>Title:<span class="response-text">' 
	  		+ responseObject.recipe.title +'</span></p><br><br><p>URL: <span class="response-text">'
	  		+ responseObject.recipe.source_url +'</span></p><br></div></div></div>');

		var newList = $("<ul>");

		responseObject.recipe.ingredients.forEach(function(ingredient){
			var newItem = $("<li>");
			newItem.text(ingredient); 
			newList.append(newItem);
		});
		newDiv.append(newList);
	 	$("#search-results").append(newDiv);
	});
});

///////////////////// End of Food 2 Fork API functions ////////////////////////////////////////////


/////////////////////Google Places Functions /////////////////////////////

///Function Used to Prompt the user for their location for the app.
///Create a geolocation object, if the user presses allow, success get the current longitude and latitude.Create a Map. 
///Otherwise there the user pressed block, so an error will be returned. Display Modal to capture users address. 
function getGeo(){
 	// getting the user location 
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);//{
           
          geoAllowed = true;
      } else {
          alert('geolocation not supported');
          geoAllowed = false;
      }
      function success(position){
        console.log("in success");
      
      	currLoc = {lat:position.coords.latitude, lng: position.coords.longitude};
        // console.log(currLoc);
        initMap();
      }
      function error(errorObj){

        console.log("in error:" + errorObj);
      }
 }

//// Create the map with the current location and look for restaurants. 
function initMap() {
    var service = new google.maps.places.PlacesService($("#table-body").get(0));
    service.nearbySearch({
        location: currLoc,
        radius: 3000,
        type: ['restaurant'],
        keyword: searchTerm
    }, callback);
}

///Get the details for each place. 
function getDetails() {
    var service = new google.maps.places.PlacesService($("#table-body").get(0));
    service.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("in getDetails");
            // console.log(place);
            createPlaceList(place);
        }
    });
}


///Callback function called by initMap()
///Get the place ID for each of the places. Then call get Details. 

 function getGeo(){
 	<!-- getting the user location -->
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);//{
           
          geoAllowed = true;
      } else {
          alert('geolocation not supported');
          geoAllowed = false;
      }
      function success(position){
        console.log("in success");
      
      	currLoc = {lat:position.coords.latitude, lng: position.coords.longitude};
        // console.log(currLoc);
        initMap();
      }
      function error(errorObj){

        console.log("in error:" + errorObj);
      }
 }




function initMap() {


    var service = new google.maps.places.PlacesService($("#table-body").get(0));
    service.nearbySearch({
        location: currLoc,
        radius: 3000,
        type: ['restaurant'],
        keyword: searchTerm
    }, callback);
}

function getDetails() {
    var service = new google.maps.places.PlacesService($("#table-body").get(0));
    service.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("in getDetails");
            // console.log(place);
            createPlaceList(place);
        }
    });
}


function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            placeId = results[i].place_id;
            getDetails();
            // console.log(results[i]);
        }
    }
}


////Parse the necessary information from places. 
///Get the place name see if you can get a reservation. 
///Also check for results from grubhub. 
///Dynamically put the correct information into a row. 
///Add a reservation link if one is avialable. 
///Place a link for GrubHub if delivery option was chosen.
///Either way add a link to google places. 
function createPlaceList(place) {
    // console.log(place);
    var priceLevel = "$";
    var dollarSigns = "Unknown";
    if (place.price_level){
        dollarSigns = priceLevel.repeat(place.price_level);

    
    var isGrub = grubSearch;
    var restName = place.name.replace(/ /g, "+");

    
    var restName = place.name;

    var reserveUrl = getReservation(restName);
    console.log("reserveUrl: " + reserveUrl);
    var newDiv = $("<div>");
    var newImg = $("<img>");
    if(isGrub && !reserveUrl){
        var url = grubHubUrl + restName + "&latitude=" + currLoc.lat + "&longitude=" + currLoc.lng;
        console.log(url);

        newDiv.append("<h4>"+ place.name + "</h4>" + "Rating: " + place.rating + " (" + 
        place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + 
                "<br><a href="+url+" target='_blank'>Deliver through Grubhub</a><hr>"); 
    }
    var isGrub = grubSearch;
    var restName = place.name.replace(/ /g, "+");
    var reserveUrl = getReservation(restName);
    console.log("reserveUrl: " + reserveUrl);
    var newDiv = $("<div>");
    var newImg = $("<img>");
    if(isGrub && !reserveUrl){
        var url = grubHubUrl + restName + "&latitude=" + currLoc.lat + "&longitude=" + currLoc.lng;
        console.log(url);


        var newImg = $("<img>");
        newImg.attr("src", "assets/images/grubHubLogo.jpg");
        newImg.css("width", "150px");
        newDiv.addClass("delivery-display");
        newDiv.append(newImg);
        newDiv.append("<h4>"+ place.name +"</h4><a href="+url+" target='_blank'>Deliver through Grubhub</a><hr>"); 
        isGrub = false;

        // newImg.css("height", "150px");
        newDiv.append(newImg);
        newDiv.append("<h4>"+ place.name +"</h4><a href="+url+" target='_blank'>Deliver through Grubhub</a><hr>"); 
        isGrub = false;


    } else if (reserveUrl){
        console.log("in reserveUrl");
        newDiv.append("<h4>"+ place.name + "</h4>" + "Rating: " + place.rating + " (" + 
        place.reviews.length + 
                " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + 
                                    place.url + " target='_blank'>Open in Google Places</a><br><a href="+reserveUrl+">Reserve a Table</a><hr>"); 
    } else {
        console.log("in no reserveUrl");
        newDiv.append("<h4>"+ place.name + "</h4>" + "Rating: " + place.rating + " (" + 
        place.reviews.length + 
                " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + 
                                    place.url + " target='_blank'>Open in Google Places</a><hr>"); 
    }    

    $("#table-body").append(newDiv);
   

}
///////////////////////////////////End Google Places Functions ///////////////////////////////////////

///////////////////////////////////Used For mouseover, mouseout Functions that change image buttons colors//////////////////////////////////// 
$("#makeit-img").mouseover( function(){
   $(this).attr("src", "assets/images/make2.png");
});
$("#makeit-img").mouseout( function(){
   $(this).attr("src", "assets/images/make.png");
});

$("#findit-img").mouseover( function(){
   $(this).attr("src", "assets/images/find2.png");
});
$("#findit-img").mouseout( function(){
   $(this).attr("src", "assets/images/find.png");
});

$("#deliverit-img").mouseover( function(){
   $(this).attr("src", "assets/images/deliver2.png");
});
$("#deliverit-img").mouseout( function(){
   $(this).attr("src", "assets/images/deliver.png");
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///If A user clicks find it get the value. 
///Get their location. 
$("#findit-img").on("click", function(){
    searchTerm = $("#searchTerm").val().trim();
    $("#searchTerm").val("");
    if (!currLoc){
        getGeo();
    }
    console.log(searchTerm);
    
    setTimeout(function() {
         initMap();
    }, 3000);
});  

///If A user clicks deliver it get the value. 
///Set the grubSearch value to true to make a grubhub url.
///Get their location. 
$("#deliverit-img").on("click", function(){

    $("#table-body").empty();
    grubTerm = $("#searchTerm").val().trim();
    $("#searchTerm").val("");
    grubSearch = true;
    isGrub = grubSearch;
    console.log("in deliverit-img on click");
    if (!currLoc){
        getGeo();
    }
    console.log(grubTerm);
    // grubHubUrl += grubTerm;
    setTimeout(function() {
         initMap();
    }, 3000);
});    
    $("#header-one").text("NOTE: These results are not formatted yet")
    

///Uses open table API to see if reservation is available. 
///If no restaurant is returned Don't create a link. 
/// Otherwise save the reserveUrl, and return true; 
function getReservation(name){

    $.ajax({
        url: opentableQuery + name,
        method: "GET"
    }).done(function(response){
        console.log("in getReservation");

        var responseObj = response;

        if (responseObj.restaurants.length === 0){
            return false;
        } else {
            reserevUrl = responseObj.restaurants[0].reserve_url;
            console.log(responseObj.restaurants[0].reserve_url);
            return true;

        }
        
    }); 
}


