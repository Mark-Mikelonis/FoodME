var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap";
var detailQuery = "https://maps.googleapis.com/maps/api/place/details/json?" + "key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&placeid=" + placeId;
var opentableQuery  ="https://opentable.herokuapp.com/api/restaurants/json?&id=107257";
var placeId;

var searchTerm;
var currLoc;
var geoAllowed = false;


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
            // console.log("in getDetails");
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

function createPlaceList(place) {
    // console.log(place);
    var priceLevel = "$";
    var dollarSigns = "Unknown";
    if (place.price_level){
        dollarSigns = priceLevel.repeat(place.price_level);
    } 
    
    var newDiv = $("<div>");
    var newImg = $("<img>");
    newImg.attr("src", )
    newDiv.append("<h4>"+ place.name + "</h4>" + "Rating: " + place.rating + " (" + 
        place.reviews.length + 
                " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + 
                                    place.url + " target='_blank'>Open in Google Places</a><hr>") 
    $("#table-body").append(newDiv);
   

}

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
    $("#header-one").text("NOTE: These results are not formatted yet")
    
});

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