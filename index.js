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
    <img src=${randomBeer[0].image_url} alt="picture of random beer" class="random-beer-img">
    <div>${randomBeer[0].name}</div>
    <button id="seeMoreBtn">See more</button>
    `;
    contentDiv.innerHTML = beerHTML

    const seeMoreBtn = document.getElementById("seeMoreBtn");
    seeMoreBtn.addEventListener("click", () => {
      displayBeerDetailsPage(randomBeer);
    });
}

function displayBeerDetailsPage(beer) {
    clearOldContent();
    console.log()
    beer = beer[0]
  const beerDetailsHTML = `
    <div class="beer-details">
      <h2>${beer.name}</h2>
      <img src="${beer.image_url}" alt="${beer.name}">
      <p>Description: ${beer.description}</p>
      <p> Alcohol by volume/ABV: ${beer.abv}</p>
      <p>Volume: ${beer.volume.value} ${beer.volume.unit}</p>
      <p>Ingredients: ${JSON.stringify(beer.ingredients)}</p>
      <p>Hops: ${JSON.stringify(beer.ingredients.hops)}</p>
      <p>Food Pairing: ${beer.food_pairing.join(", ")}</p>
      <p>Brewers Tips: ${beer.brewers_tips}</p>
    </div>
  `;
  content.innerHTML = beerDetailsHTML;
}

const getSearch = () => {
   clearOldContent()
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
       const searchResults = await searchBeerByName(searchTerm);
       displaySearchResults(searchResults);
     });

}

const searchBeerByName = async (searchTerm) => {
 const response = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${searchTerm}`);
    const searchBeer = await response.json()
    console.log(searchBeer[0])
    return searchBeer
}

const displaySearchResults = (results) => {
    const searchResultsDiv = document.getElementById("searchResults");
    let html = "<ul>";
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