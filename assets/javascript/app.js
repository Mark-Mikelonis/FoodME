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

var recipeApiKey = "ea22f20d6e490ba43d99d8705330edc7";
var eatStreetApiKey = "67804766f0ca2e3a";
 
$("#makeit-img").on("click", function(){
	$("#table-body").empty();
	$("#deliver-it-form").addClass("hidden-content");
	$("#make-it-form").removeClass("hidden-content");
});

$("#deliverit-img").on("click", function(){
	$("#table-body").empty();
	$("#make-it-form").addClass("hidden-content");
	$("#deliver-it-form").removeClass("hidden-content");
});

$("#make-it-submit-button").on("click", function(){

	var parsleyInstance = $("#make-it-query").parsley();

	if(parsleyInstance.isValid()){

		$("#bad-input").addClass("hidden-content");

		$("#make-it-form").addClass("hidden-content");

		$("#table-body").empty();
		
		var query = $("#make-it-query").val().trim(); 
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
			  	console.log("We did not find any results for that search");
			  }
		});
	}
	else{
		console.log("You did not enter good input");
		$("#bad-input").removeClass("hidden-content");
	}

});

$("#deliver-it-submit-button").on("click", function(){

	$("#deliver-it-form").addClass("hidden-content");

	$("#table-body").empty();

	var deliveryQuery = $("#deliver-it-query").val().trim();
	var zipCode = $("#zip-code-input").val().trim();

	var url = 'https://api.eatstreet.com/publicapi/v1/restaurant/search?method=delivery&search=' + deliveryQuery + '&street-address=' + zipCode + '&access-token=' + eatStreetApiKey;

	$.ajax({
      url: url,
      method: "GET" 
	}).done(function(response) {

		console.log(response);

		if (response.restaurants.length > 0) {
	       for(var i = 0; i < response.restaurants.length; i++){
		      	if (i >= 10){break;}
		      	else{
					var newRow = $("<tr>");
					var newDiv = $("<div>");
					//newDiv.attr("data-recipe-id", response.restaurants.recipe_id);
					newDiv.html('<div class="card"><div class="card-body"><div class="delivery-display" data-toggle="modal" data-target="#exampleModalCenter" data-identifier="' 
						+ response.restaurants[i].apiKey + '"><img src="' 
						+ response.restaurants[i].logoUrl + '"><br><p>Name:<span class="response-text">' 
				  		+ response.restaurants[i].name +'</span></p><br><br><p>URL: <span class="response-text">'
				  		+ response.restaurants[i].url+'</span></p><br></div></div></div>');
				 	newRow.append(newDiv);
				 	$("#table-body").append(newRow);

				 	sessionStorage.setItem(response.restaurants[i].apiKey, JSON.stringify(response.restaurants[i]));
				}
		    } 
		}
		else{
			console.log("We did not find any results for that search");
		}
	});
});

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

$(document).on("click", ".delivery-display", function(){

	$("#search-results").empty();

	var deliveryApiKey = $(this).attr("data-identifier");

	var restaurantObject = JSON.parse(sessionStorage.getItem(deliveryApiKey));
	console.log(restaurantObject);

	var newDiv = $("<div>");

	newDiv.html('<img src="' + restaurantObject.logoUrl + '"><br><p>Name:<span class="response-text">' 
  		+ restaurantObject.name +'</span></p><br><br><p>Street Address: <span class="response-text">'
  		+ restaurantObject.streetAddress +'</span></p><br><p>City: <span class="response-text">'
  		+ restaurantObject.city +'</span></p><br><p>State: <span class="response-text">'
  		+ restaurantObject.state +'</span></p><br><p>URL: <span class="response-text">'
  		+ restaurantObject.url +'</span></p><br></div></div></div>');

	$("#search-results").append(newDiv);

	sessionStorage.clear();

});

////Switches one display from another.
/// If the question area is displayed, hide it and make result area displayed. (And Vice-Versa).
function switchDisplays(displayed, hidden){

	$(hidden).removeClass("displayed-Content");
	$(hidden).addClass("hidden-content");
	//Displayed area becomes unhidden and displays it's content.
	$(displayed).removeClass("hidden-content");
	$(displayed).addClass("displayed-content");

}

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

