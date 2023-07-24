export async function onRequest(context) {
    const request = context.request;
    const auth_token = 'DXh7xajb97HS3TSA4TIv11m-pwwSveIG';

    if ((request.method || 'GET') !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const apiUrl = 'https://api.shneurnovack.com/items/mitzvas';
    const url = new URL(request.url);
    const queryParams = url.searchParams;

    const requestBody = {
        first_name: queryParams.get('first_name'),
        last_name: queryParams.get('last_name'),
        anonymous: queryParams.get('anonymous') === 'true',
        email: queryParams.get('email'),
        mitzvah: queryParams.get('mitzvah'),
        campaign: Number(queryParams.get('campaign')),
        amount: Number(queryParams.get('amount')),
        team: Number(queryParams.get('team')),
        timestamp: queryParams.get('timestamp')
    };

    try {
        const apiRes = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
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
