// donations.js
export async function onRequest(context) {
    const request = context.request;
  
    if (request.method !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }
  
    const url = new URL(request.url);
    const campaignIDsParam = url.searchParams.get('id');
    const timezone = url.searchParams.get('timezone') || 'UTC'; // Default to UTC if no timezone is provided

    if (!campaignIDsParam) {
        return new Response('Missing campaign id', { status: 400 });
    }

    const campaignIDs = campaignIDsParam.split(',');

    const allDonations = [];

    for (const campaignID of campaignIDs) {
        const limit = 100;
        let lastDonationID = null;

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
                    const formattedDate = date.toLocaleString('en-US', { timeZone: timezone });
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

            } catch (error) {
                return new Response('Error calling API', { status: 500 });
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
        headers: { 'Content-Type': 'application/json' },
    });
}
  
// Helper function to get key by value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// Analysis functions
function analyzePeakTimes(times, days) {
    const timesOccurrences = {};
    const daysOccurrences = {};

    times.forEach(time => {
        if (timesOccurrences[time]) {
            timesOccurrences[time]++;
        } else {
            timesOccurrences[time] = 1;
        }
    });

    days.forEach(day => {
        if (daysOccurrences[day]) {
            daysOccurrences[day]++;
        } else {
            daysOccurrences[day] = 1;
        }
    });

    const maxTimesOccurrences = Math.max(...Object.values(timesOccurrences));
    const topActiveHour = getKeyByValue(timesOccurrences, maxTimesOccurrences);
    delete timesOccurrences[topActiveHour];

    const secondMaxTimesOccurrences = Math.max(...Object.values(timesOccurrences));
    const secondActiveHour = getKeyByValue(timesOccurrences, secondMaxTimesOccurrences);
    delete timesOccurrences[secondActiveHour];

    const thirdMaxTimesOccurrences = Math.max(...Object.values(timesOccurrences));
    const thirdActiveHour = getKeyByValue(timesOccurrences, thirdMaxTimesOccurrences);

    const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const maxDaysOccurrences = Math.max(...Object.values(daysOccurrences));
    const mostActiveDay = dayLabels[getKeyByValue(daysOccurrences, maxDaysOccurrences)];

    return {
        "most_active_hours": {
            "top_active_hour": convertHourTo12HourFormat(topActiveHour),
            "second_active_hour": convertHourTo12HourFormat(secondActiveHour),
            "third_active_hour": convertHourTo12HourFormat(thirdActiveHour)
        },
        "most_active_day": mostActiveDay
    }
}

function convertHourTo12HourFormat(hour) {
    hour = Number(hour);
    if (hour === 0) {
        return "12 AM";
    } else if (hour < 12) {
        return `${hour} AM`;
    } else if (hour === 12) {
        return "12 PM";
    } else {
        return `${hour - 12} PM`;
    }
}

function analyzeTopDonations(donations) {
    donations.sort((a, b) => b.amount - a.amount);
    return donations.slice(0, 3);
}

function analyzeAverageDonation(donationAmounts) {
    const total = donationAmounts.reduce((total, num) => total + num);
    const averageAmount = total / donationAmounts.length;

    return {
        "average_amount": averageAmount,
        "currency": "USD"
    }
}

function analyzeProcessingFeeCoverage(donations) {
    const totalDonations = donations.length;
    const coveredCount = donations.filter(donation => donation.covered_processing_fee).length;

    return {
        "percentage_covered": (coveredCount / totalDonations) * 100
    }
}
