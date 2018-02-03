// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var map;
var service;
var infoWindow;
function initMap() {
        var pyrmont = {
            lat: -33.866,
            lng: 151.196
        };
        console.log("pyrmont: " + pyrmont);
        map = new google.maps.Map(document.getElementById('map'), {
            center: pyrmont,
            zoom: 17
        });
        console.log("map: " + map);

        function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }
}
$(window).onload = function() {
    
    var request = {
    location: pyrmont,
    radius: '500',
    type: ['restaurant']
  	};
  	infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, callback);

    function callback(results, status){
    	if(status == google.maps.places.PlacesServiceStatus.OK){
    		for (var i=0;i<results.length;i++){
    			var place = results[i];
    			createMarker(results[i]);
    		}
    	}
    }


    // service.nearbySearch({
    //     location: pyrmont,
    //     radius: 500,
    //     type: ['store']
    // }, processResults);
};

// $(window).load(initMap());
// $("#map").html(map);
// function processResults(results, status, pagination) {
//   if (status !== google.maps.places.PlacesServiceStatus.OK) {
//     return;
//   } else {
//     createMarkers(results);
//     if (pagination.hasNextPage) {
//       var moreButton = document.getElementById('more');
//       moreButton.disabled = false;
//       moreButton.addEventListener('click', function() {
//         moreButton.disabled = true;
//         pagination.nextPage();
//       });
//     }
//   }
// }
// function createMarkers(places) {
//   var bounds = new google.maps.LatLngBounds();
//   var placesList = document.getElementById('places');
//   for (var i = 0, place; place = places[i]; i++) {
//     var image = {
//       url: place.icon,
//       size: new google.maps.Size(71, 71),
//       origin: new google.maps.Point(0, 0),
//       anchor: new google.maps.Point(17, 34),
//       scaledSize: new google.maps.Size(25, 25)
//     };
//     var marker = new google.maps.Marker({
//       map: map,
//       icon: image,
//       title: place.name,
//       position: place.geometry.location
//     });
//     placesList.innerHTML += '<li>' + place.name + '</li>';
//     bounds.extend(place.geometry.location);
//   }
//   map.fitBounds(bounds);
// }