// worker.js
export async function onRequest(context) {
    const openai_url = 'https://api.openai.com/v1/chat/completions';
    const request = context.request;

    if (request.method === 'POST') {
        try {
            const requestBody = await request.json();
            const inputMessages = requestBody.inputStr;

            // Transform the input JSON to the format expected by OpenAI
            const transformedMessages = inputMessages.map(message => ({
                role: message.role,
                content: message.content,
            }));

            const openaiRequestBody = {
                temperature: 0.7,
                model: "gpt-3.5-turbo",
                messages: transformedMessages,
            };

            const apiRes = await fetch(openai_url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify(openaiRequestBody),
            });

            // Pass the response back to the browser
            return new Response(apiRes.body, {
                status: apiRes.status,
                statusText: apiRes.statusText,
                headers: apiRes.headers
            });

        } catch (error) {
            return new Response('Error calling API', { status: 500 });
        }
    } else {
        // If the method is not POST
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }
}
