/*--------------Global Variables------------*/
let beerButton = document.getElementById("beer-button")

/*---------------Eventlisteners---------------*/
// get random beer when clicking the button
beerButton.addEventListener('click', (e) => getRandomBeer(e))
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
     const contentDiv = document.getElementById("content");
    // Clear old beers
    while (contentDiv.hasChildNodes()) {
      contentDiv.removeChild(contentDiv.firstChild);
    }
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