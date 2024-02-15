
export function createbeerDetailsHTML(beer,hopsList) {
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

  return beerDetailsHTML;
}

