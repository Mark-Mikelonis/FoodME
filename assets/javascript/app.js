
var recipeApiKey = "ea22f20d6e490ba43d99d8705330edc7";
var eatStreetApiKey = "67804766f0ca2e3a";
 
$("#makeit-img").on("click", function(){
	$("#table-body").empty();
	$("#deliver-it-form").addClass("hidden-content");
	$("#make-it-form").removeClass("hidden-content");
});

$("#deliverit-img").on("click", function(){
	$("#table-body").empty();
	$("#make-it-form").addClass("hidden-content");
	$("#deliver-it-form").removeClass("hidden-content");
});

$("#make-it-submit-button").on("click", function(){

	var parsleyInstance = $("#make-it-query").parsley();

	if(parsleyInstance.isValid()){

		$("#bad-input").addClass("hidden-content");

		$("#make-it-form").addClass("hidden-content");

		$("#table-body").empty();
		
		var query = $("#make-it-query").val().trim(); 
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
					  		responseObject.recipes[i].recipe_id + '"><img src="' + responseObject.recipes[i].image_url + '"><br><p>Title:<span class="response-text">' 
					  		+ responseObject.recipes[i].title +'</span></p><br><br><p>URL: <span class="response-text">'
					  		+ responseObject.recipes[i].source_url +'</span></p><br></div></div></div>');
					 	newRow.append(newDiv);
					 	$("#table-body").append(newRow);
					}
			    } 
			  }
			  else {
			  	console.log("We did not find any results for that search");
			  }
		});
	}
	else{
		console.log("You did not enter good input");
		$("#bad-input").removeClass("hidden-content");
	}

});

$("#deliver-it-submit-button").on("click", function(){

	$("#deliver-it-form").addClass("hidden-content");

	$("#table-body").empty();

	var deliveryQuery = $("#deliver-it-query").val().trim();
	var zipCode = $("#zip-code-input").val().trim();

	var url = 'https://api.eatstreet.com/publicapi/v1/restaurant/search?method=delivery&search=' + deliveryQuery + '&street-address=' + zipCode + '&access-token=' + eatStreetApiKey;

	$.ajax({
      url: url,
      method: "GET" 
	}).done(function(response) {

		console.log(response);

		if (response.restaurants.length > 0) {
	       for(var i = 0; i < response.restaurants.length; i++){
		      	if (i >= 10){break;}
		      	else{
					var newRow = $("<tr>");
					var newDiv = $("<div>");
					//newDiv.attr("data-recipe-id", response.restaurants.recipe_id);
					newDiv.html('<div class="card"><div class="card-body"><div class="delivery-display" data-toggle="modal" data-target="#exampleModalCenter" data-identifier="' 
						+ response.restaurants[i].apiKey + '"><img src="' 
						+ response.restaurants[i].logoUrl + '"><br><p>Name:<span class="response-text">' 
				  		+ response.restaurants[i].name +'</span></p><br><br><p>URL: <span class="response-text">'
				  		+ response.restaurants[i].url+'</span></p><br></div></div></div>');
				 	newRow.append(newDiv);
				 	$("#table-body").append(newRow);

				 	sessionStorage.setItem(response.restaurants[i].apiKey, JSON.stringify(response.restaurants[i]));
				}
		    } 
		}
		else{
			console.log("We did not find any results for that search");
		}
	});
});

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

$(document).on("click", ".delivery-display", function(){

	$("#search-results").empty();

	var deliveryApiKey = $(this).attr("data-identifier");

	var restaurantObject = JSON.parse(sessionStorage.getItem(deliveryApiKey));
	console.log(restaurantObject);

	var newDiv = $("<div>");

	newDiv.html('<img src="' + restaurantObject.logoUrl + '"><br><p>Name:<span class="response-text">' 
  		+ restaurantObject.name +'</span></p><br><br><p>Street Address: <span class="response-text">'
  		+ restaurantObject.streetAddress +'</span></p><br><p>City: <span class="response-text">'
  		+ restaurantObject.city +'</span></p><br><p>State: <span class="response-text">'
  		+ restaurantObject.state +'</span></p><br><p>URL: <span class="response-text">'
  		+ restaurantObject.url +'</span></p><br></div></div></div>');

	$("#search-results").append(newDiv);

	sessionStorage.clear();

});

////Switches one display from another.
/// If the question area is displayed, hide it and make result area displayed. (And Vice-Versa).
function switchDisplays(displayed, hidden){

	$(hidden).removeClass("displayed-Content");
	$(hidden).addClass("hidden-content");
	//Displayed area becomes unhidden and displays it's content.
	$(displayed).removeClass("hidden-content");
	$(displayed).addClass("displayed-content");

}


