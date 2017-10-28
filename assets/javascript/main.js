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
  const key = 'f667637ebe0841daa7a88e80ce76b304'
  let url = `${baseUrl}?api-key=${key}&q=${term}&fq=${quantity}`;
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
  $('#results').empty();
  $.getJSON(url, handleRequest);
}

/**
 * Handle request
 * @param {object} response
 */
function handleRequest(response) {
  // get data from response object
  const results = response.response.docs;
  // iterate over results
  for (const result of results) {
    const heading = result.headline.main;
    const byLine = result.byline.original;
    const section = result.section_name || 'None';
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
  // prevent refresh
  e.preventDefault();
  // format values to json
  let values = {}
  $(this).serializeArray().map(function(x){
    values[x.name] = x.value;
  })
  console.log(values)
  // make query
  const query = makeQuery(
    values.search_term,
    values.result_quantity || 5,
    values.start_year,
    values.end_year
  );
  // fetch articles
  fetchArticles(query);
});

$('#clear').on('click', function() {
  $('#results').empty()
})
