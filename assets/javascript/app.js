var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap";
var detailQuery = "https://maps.googleapis.com/maps/api/place/details/json?" + "key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&placeid=" + placeId;
var opentableQuery = "https://opentable.herokuapp.com/api/restaurants?name=";
var grubHubUrl = "https://www.grubhub.com/search?orderMethod=delivery&locationMode=DELIVERY&queryText=";
var grubTerm;
var placeId;
var isGrub;
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

// Auth users
//     firebase.auth().signInWithCustomToken(token).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

// // Sign out
// firebase.auth().signOut().then(function() {
//   // Sign-out successful.
// }).catch(function(error) {
//   // An error happened.
// });



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
                            responseObject.recipes[i].recipe_id + '"><img src="' + responseObject.recipes[i].image_url + '"><br><h3>' 
                            + responseObject.recipes[i].title +'</h3><p>Recipe Brought To You By: <span class="response-text">'
                            + responseObject.recipes[i].publisher +'</span></p><br></div></div></div>');
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






///////////////////// Mark's js Google API//////////////////

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
        $("#modalAddressForm").modal("show");
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
            console.log(place);
            createPlaceList(place);
        }
    });
}

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
        currLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // console.log(if(currLoc){
            initMap();
      
    }

    function error(errorObj) {
        console.log("in error:" + errorObj);
        $("#modalAddressForm").modal("show");
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

function getDetails(placeId) { // look into the service
    // debugger;
    var service = new google.maps.places.PlacesService($("#table-body").get(0));
    service.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("in getDetails");
            // console.log(place);
            console.log("isgrub: " + isGrub);
            createPlaceList(place);
        }
    });
}

function callback(results, status) {
    var places = [];
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        
        for (var i = 0; i < results.length; i++) {
            console.log("isgrub: " + isGrub);
            places.push(results[i].place_id);
            
        }
              
    }
    
    for (var i=0;i<places.length;i++){
            getDetails(places[i]);
    }

}
function createPlaceList(place) {
    // console.log(place);
    var priceLevel = "$";
    var dollarSigns = "Unknown";
    if (place.price_level) {
        dollarSigns = priceLevel.repeat(place.price_level);

    } 
    var restName = place.name;
    var reserveUrl = getReservation(restName);
    console.log(reserveUrl);
    var newDiv = $("<div>");
    var newImg = $("<img>");
    if(grubSearch && !reserveUrl){
        var url = grubHubUrl + restName.replace(/ /g, "+") + "&latitude=" + currLoc.lat + "&longitude=" + currLoc.lng;
        console.log(url);
        newDiv.append("<h4>"+ place.name + "</h4>" + "Rating: " + place.rating + " (" + 
        place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + 
                "<br><a href="+url+" target='_blank'>Deliver through Grubhub</a><hr>"); 
    }
    
    console.log("isGrub: " + isGrub);
    var restName = place.name.replace(/ /g, "+");
    // var reserveUrl = getReservation(restName);
    
    var newDiv = $("<div>");
    var newImg = $("<img>");
    if (!isGrub) {
        var reserveUrl = getReservation(restName);
        
        console.log("reserveUrl: " + reserveUrl);
        if (reserveUrl){
            console.log("in reserveUrl");
            newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + place.url + " target='_blank'>Open in Google Places</a><br><a href=" + reserveUrl + ">Reserve a Table</a><hr>");
        } else {
             console.log("in reserveUrl");
             newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + place.url + " target='_bla nk'>Open in Google Places</a><hr>");
   
        }
    } else if (isGrub) {
        console.log("in isGrub");
        var url = grubHubUrl + grubTerm + restName + "&latitude=" + currLoc.lat + "&longitude=" + currLoc.lng;
        console.log(url);
        var newImg = $("<img>");
        newImg.attr("src", "assets/images/deliveryicon.png");
        newImg.css("width", "100px");
       
        newDiv.append(newImg);

        newDiv.append("<h4>" + place.name + "</h4><a href=" + url + " target='_blank'>Deliver through Grubhub</a><hr>");
        


    } else if (reserveUrl){
        console.log("in reserveUrl");
        newDiv.append("<h4>"+ place.name + "</h4>" + "Rating: " + place.rating + " (" + 
        place.reviews.length + 
                " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + 
                                    place.url + " target='_blank'>Open in Google Places</a><br><a href="+reserveUrl+">Reserve a Table</a><hr>"); 

    } else {
        console.log("in no reserveUrl");
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
$("#findit-img").on("click", function() {
    isGrub = false;
    $("#table-body").empty();
    searchTerm = $("#searchTerm").val().trim();
    // $("#searchTerm").val("");
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
    // $("#searchTerm").val("");
    
    isGrub = true;
    // debugger;
    console.log("in deliverit-img on click");
    console.log("isgrub: " + isGrub);
    if (!currLoc) {
        getGeo();
    }
    console.log(grubTerm);
    
    setTimeout(function() {
        initMap();
    }, 3000);
});
$("#header-one").text("NOTE: These results are not formatted yet")


function getReservation(name) {

    $.ajax({
        url: opentableQuery + name,
        method: "GET"
    }).done(function(response) {
        // response = JSON.parse(response);
        console.log("in getReservation");

        if (response.restaurants.length !== 0) {
            console.log("in length !== 0")
            console.log(response);
           
            // return false;
            var url = response.restaurants[0].reserve_url;
            return url;
            console.log(response.restaurants[0].reserve_url);
        } 

    });
}





