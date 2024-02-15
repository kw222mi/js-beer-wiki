export function createSearchFormHTML() {
  // HTML template for rendering a search form
  const searchFormHTML = `
    <form id="searchForm">
      <input type="text" id="searchInput" placeholder="Search beer...">
      <button type="submit">Search</button>
    </form>
    <div id="searchResults"></div>
  `;

  return searchFormHTML;
}


