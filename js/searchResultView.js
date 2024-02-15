
export function searchResultView(results) {
  const totalResults = results.length;
  const itemsPerPage = 10;
  let currentPage = 1;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const slicedResults = results.slice(start, end);
  // Create a list with seachresults
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
  return html + paginationHTML;
};