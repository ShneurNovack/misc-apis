export async function onRequest(context) {
    const request = context.request || {};
    const auth_token = 'DXh7xajb97HS3TSA4TIv11m-pwwSveIG';

    if ((request.method || 'GET') !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const url = new URL(request.url || '');

    let apiUrl = `https://api.shneurnovack.com/items/categories`;

    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${auth_token}`,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
        const apiData = await apiRes.json();

        // Process each data item and format the output
        const responseData = apiData.data.map(item => ({
            id: item.id,
            name: item.name,
        }));

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(`Error calling API: ${error.toString()}`, { status: 500 });
    }
}
