export async function onRequest(context) {
    const combinedData = [];

    for (let chabadId = 1; chabadId <= 101; chabadId++) {
        const apiUrl = `https://shneurcors.herokuapp.com/https://api.chabadoncampus.org/api/1.0/RsvpEnrollments/${chabadId}/EventSchedules?occurrenceStatus=Upcoming`;
        
        try {
            const apiRes = await fetch(apiUrl, {
                headers: {
                    'chabad': `true`
                }
            });

            if (!apiRes.ok) {
                continue; // Skip if the response is not OK
            }

            const apiData = await apiRes.json();
            combinedData.push(...apiData.payload.results);
        } catch (error) {
            // Log the error but continue processing other IDs
            console.log(`Error fetching data for CHABAD-ID ${chabadId}: ${error}`);
        }
    }

    return new Response(JSON.stringify(combinedData), {
        headers: { 'Content-Type': 'application/json' },
    });
}
