export async function onRequest(context) {
    const request = context.request;
    const auth_token = 'DXh7xajb97HS3TSA4TIv11m-pwwSveIG';

    // Check if the request method is POST
    if ((request.method || 'GET') !== 'POST') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const apiUrl = 'https://api.shneurnovack.com/items/mitzvas';

    try {
        // Fetch the API URL with the request body forwarded
        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
            body: await request.clone().text()
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
