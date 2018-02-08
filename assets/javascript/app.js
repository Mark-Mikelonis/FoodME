var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap";
var detailQuery = "https://maps.googleapis.com/maps/api/place/details/json?" + "key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&placeid=" + placeId;
var opentableQuery = "https://opentable.herokuapp.com/api/restaurants?name=";
var grubHubUrl = "https://www.grubhub.com/search?orderMethod=delivery&locationMode=DELIVERY&queryText=";
var grubTerm;
var placeId;
var isGrub = false;
var searchTerm;
var currLoc;
var geoAllowed = false;
var reserveUrl;
var placeSearch, autocomplete;

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

var validUser = false; 

firebase.initializeApp(config);


// Create a variable to reference the database.
var database = firebase.database();


// Initial Values
var username = "";
var password = "";

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    
    // Change the HTML to reflect
    $("#name-display").text(sv.name);
    $("#email-display").text(sv.email);
    $("#age-display").text(sv.age);
    $("#comment-display").text(sv.comment);
    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// Hide the location search bar first
$("#locationField").hide();
$("#address").hide();



// Capture Button Click For Signing Up
$("#sign-up-btn").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  username = $("#username-signup-input").val().trim();
  password = $("#pass-signup-input").val().trim();

  $("#username-signup-input").val("");
  $("#pass-signup-input").val("");

  // Code for handling the push
  database.ref('/users').push({
    username: username,
    password: password,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});


// Capture Button Click for Logging In 
$("#login-btn").on("click", function(event) {
  event.preventDefault();

 
  validUser = false; 
  var user = "";
  var pass = "";

  // Grabbed values from text boxes
  userNameInput = $("#username-login-input").val().trim();
  passWordInput = $("#pass-login-input").val().trim();

  $("#login").text("Logout");
  $("#username-login-input").val("");
  $("#pass-login-input").val("");

  console.log("The userName input is "+ userNameInput);
  userRef.orderByChild("username").equalTo(userNameInput).on("child_added", function(snapshot) {
    console.log("The username was in the database");
    user = snapshot.val().username; 
    pass = snapshot.val().password; 

    if (passWordInput == pass){
      validUser = true; 
      console.log("Valid User");
    }else{
      console.log("Invalid User");
    }

  });

});


//////////////Pedram//////////
//////////////////// Recipe (Food 2 Fork) API Variables and functions //////////////////////////////////
var recipeApiKey = "ea22f20d6e490ba43d99d8705330edc7";
var eatStreetApiKey = "67804766f0ca2e3a";
///When The user clicks on make it image 
///Clear the table. Validate their input with parsley 
///If the input is good. Hide the badInput div. 
///Empty the table 
///Grab the value Do Ajax call to Food 2 Fork 
///Make Row put Div in Row add info to div append to table 
$("#makeit-img").on("click", function() {
    var parsleyInstance = $("#searchTerm").parsley();

    if (parsleyInstance.isValid()) {
        $("#search-input").addClass("hidden-content");

        $("#table-body").empty();
        var query = $("#searchTerm").val().trim();
        var searchUrl = "http://food2fork.com/api/search?key=" + recipeApiKey + "&q=" + query;
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/" + searchUrl,
            method: "GET",
        }).done(function(response) {
            var responseObject = JSON.parse(response);
            $("#display").text("Recipes");
            if (responseObject.recipes.length > 0) {
                for (var i = 0; i < responseObject.recipes.length; i++) {
                    if (i >= 10) {
                        break;
                    } else {
                        var newRow = $("<tr>");
                        var newDiv = $("<div>");
                        
                        newDiv.html('<div class="card"><div class="card-body"><div class="recipe-display" data-toggle="modal" data-target="#recipe-modal" data-recipe-id="' + responseObject.recipes[i].recipe_id + '"><img src="' + responseObject.recipes[i].image_url + '"><br><h3>' + responseObject.recipes[i].title + '</h3><p>Recipe Brought To You By: <span class="response-text">' + responseObject.recipes[i].publisher + '</span></p><br></div></div></div>');
                        newRow.append(newDiv);
                        $("#table-body").append(newRow);
                    }

                }
            } else {
                $("#contact").modal("show");

                $("#display").text("We did not find any results for that search");
            }
        });
    } else {
        console.log("You did not enter good input");
        $("#search-input").removeClass("hidden-content");
    }
});
////If a user clicks on the recipe rows It should do an ajax call on the 
////Recipe ID Then Display info in the modal. 
$(document).on("click", ".recipe-display", function() {
    $("#recipe-results").empty();
    var recipeId = $(this).attr("data-recipe-id");
    var getUrl = "http://food2fork.com/api/get?key=" + recipeApiKey + "&rId=" + recipeId;
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/" + getUrl,
        method: "GET",
    }).done(function(response) {
        var responseObject = JSON.parse(response);
        var newDiv = $("<div>");
        $("#recipe-modal-title").text(responseObject.recipe.title);
        newDiv.html('<img src="' + responseObject.recipe.image_url + '"><hr class="red-rule"/><br><h3>' + responseObject.recipe.title + '</h3><br><p>Recipe Brought To You By: <span class="response-text">' + responseObject.recipe.publisher + '</span></p><h5>Ingredients:</h5>');
        var newList = $("<ul>");
        responseObject.recipe.ingredients.forEach(function(ingredient) {
            var newItem = $("<li>");
            newItem.text(ingredient);
            newList.append(newItem);
        });
        newDiv.append(newList);

        newDiv.append('<p>See Whole Recipe at: <span class="response-text"><a href="' 
          + responseObject.recipe.source_url + '" target="_blank">' 
          + responseObject.recipe.source_url +'</a></span></p>')
        $("#recipe-results").append(newDiv);
    });
});


$("#save-recipe-button").on("click", function(){
  console.log("Save button was pressed");
  //console.log(database.ref().child("users").val);
  userRef.orderByChild("username").equalTo("Shrimp").on("child_added", function(snapshot) {
    console.log();
    console.log("The user name is ", snapshot.val().username); // here's your data object
  });
  
});

///////////////////// Mark's js Google API//////////////////

//////// Google autofill ////////////


/// Callback function that calls Google maps and places services
function initialize() {
    initAutocomplete();
    initMap();
}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['address']
        });
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var autoplace = autocomplete.getPlace();
    getGeoByAddress(autoplace.formatted_address);
  
}
// Pull the user's lat, long by address
 
function getGeoByAddress(address) {
    var geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({'address' :address}, function(results, status){
        if (status === google.maps.GeocoderStatus.OK){
            
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            currLoc = {
            lat: latitude,
            lng: longitude
            };
            initMap();
        }
        
    });
}


// Get geolocation from browser if allowed by user otherwise trigger address field
function getGeo() {
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } 

    function success(position) {
        geoAllowed = true;
        console.log("in success");
        currLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        initMap();
    }

    function error(errorObj) {
        
        $("#locationField").show();
        geoAllowed = false;
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

function callback(results, status) {
    if (results.length === 0) {
        $("#display").text("No results. Please try another search term.");
    }
    var places = [];
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            places.push(results[i].place_id);
        }
    }
    for (var i = 0; i < places.length; i++) {
        getDetails(places[i]);
    }
}

function getDetails(placeId) {
    var service = new google.maps.places.PlacesService($("#table-body").get(0));
    service.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
           createPlaceList(place);
        }
    });
}

function createPlaceList(place) {
    var priceLevel = "$";
    var dollarSigns = "Unknown";
    if (place.price_level) {
        dollarSigns = priceLevel.repeat(place.price_level);
    }
    var restName = place.name.replace(/ /g, "+");
    var restCity = place.address_components[3].long_name.replace(/ /g, "+");
    var newDiv = $("<div>");
    var newImg = $("<img>");

    if (!isGrub) {
        getReservation(restName, restCity);
        $("#display").text("Restaurants");
        
        if (reserveUrl) {
            
            newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + 
                " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + 
                place.formatted_phone_number + "<br><a href=" + place.url + 
                " target='_blank'>Open in Google Places</a><br><a href=" + reserveUrl + ">Reserve a Table</a><hr>");
            reserveUrl = '';
        } else {
           
            newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + 
                " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + 
                place.formatted_phone_number + "<br><a href=" + place.url + " target='_blank'>Open in Google Places</a><hr>");
        }
    } else if (isGrub) {
        $("#display").text("Restaurants that deliver to you");
        var url = grubHubUrl + restName + "&latitude=" + currLoc.lat + "&longitude=" + currLoc.lng;
        var newImg = $("<img>");
        newImg.attr("src", "assets/images/deliveryicon.png");
        newImg.css("width", "100px");
        newDiv.append(newImg);
        newDiv.append("<h4>" + place.name + "</h4><a href=" + url + " target='_blank'>Deliver through Grubhub</a><hr>");
    } else {
        
        $("#display").text("Restaurants");
        newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + place.url + " target='_blank'>Open in Google Places</a><hr>");
    }
    $("#table-body").append(newDiv);
}
$("#makeit-img").mouseover(function() {
    $(this).attr("src", "assets/images/make2.png");
});
$("#makeit-img").mouseout(function() {
    $(this).attr("src", "assets/images/make.png");
});
$("#findit-img").mouseover(function() {
    $(this).attr("src", "assets/images/find2.png");
});
$("#findit-img").mouseout(function() {
    $(this).attr("src", "assets/images/find.png");
});
$("#deliverit-img").mouseover(function() {
    $(this).attr("src", "assets/images/deliver2.png");
});
$("#deliverit-img").mouseout(function() {
    $(this).attr("src", "assets/images/deliver.png");
});
/// Override mouseover for touch devices
$("#makeit-img").on("click", function() {
    $(this).attr("src", "assets/images/make.png");
});
$("#findit-img").on("click", function() {
    $(this).attr("src", "assets/images/find.png");
});
$("#deliverit-img").on("click", function() {
    $(this).attr("src", "assets/images/find.png");
});
$("#gobutton").on("click", function() {
    $("#locationField").val("");
    $("#locationField").hide();
   
});
$("#findit-img").on("click", function() {
    var parsleyInstance = $("#searchTerm").parsley();
    isGrub = false;
    if (parsleyInstance.isValid()) {
        $("#search-input").addClass("hidden-content");
        
        $("#table-body").empty();
        searchTerm = $("#searchTerm").val().trim();
        if (!currLoc) {
            getGeo();
        }
        
        setTimeout(function() {
            initMap();
        }, 3000);
     } else {
        console.log("You did not enter good input");
        $("#search-input").removeClass("hidden-content");
    }   
});
$("#deliverit-img").on("click", function() {
   var parsleyInstance = $("#searchTerm").parsley();

    if (parsleyInstance.isValid()) {
        $("#search-input").addClass("hidden-content");
        $("#table-body").empty();
        grubTerm = $("#searchTerm").val().trim();
        isGrub = true;
        if (!currLoc) {
            getGeo();
        }
        setTimeout(function() {
            initMap();
        }, 3000);
    } else {
        console.log("You did not enter good input");
        $("#search-input").removeClass("hidden-content");
    }
});

function getReservation(name, city) {
    $.ajax({
        url: opentableQuery + name + "&city=" + city,
        method: "GET"
    }).done(function(response) {
       
        if (response.restaurants.length !== 0) {
            
            reserveUrl = response.restaurants[0].mobile_reserve_url;
            
            
        } 
    });
}