export async function onRequest(context) {
  const request = context.request;

  if (request.method !== 'GET') {
    return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
  }

  const url = new URL(request.url);
  const campaignIDsParam = url.searchParams.get('id');

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

      } catch (error) {
        return new Response('Error calling API', { status: 500 });
      }
    }
  }

  // Analyzing the donations

  const hours = Array(24).fill(0);
  const days = Array(7).fill(0);
  let totalDonation = 0;
  let totalCovered = 0;
  
  allDonations.sort((a, b) => b.amount - a.amount);

  for (let donation of allDonations) {
    const date = new Date(donation.time);
    hours[date.getHours()] += 1;
    days[date.getDay()] += 1;
    totalDonation += donation.amount;
    if (donation.covered_processing_fee) {
      totalCovered += 1;
    }
  }

  const topActiveHourIndices = getTopThreeIndices(hours);
  const mostActiveDayIndex = days.indexOf(Math.max(...days));

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hourSuffix = ["AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM"];
  
  const analysisResults = {
    "peak_donation_times": {
      "most_active_hours": {
        "top_active_hour": `${(topActiveHourIndices[0] + 1) % 12 || 12} ${hourSuffix[topActiveHourIndices[0]]}`,
        "second_active_hour": `${(topActiveHourIndices[1] + 1) % 12 || 12} ${hourSuffix[topActiveHourIndices[1]]}`,
        "third_active_hour": `${(topActiveHourIndices[2] + 1) % 12 || 12} ${hourSuffix[topActiveHourIndices[2]]}`
      },
      "most_active_day": weekdays[mostActiveDayIndex]
    },
    "top_donations": allDonations.slice(0, 3),
    "average_donation_amount": {
      "average_amount": totalDonation / allDonations.length,
      "currency": allDonations[0].currency
    },
    "processing_fee_coverage": {
      "percentage_covered": totalCovered / allDonations.length * 100
    }
  };

  return new Response(JSON.stringify({ analysis_results: analysisResults }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function getTopThreeIndices(arr) {
  let first = second = third = -Infinity;
  let firstIndex = secondIndex = thirdIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > first) {
      third = second;
      second = first;
      first = arr[i];

      thirdIndex = secondIndex;
      secondIndex = firstIndex;
      firstIndex = i;
    } else if (arr[i] > second) {
      third = second;
      second = arr[i];

      thirdIndex = secondIndex;
      secondIndex = i;
    } else if (arr[i] > third) {
      third = arr[i];
      thirdIndex = i;
    }
  }

  return [firstIndex, secondIndex, thirdIndex];
}
