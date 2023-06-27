export async function onRequest(context) {
    const request = context.request || {};
    const auth_token = 'DXh7xajb97HS3TSA4TIv11m-pwwSveIG';

    if ((request.method || 'GET') !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const url = new URL(request.url || '');
    const campaignID = url.searchParams.get('id') || '';
    const timezone = url.searchParams.get('timezone') || 'UTC';

    if (!campaignID) {
        return new Response('Missing id', { status: 400 });
    }

    const apiUrl = `https://api.shneurnovack.com/items/mitzvas?filter[campaign][_eq]=${campaignID}`;
    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${auth_token}`
            }
        });
        const apiData = await apiRes.json();

        // Process each data item and format the output
        const responseData = apiData.data.map(mitzvah => ({
            id: mitzvah.id,
            first_name: mitzvah.first_name,
            last_name: mitzvah.last_name,
            first_last_name: mitzvah.anonymous ? "Anonymous" : `${mitzvah.first_name} ${mitzvah.last_name}`,
            anonymous: mitzvah.anonymous,
            mitzvah: mitzvah.mitzvah,
            campaign: mitzvah.campaign,
            amount: mitzvah.amount,
            team: mitzvah.team,
            time: mitzvah.timestamp ? new Date(mitzvah.timestamp).toLocaleString("en-US", {timeZone: timezone}) : null
        }));

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(`Error calling API: ${error.toString()}`, { status: 500 });
    }
}
