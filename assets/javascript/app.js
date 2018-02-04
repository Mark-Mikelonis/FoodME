var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap";
var detailQuery = "https://maps.googleapis.com/maps/api/place/details/json?" + "key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&placeid=" + placeId;
var placeId;
var map;
var infowindow;
var currLoc;
var geoAllowed = true;
 function getGeo(){
 	<!-- getting the user location -->
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success);
          debugger;
          geoAllowed =true;
      } else {
          alert('geolocation not supported');
          geoAllowed = false;
      }
      function success(position){
      	currLoc = {lat:position.coords.latitude, lng: position.coords.longitude};

      }
 }
function initMap() {


    console.log(currLoc);  
    var westOak = {
        lat: 37.811360,
        lng: -122.282826
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: westOak,
        zoom: 15
    });
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: westOak,
        radius: 3000,
        type: ['restaurant'],
        keyword: 'thai food'
    }, callback);
}

function getDetails() {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: placeId
    }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("in getDetails");
            console.log(place);
            infowindow.setContent(infowindow.getContent() + "<br>" + "Rating: " + place.rating + "(" + place.reviews.length + 
                " reviews)<br>Price range: " + place.price_level + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + 
                                    place.url + " target='_blank'>Open in Google Maps</a>");
            infowindow.open(map, this);
        }
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    console.log(place);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        placeId: place.place_id,
        position: place.geometry.location
    });
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        // getGeo();
        console.log(place.place_id);
        console.log(place.name);
        placeId = place.place_id;
        getDetails();
        infowindow.open(map, this);
    });

}