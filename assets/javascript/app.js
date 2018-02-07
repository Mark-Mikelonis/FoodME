
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
    // var recipeRef = database.ref("/users/recipes");
    var validUser = false; 


///Golbal

var validUserName = "";
var validPW = "";


    // Capture Button Click
    $("#sign-up-btn").on("click", function(event) {
      event.preventDefault();
      // $("#login").text("Logout");
      // Grabbed values from text boxes
      username = $("#username-signup-input").val().trim();
      password = $("#pass-signup-input").val().trim();

      $("#usernameInput").val("");
      $("#defaultForm-pass").val("");


      // Code for handling the push
      database.ref('/users').push({
        username: username,
        password: password,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
        // $("#login-btn").trigger("reset");
   
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

  console.log("The userName input is "+ userNameInput);
  userRef.orderByChild("username").equalTo(userNameInput).on("child_added", function(snapshot) {
    console.log("The username was in the database");
    user = snapshot.val().username; 
    pass = snapshot.val().password; 

    if (passWordInput == pass){
      validUser = true; 
      validUserName = user;
      validPW = pass;
      console.log("Valid User");
    }else{
      console.log("Invalid User");
    }



  });

});



// $("#save-recipe-button").on("click", function(){
//   console.log("Save button was pressed");


//   //console.log(database.ref().child("users").val);
//   userRef.orderByChild("username").equalTo("Shrimp").on("child_added", function(snapshot) {
//     console.log();
//     console.log("The user name is ", snapshot.val().username); // here's your data object
  


//   });


  //orderByChild('username').equalTo(username);;
// });


    // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
    // database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
      // storing the snapshot.val() in a variable for convenience
      // var sv = snapshot.val();

      // Console.loging the last user's data
      // console.log(sv.username);
      // console.log(sv.password);

      // Handle the errors
    // }, function(errorObject) {
    //   console.log("Errors handled: " + errorObject.code);
    // });



    // Hide the location search bar first
      $("#locationField").hide();


//////// Google autofill ////////////
var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initialize() {
    initAutocomplete();
    initMap();
}


$("#address").hide();
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
    for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }
    // Get each component of the address from the autoplace details place
    // and fill the corresponding field on the form.
    for (var i = 0; i < autoplace.address_components.length; i++) {
        var addressType = autoplace.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = autoplace.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}








function getLatLng(){
    
}
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
                for (var i = 0; i < responseObject.recipes.length; i++) {
                    if (i >= 10) {
                        break;
                    } else {
                        var newRow = $("<tr>");
                        var newDiv = $("<div>");
                        //newDiv.attr("data-recipe-id", responseObject.recipes[i].recipe_id);
                        newDiv.html('<div class="card"><div class="card-body"><div class="recipe-display" data-toggle="modal" data-target="#recipe-modal" data-recipe-id="' + responseObject.recipes[i].recipe_id + '"><img src="' + responseObject.recipes[i].image_url + '"><br><h3>' + responseObject.recipes[i].title + '</h3><p>Recipe Brought To You By: <span class="response-text">' + responseObject.recipes[i].publisher + '</span></p><br></div></div></div>');
                        newRow.append(newDiv);
                        $("#table-body").append(newRow);
                    }

                }
            } else {
                $("#contact").modal("show");
b
                console.log("We did not find any results for that search");
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
      newDiv.attr("data-recipe-id", responseObject.recipe.recipe_id);
      newDiv.attr("class", "getRecipeId");

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
  console.log($(".getRecipeId").attr("data-recipe-id"));
  userRef.orderByChild("username").equalTo("Shrimp").on("child_added", function(snapshot) {
    console.log();
    console.log("The user name is ", snapshot.val().username); // here's your data object
  });
  //orderByChild('username').equalTo(username);;
});

///////////////////// Mark's js Google API//////////////////


function getGeo() {
    <!-- getting the user location -->
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('geolocation not supported');
        // geoAllowed = false;
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
        console.log("in error:" + errorObj);
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

function getDetails(placeId) {
    var service = new google.maps.places.PlacesService($("#table-body").get(0));
    service.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("in getDetails");
            createPlaceList(place);
        }
    });
}

function callback(results, status) {
    if (results.length === 0) {
        $("#header-one").text("No results. Please try another search term.");
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

function createPlaceList(place) {
    var priceLevel = "$";
    var dollarSigns = "Unknown";
    if (place.price_level) {
        dollarSigns = priceLevel.repeat(place.price_level);
    }
    var restName = place.name.replace(/ /g, "+");
    var newDiv = $("<div>");
    var newImg = $("<img>");
    if (!isGrub) {
        var reserveUrl = getReservation(restName);
        $("#header-one").text(searchTerm + " Restaurants");
        console.log("reserveUrl: " + reserveUrl);
        if (reserveUrl) {
            console.log("in reserveUrl");
            newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + place.url + " target='_blank'>Open in Google Places</a><br><a href=" + reserveUrl + ">Reserve a Table</a><hr>");
        } else {
            console.log("in reserveUrl");
            newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + place.url + " target='_bla nk'>Open in Google Places</a><hr>");
        }
    } else if (isGrub) {
        $("#header-one").text(searchTerm + " Restaurants that deliver to you");
        var url = grubHubUrl + restName + "&latitude=" + currLoc.lat + "&longitude=" + currLoc.lng;
        var newImg = $("<img>");
        newImg.attr("src", "assets/images/deliveryicon.png");
        newImg.css("width", "100px");
        newDiv.append(newImg);
        newDiv.append("<h4>" + place.name + "</h4><a href=" + url + " target='_blank'>Deliver through Grubhub</a><hr>");
    } else {
        console.log("in no reserveUrl");
        $("#header-one").text(searchTerm + " Restaurants");
        console.log(place);
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
    if (isgrub) {
        $("#table-body").empty();
        searchTerm = $("#searchTerm").val().trim();
        if (!currLoc) {
            getGeo();
        }
        console.log(searchTerm);
        setTimeout(function() {
            initMap();
        }, 3000);
    } else if (!isgrub){
        $("#table-body").empty();
    grubTerm = $("#searchTerm").val().trim();
    isGrub = true;
    if (!currLoc) {
        getGeo();
    }
    setTimeout(function() {
        initMap();
    }, 3000);
    }
});
$("#findit-img").on("click", function() {
    isGrub = false;
    $("#table-body").empty();
    searchTerm = $("#searchTerm").val().trim();
    if (!currLoc) {
        getGeo();
    }
    console.log(searchTerm);
    setTimeout(function() {
        initMap();
    }, 3000);
});
$("#deliverit-img").on("click", function() {
    $("#table-body").empty();
    grubTerm = $("#searchTerm").val().trim();
    isGrub = true;
    if (!currLoc) {
        getGeo();
    }
    setTimeout(function() {
        initMap();
    }, 3000);
});

function getReservation(name) {
    $.ajax({
        url: opentableQuery + name,
        method: "GET"
    }).done(function(response) {
        console.log("in getReservation");
        if (response.restaurants.length !== 0) {
            console.log("in length !== 0")
            console.log(response);
            var url = response.restaurants[0].reserve_url;
            return url;
            console.log(response.restaurants[0].reserve_url);
        }
    });
}