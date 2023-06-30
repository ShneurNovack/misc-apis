export async function onRequest(context) {
    const request = context.request;
    const auth_token = 'DXh7xajb97HS3TSA4TIv11m-pwwSveIG';

    // Check if the request method is GET
    if ((request.method || 'GET') !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const apiUrl = 'https://api.shneurnovack.com/items/notes';

    const url = new URL(request.url);
    const title = url.searchParams.get('title');
    const body = url.searchParams.get('body');
    const category = url.searchParams.get('category');

    // Construct the JSON body from URL parameters
    const jsonBody = JSON.stringify({
        title: title,
        body: body,
        category: category
    });

    try {
        // Fetch the API URL with the JSON body constructed from URL parameters
        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
            body: jsonBody
        });

        const apiData = await apiRes.json();

        return new Response(JSON.stringify(apiData), {
            status: apiRes.status,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(`Error calling API: ${error.toString()}`, { status: 500 });
    }
}
