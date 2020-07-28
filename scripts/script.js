const plantApp = {};

plantApp.token = "IqewWccMHBa3cnlYw2-TrtPrsxLhFmDY10kpsztBXk4";

// submit button init listener
plantApp.eventListener = () => {
  $('form').on('submit', function(e) {
    e.preventDefault();
    $('form').attr('aria-label', 'submitted');
    $('button[type=submit]').addClass('submitted');
    const userColor = $("#plantColor").val();
    if (isNaN(userColor) )
  })
}

// plant displayer

plantApp.getPlants = (color) => {
  // the information we provide to the function is a query so we name the parameter as such to make our code more human-legible
  $.ajax({
    url: `https://trefle.io/api/v1/species?filter%5Bflower_color%5D=${color}&token=${plantApp.token}`,
    // query contains the user data from selected; will change the url to point to the specified season through the power of template literal
    method: "GET",
    dataType: "json",
  }).then(function (apiResults) {
    plantApp.displayPlants(apiResults);
  });
};

plantApp.init = () => {};

$(function () {
  plantApp.init();
});
