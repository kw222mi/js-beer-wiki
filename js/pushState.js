/**
 * Push state to history
 */
export const pushRandomBeerState = (randomBeer) => {
  const state = {
    view: "randomBeer",
    searchData: {
      searchTerm: "",
      searchResults: [],
    },
    randomBeerData: {
      randomBeer: randomBeer,
    },
  };
  history.pushState(state, "", "");
};

export const pushBeerDetailsState = (beer) => {
  const state = {
    view: "beerDetails",
    searchData: {
      searchTerm: "",
      searchResults: [],
    },
    randomBeerData: {
      randomBeer: beer,
    },
  };
  history.pushState(state, "", "");
};

export const pushSearchState = (modifiedSearchTerm, searchResults) => {
  const state = {
    view: "searchResults",
    searchData: {
      searchTerm: modifiedSearchTerm,
      searchResults: searchResults,
    },
    randomBeerData: {
      randomBeer: null,
    },
  };
  history.pushState(state, "", "");
};
