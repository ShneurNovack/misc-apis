export async function onRequest(context) {
    const request = context.request || {};
    const auth_token = 'DXh7xajb97HS3TSA4TIv11m-pwwSveIG';

    if ((request.method || 'GET') !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const url = new URL(request.url || '');
    const campaignID = url.searchParams.get('id') || '';

    if (!campaignID) {
        return new Response('Missing id', { status: 400 });
    }

    const apiUrl = `https://api.shneurnovack.com/items/teams?filter[campaign][_eq]=${campaignID}&fields=*,pledges.amount`;
    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${auth_token}`
            }
        });
        const apiData = await apiRes.json();

        // Process each data item and format the output
        const responseData = apiData.data.map(team => {
            const totalPledges = team.pledges.reduce((total, pledge) => total + pledge.amount, 0);
            const percentComplete = ((totalPledges / team.goal) * 100).toFixed(2) + '%';
            return {
                id: team.id,
                name: team.name,
                goal: team.goal,
                percent_complete: percentComplete,
                description: team.description,
                campaign: team.campaign,
            };
        });

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(`Error calling API: ${error.toString()}`, { status: 500 });
    }
}
