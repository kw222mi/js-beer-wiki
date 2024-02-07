/*--------------Global Variables------------*/
const beerButton = document.getElementById("beer-button")
const searchForBeerButton = document.getElementById("search-for-beer-button")
const contentDiv = document.getElementById("content");

/*---------------Eventlisteners---------------*/
// get random beer when clicking the button
beerButton.addEventListener('click', (e) => getRandomBeer(e))
// search for a beer
searchForBeerButton.addEventListener('click', () => getSearch())
// get random beer when loading the page
window.addEventListener("load", (e) => getRandomBeer(e));


/*----------Functions----------*/
const getRandomBeer = async (e) => {
    const response = await fetch("https://api.punkapi.com/v2/beers/random");
    const randomBeer = await response.json()
    console.log(randomBeer[0])
    renderRandomBeer(randomBeer)
}

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
    contentDiv.innerHTML = beerHTML

    const seeMoreBtn = document.getElementById("seeMoreBtn");
    seeMoreBtn.addEventListener("click", () => {
      displayBeerDetailsPage(randomBeer);
    });
}

function displayBeerDetailsPage(beer) {
  clearOldContent();
  beer = beer[0];

  const hopsList = beer.ingredients.hops
    .map((hop) => `<span>${hop.name}  </span>`)
    .join("");

  const beerDetailsHTML = `
    <div class="beer-details">
      <h2>${beer.name}</h2>
      <img src="${beer.image_url}" alt="${beer.name}" class="beer-img">
      <p><span class="bold" >Description: </span>${beer.description}</p>
      <p><span class="bold">Alcohol by volume/ABV: </span>${beer.abv}</p>
      <p><span class="bold">Volume: </span>${beer.volume.value} ${
    beer.volume.unit}</p>
      <p><span class="bold">Ingredients: </span>${Object.keys(
        beer.ingredients)}</p>
      <p><span class="bold">Hops: </span>${hopsList}</p>
      <p><span class="bold">Food Pairing: </span>${beer.food_pairing.join(
        ", ")}</p>
      <p><span class="bold">Brewers Tips: </span>${beer.brewers_tips}</p>
    </div>
  `;
  content.innerHTML = beerDetailsHTML;
}


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

  const searchForm = document.getElementById("searchForm");
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const searchTerm = document.getElementById("searchInput").value;
    const modifiedSearchTerm = searchTerm.replace(/\s+/g, "_"); // Replace spaces with underscore
    const searchResults = await searchBeerByName(modifiedSearchTerm);
    displaySearchResults(searchResults);
  });
};


const searchBeerByName = async (searchTerm) => {
 const response = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${searchTerm}`);
    const searchBeer = await response.json()
    console.log(searchBeer[0])
    return searchBeer
}
/*
const displaySearchResults = (results) => {
    const searchResultsDiv = document.getElementById("searchResults");
    let html = "<ul class='search-result'>";
    results.slice(0, 10).forEach((beer) => {
      html += `<li><a href="#" class="beer-link" data-id="${beer.id}">${beer.name}</a></li>`;
    });
    html += "</ul>";
    searchResultsDiv.innerHTML = html;

    const beerLinks = document.querySelectorAll(".beer-link");
    beerLinks.forEach((link) => {
      link.addEventListener("click", async (event) => {
        event.preventDefault();
        const beerId = event.target.dataset.id;
        const beer = await getBeerById(beerId);
        console.log(beer[0])
        displayBeerDetailsPage(beer);
      });
    });
}
*/

const displaySearchResults = (results) => {
  const searchResultsDiv = document.getElementById("searchResults");
  const totalResults = results.length;
  const itemsPerPage = 10;
  let currentPage = 1;

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



async function getBeerById(id) {
    console.log("ID " + id)
  const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
  const data = await response.json();
  console.log(data)
  return data;
}

const clearOldContent = () => {
    while (contentDiv.hasChildNodes()) {
      contentDiv.removeChild(contentDiv.firstChild);
    }
}


