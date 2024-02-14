export async function onRequest(context) {
    const apiUrls = [
        "https://api.reshapecreative.com/seinfeld/seinfeld1.json",
        "https://api.reshapecreative.com/seinfeld/seinfeld2.json",
        "https://api.reshapecreative.com/seinfeld/seinfeld3.json",
        "https://api.reshapecreative.com/seinfeld/seinfeld4.json"
    ];

    const fetchPromises = apiUrls.map(url =>
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                if (!data || !Array.isArray(data.quotes)) {
                    console.log(`No quotes found in data from ${url}`);
                    return [];
                }
                return data.quotes;
            })
            .catch(error => {
                console.error(`Error fetching or parsing data for ${url}: ${error}`);
                return []; // Return an empty array to keep the structure
            })
    );

    try {
        const results = await Promise.all(fetchPromises);
        // Flatten the array of arrays into a single array of quotes
        const combinedQuotes = results.flat();

        return new Response(JSON.stringify({quotes: combinedQuotes}), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(`Error processing requests: ${error.toString()}`, { status: 500 });
    }
}
