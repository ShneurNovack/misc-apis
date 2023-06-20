// worker.js
export async function onRequest(context) {
    const palm_url = 'https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage';
    const key_url = 'https://misc-api-1fl.pages.dev/openai.json';
    const request = context.request;

    if (request.method === 'POST') {
        try {
            const requestBody = await request.json();
            const inputMessages = requestBody.inputStr;

            // Transform the input JSON to the format expected by Google Palm
            const transformedMessages = inputMessages.map(message => ({
                author: message.author,
                content: message.content,
            }));

            const palmRequestBody = {
                temperature: 0.7,
                candidateCount: 1,
                prompt: {
                    context: "Respond using 4 sentences or less",
                    messages: transformedMessages,
                }
            };

            // Fetch the Google Palm key
            const keyResponse = await fetch(key_url);
            const keyData = await keyResponse.json();
            const googlepalm_key = keyData.googlepalm_key;

            // Append the key to the Palm API URL
            const palm_url_with_key = `${palm_url}?key=${googlepalm_key}`;

            const apiRes = await fetch(palm_url_with_key, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(palmRequestBody),
            });

            // Extract the candidate message content from the API response
            const apiData = await apiRes.json();
            const messageContent = apiData.candidates[0]?.content;

            // Pass the message content back to the browser
            return new Response(messageContent || 'No response from assistant', {
                status: apiRes.status,
                statusText: apiRes.statusText
            });

        } catch (error) {
            return new Response('Error calling API', { status: 500 });
        }
    } else {
        // If the method is not POST
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }
}
