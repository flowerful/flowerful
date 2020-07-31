const plantApp = {};

// We want to access the data array returned by the API 
// We want to iterate over that array 
// for the object at each array position we want to access the common name and image url in order to append them to the DOM as a card 

plantApp.token = "_DwpNdxID1_WtjGD4yqO323Mvt-DuQM0-i7D779pjP8";

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
  console.log("plantApp.displayPlants -> plants", plants);
  $("results").empty();
  const plant = plants.data;
  console.log("plantApp.displayPlants -> plant", plant);
  plant.forEach(function (eachPlant) {
    if (eachPlant.image_url !== null) {
      $(".results").append(` 
        <div class="plantCard">  
            <div class="imageContainer"> 
            <img src="${eachPlant.image_url}" alt="${eachPlant.common_name}" class="plantImage"/>
          <h3>${eachPlant.common_name}</h3>
          </div>
        </div>
      `);
    }
  });
};

plantApp.getPlants = (color) => {
  // the information we provide to the function is a query so we name the parameter as such to make our code more human-legible
  $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `https://trefle.io/api/v1/species`,
      params: {
        token: plantApp.token,
        "filter[flower_color]": color,
      },
    },
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

// species?filter%5Bflower_color%5D=${color}&token=${plantApp.token}
