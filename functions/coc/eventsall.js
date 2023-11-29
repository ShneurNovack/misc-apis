export async function onRequest(context) {
    const fetchPromises = [];

    for (let chabadId = 1; chabadId <= 101; chabadId++) {
        const apiUrl = `https://api.chabadoncampus.org/api/1.0/RsvpEnrollments/${chabadId}/EventSchedules?occurrenceStatus=Upcoming`;
        fetchPromises.push(
            fetch(apiUrl)
            .then(response => response.ok ? response.json() : Promise.reject(`Failed with status ${response.status}`))
            .catch(error => console.log(`Error fetching data for CHABAD-ID ${chabadId}: ${error}`))
        );
    }

    try {
        const allResults = await Promise.all(fetchPromises);
        const combinedData = allResults.reduce((accumulator, current) => {
            if (current && current.payload && current.payload.results) {
                return accumulator.concat(current.payload.results);
            }
            return accumulator;
        }, []);

        // Sort the events by date
        combinedData.sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));

        return new Response(JSON.stringify(combinedData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(`Error processing requests: ${error.toString()}`, { status: 500 });
    }
}
