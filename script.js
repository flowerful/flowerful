const plantApp = {};

plantApp.token = "IqewWccMHBa3cnlYw2-TrtPrsxLhFmDY10kpsztBXk4";

// submit button init listener
plantApp.eventListener = () => {
  $("form").on("submit", function (e) {
    e.preventDefault();
    $("form").attr("aria-label", "submitted");
    $("input[type=submit]").addClass("submitted");
    const userColour = $("#plantColour").val();
    console.log("plantApp.eventListener -> userColor", userColour);
    if (!isNaN(userColour)) {
      $("#desiredColour").find("input:text").val("");
    } else {
      plantApp.getPlants(userColour);
    }
  });
};

plantApp.displayPlants = (plants) => {
  $("results").empty();
  const plant = plant.data;
  console.log("plantApp.displayPlants -> plant", plant);
  plant.forEach(function () {
    $(".results").append(` 
      <div class="plantCard">  
        <h3> ${plants.data.common_name}</h3>
        <div class="imageContainer"> 
          <img src="${plants.data.image_url}" alt="${plants.data.common_name}" class="plantImage"/>
        </div>
      </div>
    `);
  });
};

plantApp.getPlants = (color) => {
  // the information we provide to the function is a query so we name the parameter as such to make our code more human-legible
  $.ajax({
    url: `https://trefle.io/api/v1/species?filter%5Bflower_color%5D=${color}&token=IqewWccMHBa3cnlYw2-TrtPrsxLhFmDY10kpsztBXk4`,
    // query contains the user data from selected; will change the url to point to the specified season through the power of template literal
    method: "GET",
    dataType: "jsonp",
  }).then(function (apiResults) {
    plantApp.displayPlants(apiResults);
  });
};

plantApp.init = () => {
  plantApp.eventListener();
};

$(function () {
  plantApp.init();
});
