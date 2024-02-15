import { createbeerDetailsHTML } from "./beerDetailsHTML.js";
import { createRandomBeerHTML } from "./randomBeerHTML.js";
import { createSearchFormHTML } from "./searchFormHTML.js";
import { searchResultView } from "./searchResultView.js";
import { pushBeerDetailsState, pushSearchState, pushRandomBeerState } from "./pushState.js";

/*--------------Global Variables------------*/
const beerButton = document.getElementById("beer-button");
const searchForBeerButton = document.getElementById("search-for-beer-button");
const contentDiv = document.getElementById("content");

/*---------------Event Listeners---------------*/
// Event listener to get a random beer when clicking the button
beerButton.addEventListener("click", (e) => getRandomBeer(e));
// Event listener to search for a beer
searchForBeerButton.addEventListener("click", () => getSearch());
// Event listener to get a random beer when loading the page
window.addEventListener("load", (e) => renderDefaultContent());

// Event listener for popstate event
window.addEventListener("popstate", (event) => {
  event.preventDefault();
  if (event.state.view) {
    // Restore application state based on the popped history state
    restoreAppState(event.state);
  } else {
    // If no state, render default content
    renderDefaultContent();
  }
});

/*----------Functions----------*/

/**
 * Get and display a random beer.
 */
const getRandomBeer = async (e) => {
  // Fetch random beer
  const randomBeer = await fetchRandomBeer();
  // Render to view
  renderRandomBeer(randomBeer);
  // Push the state to history
  pushRandomBeerState(randomBeer);
};

/**
 * Fetch a random beer from the API.
 */
async function fetchRandomBeer() {
  try {
    const response = await fetch("https://api.punkapi.com/v2/beers/random");
    const randomBeer = await response.json();
    return randomBeer;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Function to render a random beer tto tthe view.
 */
const renderRandomBeer = (randomBeer) => {
  clearOldContent();
  // Get HTML for random beer
  let beerHTML = createRandomBeerHTML(randomBeer);
  // Add to DOM
  contentDiv.innerHTML = beerHTML;
  // Add event listener for details button
  const seeMoreBtn = document.getElementById("seeMoreBtn");
  seeMoreBtn.addEventListener("click", () => {
    displayBeerDetailsPage(randomBeer[0]);
  });
};

/**
 * Function to display detailed information about a beer
 */ 
const displayBeerDetailsPage = (beer) => {
  clearOldContent();
  // Create a list of hops
  const hopsList = beer.ingredients.hops
    .map((hop) => `<span>${hop.name}  </span>`)
    .join("");
  // Create HTML for beer details
  let beerDetailsHTML = createbeerDetailsHTML(beer, hopsList);
  content.innerHTML = beerDetailsHTML;
  pushBeerDetailsState(beer);
};

/**
 * Function to handle the search for a beer
 */
const getSearch = () => {
  clearOldContent();
  // Render the searchform
  const searchFormHTML = createSearchFormHTML();
  contentDiv.innerHTML = searchFormHTML;
  // Add event listener to the search form
  addEventListenerToSearchForm();
};

/**
 * Add eventlistener to the search form.
 */
function addEventListenerToSearchForm () {
  const searchForm = document.getElementById("searchForm");

  searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchTerm = document.getElementById("searchInput").value;
  const modifiedSearchTerm = searchTerm.replace(/\s+/g, "_"); // Replace spaces with underscore
  const searchResults = await searchBeerByName(modifiedSearchTerm);
  displaySearchResults(searchResults);
  pushSearchState(modifiedSearchTerm, searchResults);
  });
}

/**
 * Search for a beer by its name
 */
const searchBeerByName = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://api.punkapi.com/v2/beers?beer_name=${searchTerm}`
    );
    const searchBeer = await response.json();
    return searchBeer;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Display search results with pagination 
 */
const displaySearchResults = (results) => {
  const searchResultsDiv = document.getElementById("searchResults");
  const searchResult = searchResultView(results);
  searchResultsDiv.innerHTML = searchResult;

  // Add event listeners for beer links
  addEventListenersToBeerLinks();

  // Add event listeners for pagination buttons
  addEventListenersToPagination();
};

/**
 * Add event listeners for beer links
 */
function addEventListenersToBeerLinks () {
  const beerLinks = document.querySelectorAll(".beer-link");
  beerLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const beerId = event.target.dataset.id;
      const beer = await getBeerById(beerId);
      displayBeerDetailsPage(beer[0]);
    });
  });
}

/**
 * Add event listeners for pagination buttons
 */
function addEventListenersToPagination () {
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderResults();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (end < totalResults) {
      currentPage++;
      renderResults();
    }
  });
}

// Function to fetch a beer by its ID
const getBeerById = async (id) => {
  try {
    const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to clear old content from the contentDiv
const clearOldContent = () => {
  while (contentDiv.hasChildNodes()) {
    contentDiv.removeChild(contentDiv.firstChild);
  }
};

/**
 * Function to restore application state based on history state 
 */
const restoreAppState = (state) => {
  switch (state.view) {
    case "randomBeer":
      renderRandomBeer(state.randomBeerData.randomBeer);
      break;
    case "beerDetails":
      displayBeerDetailsPage(state.randomBeerData.randomBeer);
      break;
    case "searchResults":
      getSearch();
      displaySearchResults(state.searchData.searchResults);
      break;
    default:
      console.log("render default");
      renderDefaultContent();
      break;
  }
};

/**
 * Function to render default content
 */
const renderDefaultContent = () => {
  console.log("default");
  getRandomBeer();
};

