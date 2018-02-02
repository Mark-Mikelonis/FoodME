
var apiKey = "ea22f20d6e490ba43d99d8705330edc7";
var url = "http://food2fork.com/api/search?key=" + apiKey + "&q=shredded%20chicken"

$.ajax({
      url: "https://cors-anywhere.herokuapp.com/" + url,
      method: "GET", 
    }).done(function(response) {
      var object = JSON.parse(response);
      console.log(object.recipes);
});

