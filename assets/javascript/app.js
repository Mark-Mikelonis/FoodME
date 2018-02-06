var restQuery = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&callback=initMap";
var detailQuery = "https://maps.googleapis.com/maps/api/place/details/json?" + "key=AIzaSyAC1wTUBSAAKhd2TdMwN0HEQ-Ni7T9fSy4&libraries=places&placeid=" + placeId;
var opentableQuery = "https://opentable.herokuapp.com/api/restaurants?name=";
var grubHubUrl = "https://www.grubhub.com/search?orderMethod=delivery&locationMode=DELIVERY&queryText=";
var grubTerm;
var placeId;
var grubSearch = false;
var searchTerm;
var currLoc;
var geoAllowed = false;

function getGeo() {
    <!-- getting the user location -->
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error); //{
        geoAllowed = true;
    } else {
        alert('geolocation not supported');
        geoAllowed = false;
    }

    function success(position) {
        console.log("in success");
        currLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // console.log(currLoc);
        initMap();
    }

    function error(errorObj) {
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

function getDetails() { // look into the service
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
        // 
    }
}

function createPlaceList(place) {
    // console.log(place);
    var priceLevel = "$";
    var dollarSigns = "Unknown";
    if (place.price_level) {
        dollarSigns = priceLevel.repeat(place.price_level);
    }
    var isGrub = grubSearch;
    console.log("isGrub: " + isGrub);
    var restName = place.name.replace(/ /g, "+");
    var reserveUrl = getReservation(restName);
    console.log("reserveUrl: " + reserveUrl);
    var newDiv = $("<div>");
    var newImg = $("<img>");
    if (!isGrub && reserveUrl != "") {
        console.log("in reserveUrl");
        newDiv.append("<h4>" + place.name + "</h4>" + "Rating: " + place.rating + " (" + place.reviews.length + " reviews)<br>Price range: " + dollarSigns + "<br>" + place.adr_address + "<br> Phone: " + place.formatted_phone_number + "<br><a href=" + place.url + " target='_blank'>Open in Google Places</a><br><a href=" + reserveUrl + ">Reserve a Table</a><hr>");
    } else if (isGrub) {
        console.log("in isGrub");
        var url = grubHubUrl + restName + "&latitude=" + currLoc.lat + "&longitude=" + currLoc.lng;
        console.log(url);
        var newImg = $("<img>");
        newImg.attr("src", "assets/images/grubHubLogo.jpg");
        newImg.css("width", "150px");
        // newImg.css("height", "150px");
        newDiv.append(newImg);
        newDiv.append("<h4>" + place.name + "</h4><a href=" + url + " target='_blank'>Deliver through Grubhub</a><hr>");
        isGrub = false;
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
    $("#table-body").empty();
    searchTerm = $("#searchTerm").val().trim();
    $("#searchTerm").val("");
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
    $("#searchTerm").val("");
    grubSearch = true;
    isGrub = grubSearch;
    console.log("in deliverit-img on click");
    if (!currLoc) {
        getGeo();
    }
    console.log(grubTerm);
    // grubHubUrl += grubTerm;
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
        } else {
           return "";
        }
    });
}
