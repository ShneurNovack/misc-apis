// index.js
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

    try {
        const response1 = await fetch(`https://api.reshapecreative.com/analyzedonations?id=${campaignIDsParam}&timezone=${timezone}`);
        const data1 = await response1.json();
      
        const response2 = await fetch(`https://misc-api-1fl.pages.dev/openai.json`);
        const data2 = await response2.json();
        const openai_key = data2.openai_key;
      
        const chatGptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openai_key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'Response Format:
keep the "why" section to a 3 sentence minimum and the "tip" sections to 2.
Your response MUST be in the following JSON format and nothing else:' + JSON.stringify(data1)
                    }
                ],
                'temperature': 0.7
            })
        });
      
        const chatGptData = await chatGptResponse.json();
      
        const finalOutput = JSON.parse(chatGptData.choices[0].message.content);

        return new Response(JSON.stringify(finalOutput), {
            headers: { 'Content-Type': 'application/json' },
        });
      
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}
