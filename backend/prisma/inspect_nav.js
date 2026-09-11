const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'data', 'homepage.html'), 'utf8');

// Find all collection links in header / nav
const regex = /href="(\/collections\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
const links = [];
while ((match = regex.exec(html)) !== null) {
  const href = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim();
  if (text && !links.find(l => l.href === href)) {
    links.push({ href, text });
  }
}

console.log('=== Storefront Menu Links Found in HTML ===');
links.forEach(l => console.log(`${l.text} -> ${l.href}`));

// Also check collections from raw_collections.json
const collections = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'raw_collections.json'), 'utf8'));
console.log('\n=== All 16 Collections in Shopify ===');
collections.forEach(c => console.log(`[${c.id}] ${c.title} (${c.handle}) - ${c.products_count} items`));
