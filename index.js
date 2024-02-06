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
    renderRandomBeer(randomBeer[0].name, randomBeer[0].image_url)
}

const renderRandomBeer = (name, url) => {
     const contentDiv = document.getElementById("content");
    // Clear old beers
    while (contentDiv.hasChildNodes()) {
      contentDiv.removeChild(contentDiv.firstChild);
    }
    // Render new beer
    const beerHTML = `
    <img src=${url} alt="picture of random beer" class="random-beer-img">
    <div>${name}</div>
    <button id="seeMoreBtn">See more</button>
    `;
    contentDiv.innerHTML = beerHTML

    const seeMoreBtn = document.getElementById("seeMoreBtn");
    seeMoreBtn.addEventListener("click", () => {
      displayBeerDetailsPage(beer);
    });
}

const displayBeerDetailsPage = () => {

}