// donations.js
export async function onRequest(context) {
    const request = context.request;
    
    if (request.method !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }
  
    const url = new URL(request.url);
    const campaignID = url.searchParams.get('id');

    if (!campaignID) {
        return new Response('Missing campaign id', { status: 400 });
    }

    const api_url = `https://api.charidy.com/api/v1/campaign/${campaignID}/donations?limit=100`;

    try {
        const apiRes = await fetch(api_url);
        const data = await apiRes.json();

        const result = data.data.map(donation => {
            return {
                "donor_name": donation.attributes.name,
                "time": donation.attributes.created_at,
                "amount": donation.attributes.total,
                "currency": donation.attributes.currency_code,
                "covered_processing_fee": donation.attributes.covered_processing_fee
            }
        });

        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response('Error calling API', { status: 500 });
    }
}
