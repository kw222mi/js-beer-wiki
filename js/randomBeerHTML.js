export function createRandomBeerHTML(randomBeer) {
  // HTML template for displaying a beer
  const randomBeerHTML = `
   <div class="beer-card">
        <img src=${randomBeer[0].image_url} alt=${randomBeer[0].name} class="beer-img">
        <div class="random-beer-name">${randomBeer[0].name}</div>
        <button id="seeMoreBtn">See more</button>
     </div>
  `;

  return randomBeerHTML;
}
