export async function onRequest(context) {
    const combinedData = [];

    for (let chabadId = 1; chabadId <= 101; chabadId++) {
        const apiUrl = `https://shneurcors.herokuapp.com/https://api.chabadoncampus.org/api/1.0/RsvpEnrollments/${chabadId}/EventSchedules?occurrenceStatus=Upcoming`;
        
        try {
            const apiRes = await fetch(apiUrl);

            if (!apiRes.ok) {
                console.log(`Request failed for CHABAD-ID ${chabadId}: ${apiRes.status}`);
                continue; // Skip if the response is not OK
            }

            const apiData = await apiRes.json();
            if (apiData && apiData.payload && apiData.payload.results) {
                combinedData.push(...apiData.payload.results);
            } else {
                console.log(`No valid data for CHABAD-ID ${chabadId}`);
            }
        } catch (error) {
            console.log(`Error fetching data for CHABAD-ID ${chabadId}: ${error}`);
        }
    }

    return new Response(JSON.stringify(combinedData), {
        headers: { 'Content-Type': 'application/json' },
    });
}
