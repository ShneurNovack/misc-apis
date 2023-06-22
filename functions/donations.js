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

    const limit = 100;
    let lastDonationID = null;
    let allDonations = [];

    while (true) {
        let api_url = `https://api.charidy.com/api/v1/campaign/${campaignID}/donations?limit=${limit}`;
        if (lastDonationID) {
            api_url += `&fromDonationID=${lastDonationID}`;
        }

        try {
            const apiRes = await fetch(api_url);
            const data = await apiRes.json();

            if (data.data.length === 0) {
                break;
            }

            const result = data.data.map(donation => {
                return {
                    "donor_name": donation.attributes.name,
                    "time": donation.attributes.created_at,
                    "amount": donation.attributes.total,
                    "currency": donation.attributes.currency_code,
                    "covered_processing_fee": donation.attributes.covered_processing_fee
                }
            });

            allDonations = allDonations.concat(result);

            lastDonationID = data.data[data.data.length - 1].id;

            if (data.data.length < limit) {
                break;
            }

        } catch (error) {
            return new Response('Error calling API', { status: 500 });
        }
    }

    return new Response(JSON.stringify(allDonations), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
