addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const rssText = await fetch('https://www.chabad.org/tools/rss/parsha_rss.xml').then(res => res.text());
  const parser = new DOMParser();
  const rssDocument = parser.parseFromString(rssText, 'application/xml');

  let json = { 'channel': {} };
  let channel = rssDocument.children[0].children[0];
  for(let i = 0; i < channel.children.length; i++) {
    let current = channel.children[i];
    switch(current.tagName) {
      case 'title':
      case 'link':
      case 'description':
      case 'copyright':
      case 'lastBuildDate':
      case 'pubDate':
        json['channel'][current.tagName] = current.textContent;
        break;
      case 'image':
        let image = {};
        for(let j = 0; j < current.children.length; j++) {
          let imgCurrent = current.children[j];
          image[imgCurrent.tagName] = imgCurrent.textContent;
        }
        json['channel']['image'] = image;
        break;
      case 'item':
        if(!json['channel']['items']) json['channel']['items'] = [];
        let item = {};
        for(let j = 0; j < current.children.length; j++) {
          let itemCurrent = current.children[j];
          item[itemCurrent.tagName] = itemCurrent.textContent;
        }
        json['channel']['items'].push(item);
        break;
    }
  }

  return new Response(JSON.stringify(json), { headers: { 'content-type': 'application/json' } });
}
