async function fetchAllQuotes() {
  const urls = [
    'https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld1.json',
    'https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld2.json',
    'https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld3.json',
    'https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld4.json'
  ];

  try {
    // Fetch all URLs concurrently with error handling for each request
    const responses = await Promise.all(urls.map(url => 
      fetch(url).then(response => response.json().catch(error => {
        console.error(`Error parsing JSON from ${url}:`, error);
        return null; // Return null or an appropriate error indicator for this URL
      }))
      .catch(error => {
        console.error(`Error fetching ${url}:`, error);
        return null; // Return null or an appropriate error indicator for this URL
      })
    ));

    // Filter out any failed fetches or JSON parses and combine the quotes arrays
    const combinedQuotes = responses.reduce((acc, current) => {
      if (current && current.quotes) {
        acc.quotes = acc.quotes.concat(current.quotes);
      }
      return acc;
    }, { quotes: [] }); // Initial accumulator with an empty quotes array

    // Now combinedQuotes contains all successfully fetched quotes
    return combinedQuotes;
  } catch (error) {
    console.error('Unexpected error:', error);
    return { quotes: [] }; // Return an empty structure in case of overall failure
  }
}

// Example of using the function
fetchAllQuotes().then(data => {
  console.log(data); // `data` will contain combined quotes, excluding any that resulted in errors
});
