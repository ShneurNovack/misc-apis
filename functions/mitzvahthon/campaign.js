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

    const apiUrl = `https://api.shneurnovack.com/items/mitzvah_campaigns/${campaignID}?fields=mitzvahs.*,campaign_name,goal`;
    try {
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${auth_token}`
            }
        });
        const apiData = await apiRes.json();

        // Compute the percentage complete and mitzvahs count
        const totalAmount = apiData.data.mitzvahs.reduce((sum, mitzvah) => sum + mitzvah.amount, 0);
        const percentComplete = ((totalAmount / Number(apiData.data.goal)) * 100).toFixed(2) + '%';
        const mitzvahsAmount = totalAmount.toString();

        // Construct the response object
        const response = {
            data: {
                campaign_name: apiData.data.campaign_name,
                goal: apiData.data.goal,
                precent_complete: percentComplete,
                mitzvahs_amount: mitzvahsAmount,
            }
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(`Error calling API: ${error.toString()}`, { status: 500 });
    }
}
