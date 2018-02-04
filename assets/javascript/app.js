
var apiKey = "ea22f20d6e490ba43d99d8705330edc7";

$("#makeit-img").on("click", function(){

	$("#table-body").empty();
	
	var query = $("#searchTerm").val(); 
	var searchUrl = "http://food2fork.com/api/search?key=" + apiKey + "&q=" + query;

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
				newDiv.attr("data-recipe-id", responseObject.recipes[i].recipe_id);
				newDiv.html('<div class="card"><div class="card-body"><div class="search-display" data-toggle="modal" data-target="#exampleModalCenter" data-recipe-id="' + 
			  		responseObject.recipes[i].recipe_id + '"><img src="' + responseObject.recipes[i].image_url + '"><br><p>Title:<span class="response-text">' 
			  		+ responseObject.recipes[i].title +'</span></p><br><br><p>URL: <span class="response-text">'
			  		+ responseObject.recipes[i].source_url +'</span></p><br></div></div></div>');
			 	newRow.append(newDiv);
			 	$("#table-body").append(newRow);
			}
	    } 
	  }
	  else {
	  	$("#search-results").text("We did not find any results for that search");
	  }
});

$(document).on("click", ".search-display", function(){

	var recipeId = $(this).attr("data-recipe-id");
	var getUrl = "http://food2fork.com/api/get?key=" + apiKey + "&rId=" + recipeId;

	$.ajax({
      url: "https://cors-anywhere.herokuapp.com/" + getUrl,
      method: "GET", 
    }).done(function(response) {

    	var responseObject = JSON.parse(response);
    	console.log(responseObject);

		var newDiv = $("<div>");

		newDiv.html('<img src="' + responseObject.recipe.image_url + '"><br><p>Title:<span class="response-text">' 
	  		+ responseObject.recipe.title +'</span></p><br><br><p>URL: <span class="response-text">'
	  		+ responseObject.recipe.source_url +'</span></p><br></div></div></div>');

	 	$("#search-results").append(newDiv);
	});

});
});
