var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap";
var detailQuery = "https://maps.googleapis.com/maps/api/place/details/json?" + "key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&placeid=" + placeId;
var opentableQuery  ="https://opentable.herokuapp.com/api/restaurants/json?&id=107257";
var placeId;
var map;
var infowindow;
var currLoc;
var geoAllowed = false;


// navigator.geolocation.getCurrentPosition(function(position) {
//   do_something(position.coords.latitude, position.coords.longitude);
// });

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
        console("in error:" + errorObj);
      }
 }

getGeo();


function initMap() {


     
    // var westOak = {
    //     lat: 37.811360,
    //     lng: -122.282826
    // };
    // map = new google.maps.Map(document.getElementById('map'), {
    //     center: currLoc,
    //     zoom: 15
    // });
    //infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService($("#map").get(0));
    service.nearbySearch({
        location: currLoc,
        radius: 3000,
        type: ['restaurant'],
        keyword: 'sushi'
    }, callback);
}

function getDetails() {
    var service = new google.maps.places.PlacesService($("#map").get(0));
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
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            placeId = results[i].place_id;
            getDetails();
            console.log(results[i]);
        }
    }
}

function createPlaceList(place) {
    console.log(place);
    var newDiv = $("<div>");
    var newImg = $("<img>");
    newImg.attr("src", )
    newDiv.append("<h4>"+ place.name + "</h4>" + "Rating: " + place.rating + " (" + 
        place.reviews.length + 
                " reviews)<br>Price range: " + place.price_level + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + 
                                    place.url + " target='_blank'>Open in Google Maps</a>") 
    $("#map").append(newDiv);
    // var placeLoc = place.geometry.location;
    // var marker = new google.maps.Marker({
    //     map: map,
    //     placeId: place.place_id,
    //     position: place.geometry.location
    // });
    
    google.maps.event.addListener(newDiv, 'click', function() {
        infowindow.setContent(place.name);
        // getGeo();
        console.log(place.place_id);
        console.log(place.name);
        placeId = place.place_id;
        getDetails();
        infowindow.open(map, this);
    });

}
// function getReservation(){
//     $.ajax({
//         url: opentableQuery,
//         method: "GET"
//     }).done(function(response){
//         response = JSON.parse(response);
//         console.log("in getReservation");
//         console.log(response);
//     }); 

// getReservation();