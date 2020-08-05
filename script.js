const plantApp = {};

// We want to access the data array returned by the API
// We want to iterate over that array
// for the object at each array position we want to access the common name and image url in order to append them to the DOM as a card

plantApp.token = "IqewWccMHBa3cnlYw2-TrtPrsxLhFmDY10kpsztBXk4";

plantApp.page = 1;

// submit button init listener
plantApp.eventListener = () => {
  $("form").on("submit", function (e) {
    e.preventDefault();
    $("form").attr("aria-label", "submitted");
    $("input[type=submit]").addClass("submitted");
    $(".confirmationCard").addClass("divHider");
    $(".confirmationCard").html("Request received! Gathering plants...");
    $(".results").empty();
    $(".loadMore").addClass("divHider");
    plantApp.page = 1;
    let userColour = $("#plantColour").val();
    userColour = userColour.toLowerCase();
    if (!isNaN(userColour)) {
      $("#desiredColour").find("input:text").val("");
    } else {
      $(".confirmationCard").removeClass("divHider");
      plantApp.getPlants(userColour);
    }
  });
};

plantApp.morePlantsListener = () => {
  $(".loadMoreButton").on("click", function () {
    $(".loadMore").attr("aria-label", "submitted");
    $(".loadMore").addClass("submitted");
    plantApp.page++;
    const userColour = $("#plantColour").val();
    if (!isNaN(userColour)) {
      $("#desiredColour").find("input:text").val("");
    } else {
      plantApp.getPlants(userColour);
    }
  });
};

plantApp.popoutSummon = () => {
  $(".menuButton").on("click", function () {
    $(".sideList").toggleClass("sideListOpen");
    $(".desiredPlantsList").toggleClass("divHider");
    $(".clearList").toggleClass("divHider");
  });
};

plantApp.listAdder = () => {
  $(".listButton").on("click", function () {
    console.log("clicked");
    const listElement = $(this).data("index");
    $(".desiredPlantsList").append(`
    <li class='listItem'>${listElement}</li>
    `);
  });
};

plantApp.listClear = () => {
  $(".clearList").on("click", function () {
    $(".desiredPlantsList").empty();
  });
};


// make api call to hackeryou proxy, avoiding CORS error
plantApp.getPlants = (color) => {
  $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `https://trefle.io/api/v1/species`,
      params: {
        token: plantApp.token,
        "filter[flower_color]": color,
        page: plantApp.page,
      },
    },
    // on api call completion, run dom manipulation function
  }).then(function (apiResults) {
    plantApp.displayPlants(apiResults);
  });
};

plantApp.getMoreInfo = (plantID) => {
  $.ajax({
    url: "https://proxy.hackeryou.com",
    dataType: "json",
    method: "GET",
    data: {
      reqUrl: `https://trefle.io/api/v1/species/${plantID}`,
      params: {
        token: plantApp.token,
      },
    },
  }).then(function (moreApiResults) {
    plantApp.displayMoreInfo(moreApiResults);
  });
};

plantApp.displayMoreInfo = (plantInfo) => {
  const specificPlant = plantInfo.data;
  // create the container for the card back
  $(`#${specificPlant.id}`).append(`
  <div class='plantCardBack'>
    <h3>${specificPlant.scientific_name}</h3>
    <ul>
      <li>Discovered: ${specificPlant.year}</li>
      <li>Genus: ${specificPlant.genus}</li>
      <li>Family: ${specificPlant.family}</li>
    </ul>
    <div class='listButtonWrapper'>
      <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
    </div>
  </div>
  `);
  // create a target variable for the plantCardBack ul
  const $cardBackUl = $(`#${specificPlant.id} .plantCardBack ul`);
  // check individual property to see if it's undefined.
  // if the property !== null, append to the card back.
  if (specificPlant.duration !== null && specificPlant.duration !== undefined) {
    $cardBackUl.append(`<li>Duration: ${specificPlant.duration}</li>`);
  } 
  if (specificPlant.specifications.average_height.cm !== null && specificPlant.specifications.average_height.cm !== undefined) {
    $cardBackUl.append(`<li>Average Height: ${specificPlant.specifications.average_height.cm} cm</li>`);
  }
  if (specificPlant.specifications.maximum_height.cm !== null && specificPlant.specifications.maximum_height.cm !== undefined) {
    $cardBackUl.append(`<li>Maximum Height: ${specificPlant.specifications.maximum_height.cm} cm</li>`);
  }
  if (specificPlant.growth.light !== null && specificPlant.growth.light !== undefined) {
    $cardBackUl.append(`<li>Required Light intensity (1-10): ${specificPlant.growth.light}</li>`);
  } 
  if (specificPlant.growth.bloom_months !== null && specificPlant.growth.bloom_months !== undefined) {
    $cardBackUl.append(`<li>Blooms: ${specificPlant.growth.bloom_months}</li>`);
  } 
  plantApp.listAdder ();
};

plantApp.displayPlants = (plants) => {
  const plant = plants.data;
  if (plant.length === 0) {
    $(".confirmationCard").html(`No plants found with that colour!`);
  } else {
    $(".confirmationCard").html("Plants gathered!");
    plant.forEach(function (eachPlant) {
      if (eachPlant.image_url !== null) {
        $(".results").append(`
        <div class="plantCard">
          <div class='plantCardInner' id='${eachPlant.id}'>
            <div class='plantCardFront'>
              <div class="imageContainer">
                <img src="${eachPlant.image_url}" alt="${eachPlant.common_name}" class="plantImage"/>
                <h3>${eachPlant.common_name}</h3>
              </div>
            </div>
          </div>
        </div>
      `);
        plantApp.getMoreInfo(eachPlant.id);
      }
    });
    $(".loadMore").removeClass("divHider");
  }
};

plantApp.init = () => {
  plantApp.eventListener();
  plantApp.morePlantsListener();
  plantApp.popoutSummon();
  plantApp.listClear();
};

$(function () {
  plantApp.init();
});

