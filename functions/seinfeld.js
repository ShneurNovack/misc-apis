export async function onRequest(context) {
    // URLs of the APIs
    const apiUrls = [
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld1.json",
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld2.json",
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld3.json",
        "https://shneurcors.herokuapp.com/https://api.reshapecreative.com/seinfeld/seinfeld4.json"
    ];

    // Fetch all APIs simultaneously
    const fetchPromises = apiUrls.map(url => fetch(url).then(res => res.json()));

    try {
        // Wait for all fetch operations to complete
        const results = await Promise.all(fetchPromises);

        // Combine the "quotes" arrays from each API's response
        const combinedQuotes = results.reduce((acc, curr) => {
            if (curr && curr.quotes) {
                return acc.concat(curr.quotes);
            }
            return acc;
        }, []);

        return new Response(JSON.stringify({quotes: combinedQuotes}), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(`Error fetching data: ${error.toString()}`, { status: 500 });
    }
}
