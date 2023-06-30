export async function onRequest(context) {
  const request = new Request('https://www.chabad.org/tools/rss/parsha_rss.xml');
  const response = await fetch(request);
  const rssText = await response.text();

  console.log(rssText);  // Add this line

  const items = parseRSS(rssText);

  return new Response(JSON.stringify(items), {
    headers: { 'content-type': 'application/json' },
  });
}

function parseRSS(rssText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while (match = itemRegex.exec(rssText)) {
    const itemText = match[1];
    const item = parseItem(itemText);
    items.push(item);
  }

  return items;
}

function parseItem(itemText) {
  const title = getTextBetweenTags(itemText, 'title');
  const link = getTextBetweenTags(itemText, 'link');
  const description = getTextBetweenTags(itemText, 'description');

  return { title, link, description };
}

function getTextBetweenTags(text, tag) {
  const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, 'i');
  const match = regex.exec(text);
  return match ? match[1].trim() : null;
}

function getTextBetweenCData(text, tag) {
  const regex = new RegExp(`<${tag}><!\\[CDATA\\[(.*?)\\]\\]><\/${tag}>`, 'i');
  const match = regex.exec(text);
  return match ? match[1].trim() : null;
}
