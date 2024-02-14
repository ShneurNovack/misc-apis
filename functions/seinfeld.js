export async function onRequest(context) {
    const apiUrls = [
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld1.json",
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld2.json",
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld3.json",
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld4.json"
    ];

    const fetchPromises = apiUrls.map(url => 
        fetch(url)
            .then(res => res.text()) // First get the response as text
            .then(text => {
                try {
                    return JSON.parse(text); // Try parsing as JSON
                } catch (error) {
                    console.error(`Error parsing JSON from URL ${url}: ${error}`);
                    return { quotes: [] }; // Return an empty quotes array on error
                }
            })
            .catch(error => console.error(`Error fetching data for URL ${url}: ${error}`))
    );

    try {
        const results = await Promise.all(fetchPromises);
        const combinedQuotes = results.reduce((acc, curr) => acc.concat(curr.quotes), []);

        return new Response(JSON.stringify({quotes: combinedQuotes}), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(`Error processing requests: ${error.toString()}`, { status: 500 });
    }
}
