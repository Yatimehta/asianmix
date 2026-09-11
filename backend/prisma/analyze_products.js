const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'raw_products.json'), 'utf8'));

console.log('=== PRODUCT STRUCTURE ANALYSIS ===');
console.log('Sample product:', JSON.stringify(products[0], null, 2));

let withImages = 0;
let withDescription = 0;
let withVendor = 0;
let withType = 0;
let withPrice = 0;
let withCompareAtPrice = 0;
let withWeight = 0;

products.forEach(p => {
  if (p.images && p.images.length > 0) withImages++;
  if (p.body_html && p.body_html.trim()) withDescription++;
  if (p.vendor && p.vendor.trim()) withVendor++;
  if (p.product_type && p.product_type.trim()) withType++;
  if (p.variants && p.variants.length > 0) {
    if (p.variants[0].price) withPrice++;
    if (p.variants[0].compare_at_price) withCompareAtPrice++;
    if (p.variants[0].grams || p.variants[0].weight) withWeight++;
  }
});

console.log(`Total Products: ${products.length}`);
console.log(`With Images: ${withImages} / ${products.length}`);
console.log(`With Description: ${withDescription} / ${products.length}`);
console.log(`With Vendor: ${withVendor} / ${products.length}`);
console.log(`With Product Type: ${withType} / ${products.length}`);
console.log(`With Price: ${withPrice} / ${products.length}`);
console.log(`With Compare At Price: ${withCompareAtPrice} / ${products.length}`);
console.log(`With Weight (grams): ${withWeight} / ${products.length}`);
