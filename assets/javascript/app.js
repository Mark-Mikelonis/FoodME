
var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap"

var map;
      var infowindow;

      function initMap() {
        var westOak = {lat: 37.811360, lng:  -122.282826};

        map = new google.maps.Map(document.getElementById('map'), {
          center: westOak,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: westOak,
          radius: 1500,
          type: ['restaurant']
        }, callback);
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
          console.log(place.place_id); 
          console.log(place.name);
          infowindow.open(map, this);
          
        });
      }
