export async function onRequest(context) {
  const request = new Request('https://www.chabad.org/tools/rss/parsha_rss.xml');
  const response = await fetch(request);
  const rssText = await response.text();
  
  const items = parseRSS(rssText);
  
  return new Response(JSON.stringify(items), {
    headers: { 'content-type': 'application/json' },
  });
}

function parseRSS(rssText) {
  let items = [];

  // Regular expression to match each item in the RSS feed.
  const itemRegex = /<item>([\s\S]*?)<\/item>/gm;
  
  let match;
  while (match = itemRegex.exec(rssText)) {
    const itemText = match[1];
    
    const title = getTextBetweenTags(itemText, 'title');
    const link = getTextBetweenTags(itemText, 'link');
    const description = getTextBetweenTags(itemText, 'description');
    const pubDate = getTextBetweenTags(itemText, 'dc:date');

    items.push({ title, link, description, pubDate });
  }
  
  return items;
}

function getTextBetweenTags(text, tag) {
  const regex = new RegExp(`<${tag}><!\\[CDATA\\[(.*?)\\]\\]><\/${tag}>`, 'gs');
  const match = regex.exec(text);
  return match ? match[1] : null;
}
