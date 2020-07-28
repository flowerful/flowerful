const plantApp = {};

plantApp.getPlants = (color) => {
  // the information we provide to the function is a query so we name the parameter as such to make our code more human-legible
  $.ajax({
    url: `https://trefle.io/api/v1/species?filter%5Bflower_color%5D=${color}&token=IqewWccMHBa3cnlYw2-TrtPrsxLhFmDY10kpsztBXk4`,
    // query contains the user data from selected; will change the url to point to the specified season through the power of template literal
    method: "GET",
    dataType: "json",
  }).then(function (apiResults) {
    // "when yr done with the data cann you call this function for me please javascript thank you javascript"
    plantApp.displayPlants(apiResults);
    // queenApp.queens = apiResults;
    // queenApp.displayQueens();
  });
};

plantApp.init = () => {};

$(function () {
  plantApp.init();
});
