// analyzedonations.js
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
                const date = new Date(donation.attributes.created_at * 1000);
                const formattedDate = date.toLocaleString('en-US');
                return {
                    "donor_name": donation.attributes.name,
                    "time": formattedDate,
                    "amount": donation.attributes.real_payment,
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

    // Processing data and creating insights.
    const hoursMap = {};
    const daysMap = {};
    let totalDonations = 0;
    let totalProcessingFeeCoverage = 0;
    let topDonations = [null, null, null];

    for (const donation of allDonations) {
        const donationDate = new Date(donation.time);
        const hour = donationDate.getHours();
        const hour12format = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
        const day = donationDate.toLocaleDateString('en-US', { weekday: 'long' });

        hoursMap[hour12format] = (hoursMap[hour12format] || 0) + 1;
        daysMap[day] = (daysMap[day] || 0) + 1;
        totalDonations += donation.amount;
        if (donation.covered_processing_fee) {
            totalProcessingFeeCoverage += 1;
        }

        for (let i = 0; i < topDonations.length; i++) {
            if (!topDonations[i] || donation.amount > topDonations[i].amount) {
                topDonations.splice(i, 0, donation);
                break;
            }
        }
    }

    topDonations.length = 3;

    const sortedHours = Object.entries(hoursMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(hour => hour[0]);
    const sortedDays = Object.entries(daysMap).sort((a, b) => b[1] - a[1])[0][0];
    const averageDonation = totalDonations / allDonations.length;
    const percentageCovered = totalProcessingFeeCoverage / allDonations.length * 100;

    const response = {
        "analysis_results": {
            "peak_donation_times": {
                "most_active_hours": {
                    "top_active_hour": sortedHours[0],
                    "second_active_hour": sortedHours[1],
                    "third_active_hour": sortedHours[2]
                },
                "most_active_day": sortedDays
            },
            "top_donations": topDonations,
            "average_donation_amount": {
                "average_amount": averageDonation,
                "currency": allDonations[0]?.currency || 'USD'
            },
            "processing_fee_coverage": {
                "percentage_covered": percentageCovered
            }
        }
    };

    return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
