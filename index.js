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
 window.addEventListener("load", (e) => getRandomBeer(e));

/*----------Functions----------*/
// Function to fetch a random beer from the API
const getRandomBeer = async (e) => {
  try {
    const response = await fetch("https://api.punkapi.com/v2/beers/random");
    const randomBeer = await response.json();
    console.log(randomBeer[0]);
    renderRandomBeer(randomBeer);
  } catch (error) {
    console.error(error);
  }
};

// Function to render a random beer on the page
const renderRandomBeer = (randomBeer) => {
  clearOldContent();
  // Render new beer
  const beerHTML = `
    <div class="beer-card">
        <img src=${randomBeer[0].image_url} alt=${randomBeer[0].name} class="beer-img">
        <div class="random-beer-name">${randomBeer[0].name}</div>
        <button id="seeMoreBtn">See more</button>
     </div>
    `;
  contentDiv.innerHTML = beerHTML;

  const seeMoreBtn = document.getElementById("seeMoreBtn");
  seeMoreBtn.addEventListener("click", () => {
    displayBeerDetailsPage(randomBeer);
  });
};

// Function to display detailed information about a beer
function displayBeerDetailsPage(beer) {
  clearOldContent();
  beer = beer[0];

  // Create a list of hops
  const hopsList = beer.ingredients.hops
    .map((hop) => `<span>${hop.name}  </span>`)
    .join("");

  // HTML template for displaying beer details
  const beerDetailsHTML = `
    <div class="beer-details">
      <h2>${beer.name}</h2>
      <img src="${beer.image_url}" alt="${beer.name}" class="beer-img">
      <p><span class="bold" >Description: </span>${beer.description}</p>
      <p><span class="bold">Alcohol by volume/ABV: </span>${beer.abv}</p>
      <p><span class="bold">Volume: </span>${beer.volume.value} ${
    beer.volume.unit
  }</p>
      <p><span class="bold">Ingredients: </span>${Object.keys(
        beer.ingredients
      )}</p>
      <p><span class="bold">Hops: </span>${hopsList}</p>
      <p><span class="bold">Food Pairing: </span>${beer.food_pairing.join(
        ", "
      )}</p>
      <p><span class="bold">Brewers Tips: </span>${beer.brewers_tips}</p>
    </div>
  `;
  content.innerHTML = beerDetailsHTML;
}

// Function to handle the search for a beer
const getSearch = () => {
  clearOldContent();

  // Render new content
  const searchFormHTML = `
    <form id="searchForm">
      <input type="text" id="searchInput" placeholder="Search beer...">
      <button type="submit">Search</button>
    </form>
    <div id="searchResults"></div>
  `;
  contentDiv.innerHTML = searchFormHTML;

  // Add event listener to the search form
  const searchForm = document.getElementById("searchForm");
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchTerm = document.getElementById("searchInput").value;
    const modifiedSearchTerm = searchTerm.replace(/\s+/g, "_"); // Replace spaces with underscore
    const searchResults = await searchBeerByName(modifiedSearchTerm);
    displaySearchResults(searchResults);

    
  });
  
};



// Function to search for a beer by its name
const searchBeerByName = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://api.punkapi.com/v2/beers?beer_name=${searchTerm}`
    );
    const searchBeer = await response.json();
    console.log(searchBeer[0]);
    return searchBeer;
  } catch (error) {
    console.error(error);
  }
};

// Function to display search results with pagination
const displaySearchResults = (results) => {
  const searchResultsDiv = document.getElementById("searchResults");
  const totalResults = results.length;
  const itemsPerPage = 10;
  let currentPage = 1;

  // Function to render search results with pagination
  const renderResults = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slicedResults = results.slice(start, end);

    let html = "<ul>";
    slicedResults.forEach((beer) => {
      html += `<li><a href="#" class="beer-link" data-id="${beer.id}">${beer.name}</a></li>`;
    });
    html += "</ul>";

    // Add pagination controls
    const paginationHTML = `
      <div class="pagination">
        <button class="prev-btn" ${
          currentPage === 1 ? "disabled" : ""
        }>Prev</button>
        <span class="page-info">${start + 1}-${Math.min(
      end,
      totalResults
    )} / ${totalResults}</span>
        <button class="next-btn" ${
          end >= totalResults ? "disabled" : ""
        }>Next</button>
      </div>
    `;

    searchResultsDiv.innerHTML = html + paginationHTML;

    // Add event listeners for beer links
    const beerLinks = document.querySelectorAll(".beer-link");
    beerLinks.forEach((link) => {
      link.addEventListener("click", async (event) => {
        event.preventDefault();
        const beerId = event.target.dataset.id;
        const beer = await getBeerById(beerId);
        console.log(beer[0]);
        displayBeerDetailsPage(beer);
      });
    });

    // Add event listeners for pagination buttons
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
  };

  renderResults();
};

// Function to fetch a beer by its ID
async function getBeerById(id) {
  try {
    console.log("ID " + id);
    const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to clear old content from the contentDiv
const clearOldContent = () => {
  while (contentDiv.hasChildNodes()) {
    contentDiv.removeChild(contentDiv.firstChild);
  }
};
