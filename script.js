const plantApp = {};

// We want to access the data array returned by the API
// We want to iterate over that array
// for the object at each array position we want to access the common name and image url in order to append them to the DOM as a card

plantApp.token = "Nk4_i1-kPywdBoYzOHoPSfEHN6MOmN51Ab6rxkg06Bg";

plantApp.page = 1;

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
    // reset input confirmation text
    $(".confirmationCard").html("Request received! Gathering plants...");
    // empty previous search results
    $(".results").empty();
    // hide load more button
    $(".loadMore").addClass("divHider");
    // reset api page request
    plantApp.page = 1;
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
    $(".desiredPlantsList").toggleClass("divHider");
    $(".clearList").toggleClass("divHider");
  });
};

// listen for user click on add to favourites button
plantApp.listAdder = () => {
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

// // read and display api data
// plantApp.displayPlants = (plants) => {
//   // access and store data array in returned object
//   const plant = plants.data;
//   // alert user if search is unsuccessful
//   if (plant[0] === undefined) {
//     $(".confirmationCard").html(`No plants found with that colour!`);
//   } else {
//     // on successful search, perform the following on each array object
//     plant.forEach(function (eachPlant) {
//       // append to page only when data object contains an image
//       if (eachPlant.image_url !== null) {
//         // append results css for each returned plant using data pulled from array at each index
//         $(".results").append(`
//         <div class="plantCard">
//           <div class='plantCardInner'>
//             <div class='plantCardFront' tabindex='0'>
//               <div class="imageContainer">
//                 <img src="${eachPlant.image_url}" alt="${eachPlant.common_name}" class="plantImage"/>
//               </div>
//               <h3>${eachPlant.common_name}</h3>
//             </div>
//             <div class='plantCardBack' tabindex='0'>
//               <h3>${eachPlant.scientific_name}</h3>
//               <ul>
//                 <li>discovered: ${eachPlant.year}</li>
//                 <li>genus: ${eachPlant.genus}</li>
//                 <li>family: ${eachPlant.family}</li>
//               </ul>
//               <div class='listButtonWrapper'>
//                 <button class="listButton" data-index='${eachPlant.common_name}' tabindex='0'>Add to favourites</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       `);
//       }
//     });
//     // reveal load more button
//     $(".loadMore").removeClass("divHider");
//     // attach event listener to add to favourites buttons
//     plantApp.listAdder();
//   }
// };

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

// make api call
// iterate over promise object array
// collect id from each returned plant
// pass to second api call
// collect more info and append to dom

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
  if (specificPlant.duration === null) {
    $(`#${specificPlant.id}`).append(`
    <div class='plantCardBack'>
      <h3>${specificPlant.scientific_name}</h3>
        <ul>
          <li>discovered: ${specificPlant.year}</li>
          <li>genus: ${specificPlant.genus}</li>
          <li>family: ${specificPlant.family}</li>
          <li>Average Height: ${specificPlant.specifications.average_height.cm} cm</li>
          <li>Maximum Height: ${specificPlant.specifications.maximum_height.cm} cm</li>
          <li>Required Light intensity (1-10): ${specificPlant.growth.light}</li>
          <li>Blooms: ${specificPlant.growth.bloom_months}</li>
        </ul>
      <div class='listButtonWrapper'>
        <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
      </div>
    </div>
      `);
  } else if (specificPlant.growth.light === null) {
    $(`#${specificPlant.id}`).append(`
    <div class='plantCardBack'>
      <h3>${specificPlant.scientific_name}</h3>
        <ul>
          <li>Discovered: ${specificPlant.year}</li>
          <li>Genus: ${specificPlant.genus}</li>
          <li>Family: ${specificPlant.family}</li>
          <li>Duration: ${specificPlant.duration}</li>
          <li>Average Height: ${specificPlant.specifications.average_height.cm} cm</li>
          <li>Maximum Height: ${specificPlant.specifications.maximum_height.cm} cm</li>
          <li>Blooms: ${specificPlant.growth.bloom_months}</li>
        </ul>
      <div class='listButtonWrapper'>
        <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
      </div>
    </div>
      `);
  } else if (specificPlant.growth.bloom_months === null) {
    $(`#${specificPlant.id}`).append(`
    <div class='plantCardBack'>
      <h3>${specificPlant.scientific_name}</h3>
        <ul>
          <li>Discovered: ${specificPlant.year}</li>
          <li>Genus: ${specificPlant.genus}</li>
          <li>Family: ${specificPlant.family}</li>
          <li>Duration: ${specificPlant.duration}</li>
          <li>Average Height: ${specificPlant.specifications.average_height.cm} cm</li>
          <li>Maximum Height: ${specificPlant.specifications.maximum_height.cm} cm</li>
          <li>Required Light intensity (1-10): ${specificPlant.growth.light}</li>
        </ul>
      <div class='listButtonWrapper'>
        <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
      </div>
    </div>
      `);
  } else if (specificPlant.specifications.average_height.cm === null) {
    $(`#${specificPlant.id}`).append(`
    <div class='plantCardBack'>
      <h3>${specificPlant.scientific_name}</h3>
        <ul>
          <li>Discovered: ${specificPlant.year}</li>
          <li>Genus: ${specificPlant.genus}</li>
          <li>Family: ${specificPlant.family}</li>
          <li>Duration: ${specificPlant.duration}</li>
          <li>Maximum Height: ${specificPlant.specifications.maximum_height.cm} cm</li>
          <li>Blooms: ${specificPlant.growth.bloom_months}</li>
          <li>Required Light intensity (1-10): ${specificPlant.growth.light}</li>
        </ul>
      <div class='listButtonWrapper'>
        <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
      </div>
    </div>
      `);
  } else if (specificPlant.specifications.maximum_height.cm === null) {
    $(`#${specificPlant.id}`).append(`
    <div class='plantCardBack'>
      <h3>${specificPlant.scientific_name}</h3>
        <ul>
          <li>Discovered: ${specificPlant.year}</li>
          <li>Genus: ${specificPlant.genus}</li>
          <li>Family: ${specificPlant.family}</li>
          <li>Duration: ${specificPlant.duration}</li>
          <li>Average Height: ${specificPlant.specifications.average_height.cm} cm</li>
          <li>Blooms: ${specificPlant.growth.bloom_months}</li>
          <li>Required Light intensity (1-10): ${specificPlant.growth.light}</li>
        </ul>
      <div class='listButtonWrapper'>
        <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
      </div>
    </div>
      `);
  } else {
    $(`#${specificPlant.id}`).append(`
    <div class='plantCardBack'>
      <h3>${specificPlant.scientific_name}</h3>
        <ul>
          <li>Discovered: ${specificPlant.year}</li>
          <li>Genus: ${specificPlant.genus}</li>
          <li>Family: ${specificPlant.family}</li>
          <li>Duration: ${specificPlant.duration}</li>
          <li>Average Height: ${specificPlant.specifications.average_height.cm} cm</li>
          <li>Maximum Height: ${specificPlant.specifications.maximum_height.cm} cm</li>
          <li>Blooms: ${specificPlant.growth.bloom_months}</li>
          <li>Required Light intensity (1-10): ${specificPlant.growth.light}</li>
        </ul>
      <div class='listButtonWrapper'>
        <button class="listButton" data-index='${specificPlant.common_name}'>Add to favorites</button>
      </div>
    </div>
      `);
  }
};

plantApp.displayPlants = (plants) => {
  const plant = plants.data;
  if (plant[0] === undefined) {
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
    plantApp.listAdder();
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
