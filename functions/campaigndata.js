// campaigndata.js
export async function onRequest(context) {
    const request = context.request;

    if (request.method !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const allDonations = [];

    try {
        const campaignRes = await fetch('https://api.charidy.com/api/v1/categories/campaigns?search=chabad&limit=3');
        const campaignData = await campaignRes.json();
        const campaignIDs = campaignData.data.map(campaign => campaign.attributes.campaign_id);

        for (const campaignID of campaignIDs) {
            const limit = 100;
            let lastDonationID = null;

            while (true) {
                let api_url = `https://api.charidy.com/api/v1/campaign/${campaignID}/donations?limit=${limit}`;
                if (lastDonationID) {
                    api_url += `&fromDonationID=${lastDonationID}`;
                }

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

                allDonations.push(...result);

                lastDonationID = data.data[data.data.length - 1].id;

                if (data.data.length < limit) {
                    break;
                }
            }
        }

        const donationTimes = allDonations.map(donation => new Date(donation.time).getHours());
        const donationDays = allDonations.map(donation => new Date(donation.time).getDay());
        const donationAmounts = allDonations.map(donation => donation.amount);

        const peakDonationTimes = analyzePeakTimes(donationTimes, donationDays);
        const topDonations = analyzeTopDonations(allDonations);
        const averageDonationAmount = analyzeAverageDonation(donationAmounts);
        const processingFeeCoverage = analyzeProcessingFeeCoverage(allDonations);

        const result = {
            "analysis_results": {
                "peak_donation_times": peakDonationTimes,
                "top_donations": topDonations,
                "average_donation_amount": averageDonationAmount,
                "processing_fee_coverage": processingFeeCoverage
            }
        };

        return new Response(JSON.stringify(result), {
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
    return new Response(`Error calling API: ${error.message}`, { status: 500 });
    }
}

function analyzePeakTimes(donationTimes, donationDays) {
    const hoursFrequency = new Array(24).fill(0);
    donationTimes.forEach(time => hoursFrequency[time]++);
    const daysFrequency = new Array(7).fill(0);
    donationDays.forEach(day => daysFrequency[day]++);

    const topHours = hoursFrequency.map((freq, index) => ({ hour: index, freq })).sort((a, b) => b.freq - a.freq);
    const topDays = daysFrequency.map((freq, index) => ({ day: index, freq })).sort((a, b) => b.freq - a.freq);

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
        "most_active_hours": {
            "top_active_hour": formatHour(topHours[0].hour),
            "second_active_hour": formatHour(topHours[1].hour),
            "third_active_hour": formatHour(topHours[2].hour)
        },
        "most_active_day": weekdays[topDays[0].day]
    }
}

function analyzeTopDonations(allDonations) {
    return allDonations.sort((a, b) => b.amount - a.amount).slice(0, 3);
}

function analyzeAverageDonation(donationAmounts) {
    const total = donationAmounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / donationAmounts.length;
    return {
        "average_amount": Math.round(average * 100) / 100,
        "currency": "USD"
    }
}

function analyzeProcessingFeeCoverage(allDonations) {
    const coveredCount = allDonations.filter(donation => donation.covered_processing_fee).length;
    const percentage = Math.round(coveredCount / allDonations.length * 100);
    return {
        "percentage_covered": percentage
    }
}

function formatHour(hour) {
    if (hour === 0) {
        return '12 AM';
    } else if (hour < 12) {
        return `${hour} AM`;
    } else if (hour === 12) {
        return '12 PM';
    } else {
        return `${hour - 12} PM`;
    }
}
