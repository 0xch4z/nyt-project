/**
 * Make Query
 * @param {string} term The search term
 * @param {number} quantity Quantity of posts
 * @param {string} startYear Optional
 * @param {string} endYear Optional
 * @returns {string} The query url
 */
function makeQuery(term, quantity, startYear, endYear) {
  const baseUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  let url = `${baseUrl}?q=${term}&fq=${quantity}`;
  if (startYear) url += `&begin_date=${startYear}`;
  if (endYear) url += `&end_date=${endYear}`;
  return url;
}

/**
 * Fetch Articles
 * @param {string} url
 */
function fetchArticles(url) {
  // make ajax request
  $('results').empty();
  $.getJSON(url, handleRequest);
}

/**
 * Handle request
 * @param {object} response 
 */
function handleRequest(response) {
  // get data from response object
  const results = response.docs;
  // iterate over results
  for (const result of results) {
    const heading = result.headline.main;
    const byLine = result.byLine;
    const section = result.section_name;
    const timestamp = result.pub_date;
    const url = result.web_url;
    // make result element
    const resultFragment = $(`
      <div class="result">
        <a href="${url}">
          <h3 class="heading">${heading}</h3>
        </a>
        <p class="by-line">${byLine}</p>
        <p class="section">Section: ${section}</p>
        <p class="timestamp">${timestamp}</p>
      </div>
    `);
    $('#results').append(resultFragment);
  }
}

$('#search-form').on('submit', function(e) {
  e.preventDefault();
  const values = $(this).serialize();
  const query = makeQuery(
    values.term,
    values.quantity || 5,
    values.startYear,
    values.endYear
  );
  fetchArticles(query);
});