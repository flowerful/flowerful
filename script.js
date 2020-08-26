// declare namespace
const plantApp = {};

// declare global variable for api key
plantApp.token = "Nk4_i1-kPywdBoYzOHoPSfEHN6MOmN51Ab6rxkg06Bg";

// declare global variable for api pagination
plantApp.page = 1;

// declare global variable to track end of loop; this ensures favourites button is present for click appender function
plantApp.lastPlant = "";

// listen for user click on submit button
plantApp.eventListener = () => {
  $("form").on("submit", function (e) {
    // prevent page reload
    e.preventDefault();
    // attach classes for screen reader accessibility
    $("form").attr("aria-label", "submitted");
    $("input[type=submit]").addClass("submitted");
    // hide input confirmation if previous search has occured
    $(".confirmationCard").addClass("divHider");
    // hide instructions on search
    $(".instructions").addClass("divHider");
    // reset input confirmation text
    $(".confirmationCard").html("Request received! Gathering plants...");
    // empty previous search results
    $(".results").empty();
    // hide load more button
    $(".loadMore").addClass("divHider");
    // reset api page request
    plantApp.page = 1;
    // reset last plant
    plantApp.lastPlant = "";
    // store user input
    let userColour = $("#plantColour").val();
    // set input to lower case for api request
    userColour = userColour.toLowerCase();
    // check if user has typed integers; if so, reset field
    if (!isNaN(userColour)) {
      $("#desiredColour").find("input:text").val("");
      // on valid input, make api call
    } else {
      $(".confirmationCard").removeClass("divHider");
      plantApp.getPlants(userColour);
    }
  });
};

// listen for user input on load more button
plantApp.morePlantsListener = () => {
  $(".loadMoreButton").on("click", function () {
    // accessibility classes
    $(".loadMore").attr("aria-label", "submitted");
    $(".loadMore").addClass("submitted");
    // iterate api pagination
    plantApp.page++;
    // store user input
    const userColour = $("#plantColour").val();
    // make api call with new pagination
    if (!isNaN(userColour)) {
      $("#desiredColour").find("input:text").val("");
    } else {
      plantApp.getPlants(userColour);
    }
  });
};

// listen for user click on menu button
plantApp.popoutSummon = () => {
  $(".menuButton").on("click", function () {
    // reveal sidebar
    $(".sideList").toggleClass("sideListOpen");
    $(".menuButton").toggleClass("menuButtonOpen");
    $(".desiredPlantsList").toggleClass("divHider");
    $(".clearList").toggleClass("divHider");
  });
};

// listen for user click on add to favourites button
plantApp.listAdder = () => {
  $(".listButton")
    // clear previously attached click events
    .off("click");
  // re-attach click event
  $(".listButton").on("click", function () {
    // store common name held in button data index
    const listElement = $(this).data("index");
    // append text to favourites list
    $(".desiredPlantsList").append(`
    <li class='listItem'>${listElement}</li>
    `);
  });
};

// listen for user click on list clear button; on click, reset list
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

// second api call to pull more detailed objet avialable for individual species
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
    // begin second append function for new data
    plantApp.displayMoreInfo(moreApiResults);
  });
};

plantApp.displayMoreInfo = (plantInfo) => {
  const specificPlant = plantInfo.data;
  // append back of card info to dom with info from second api call. appender function knows where to append from reference to id of previously-appended card front.
  $(`#${specificPlant.id}`).append(`
    <div class='plantCardBack'>
      <h3>${specificPlant.scientific_name}</h3>
        <ul class='plantInfo'>
          <li>Discovered: ${specificPlant.year}</li>
          <li>Genus: ${specificPlant.genus}</li>
          <li>Family: ${specificPlant.family}</li>
        </ul>
      <div class='listButtonWrapper'>
        <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
      </div>
    </div>
  `);
  // api does not always return below data; check if present before appending
  if (specificPlant.duration !== null) {
    $(`#${specificPlant.id} .plantInfo`).append(`
      <li>Duration: ${specificPlant.duration}</li>
    `);
  }
  if (specificPlant.specifications.average_height.cm !== null) {
    $(`#${specificPlant.id} .plantInfo`).append(`
      <li>Average height: ${specificPlant.specifications.average_height.cm} cm</li>
    `);
  }
  if (specificPlant.specifications.maximum_height.cm !== null) {
    $(`#${specificPlant.id} .plantInfo`).append(`
      <li>Maximum height: ${specificPlant.specifications.maximum_height.cm} cm</li>
    `);
  }
  if (specificPlant.growth.bloom_months !== null) {
    $(`#${specificPlant.id} .plantInfo`).append(`
      <li>Blooms during: ${specificPlant.growth.bloom_months}</li>
    `);
  }
  if (specificPlant.growth.light !== null) {
    $(`#${specificPlant.id} .plantInfo`).append(`
      <li>Required light intensity (1-10): ${specificPlant.growth.light}</li>
    `);
  }
  if (specificPlant.id === plantApp.lastPlant) {
    plantApp.listAdder();
  }
};

// read and display api data
plantApp.displayPlants = (plants) => {
  // store array with plants in variable
  const plant = plants.data;
  plantApp.lastPlant = plant[plant.length - 1].id;
  // check if api call returns null and display info to user
  if (plant[0] === undefined) {
    $(".confirmationCard").html(`No plants found with that colour!`);
  } else {
    // confirm successful search to user
    $(".confirmationCard").html("Plants gathered!");
    // iterate through plant array creating new info card element for each plant
    plant.forEach(function (eachPlant) {
      // do not display plant card if api fails to return image
      if (eachPlant.image_url !== null) {
        // mark each card with id number of specific plant for subsequent appender function's reference
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
        // make second api call for specific plant to fetch back of card info not returned by general call
        plantApp.getMoreInfo(eachPlant.id);
      }
    });
    $(".loadMore").removeClass("divHider");
  }
};

// initialize functions
plantApp.init = () => {
  plantApp.eventListener();
  plantApp.morePlantsListener();
  plantApp.popoutSummon();
  plantApp.listClear();
};

// run init function on document ready
$(function () {
  plantApp.init();
});
