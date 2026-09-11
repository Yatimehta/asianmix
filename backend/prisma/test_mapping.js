const fs = require('fs');
const path = require('path');

const collections = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'raw_collections.json'), 'utf8'));
const colMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'real_collection_products.json'), 'utf8'));
const allProds = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'raw_products.json'), 'utf8'));

// Build reverse map: productId -> collection handles
const prodToCols = {};
for (const [handle, items] of Object.entries(colMap)) {
  for (const item of items) {
    if (!prodToCols[item.id]) prodToCols[item.id] = [];
    prodToCols[item.id].push(handle);
  }
}

// Fallback mapping by product_type
const typeToCol = {
  'Frozen Veg': 'fresh-and-frozen-vegetables',
  'Frozen Curry': 'fresh-and-frozen-vegetables',
  'Frozen Porotta': 'fresh-and-frozen-vegetables',
  'Frozen Samosa': 'fresh-and-frozen-vegetables',
  'Haldirams Frozen': 'fresh-and-frozen-vegetables',
  'Frozen Chapatti': 'fresh-and-frozen-vegetables',
  'Fish': 'fresh-and-frozen-vegetables',
  'Veg': 'fresh-and-frozen-vegetables',

  'Shan Masala': 'spices-whole-spice-powder-and-masalas',
  'Spice Powder': 'spices-whole-spice-powder-and-masalas',
  'Whole Spice': 'spices-whole-spice-powder-and-masalas',
  'Meat Masala': 'spices-whole-spice-powder-and-masalas',
  'Chicken Masala': 'spices-whole-spice-powder-and-masalas',
  'Fish Masala': 'spices-whole-spice-powder-and-masalas',
  'Veg Masala': 'spices-whole-spice-powder-and-masalas',
  'Salt': 'spices-whole-spice-powder-and-masalas',

  'Kerala Frozen Snacks': 'snacks-kerala-and-north-indian',
  'Kerala Snacks': 'snacks-kerala-and-north-indian',
  'North Indian Snacks': 'snacks-kerala-and-north-indian',

  'Jasmine Rice': 'rice-and-grains',
  'Ponni Rice': 'rice-and-grains',
  'Matta Rice': 'rice-and-grains',
  'Jeera Rice': 'rice-and-grains',
  'Glutinous Rice': 'rice-and-grains',
  'Pachari': 'rice-and-grains',
  'Idli Dosa Rice': 'rice-and-grains',
  'Jaya Rice': 'rice-and-grains',
  'Basmati Rice': 'biriyani-essential',
  'Biriyani Essences': 'biriyani-essential',

  'Atta': 'all-flour-1',
  'Puttu Podi': 'all-flour-1',
  'Rava': 'all-flour-1',
  'Broken Wheat': 'all-flour-1',
  'Corn Flour': 'all-flour-1',
  'Gram Flour': 'all-flour-1',
  'Maida': 'all-flour-1',
  'Rice Powder': 'all-flour-1',
  'Idli Dosa Podi': 'all-flour-1',
  'Palappam Podi': 'all-flour-1',

  'PH Sauces and Pastes': 'phillipino-product-snacks',
  'PH Seasoning Mix': 'phillipino-product-snacks',
  'PH Crisps and Snacks': 'phillipino-product-snacks',
  'PH Biscuits': 'phillipino-product-snacks',
  'PH Noodles': 'phillipino-product-snacks',
  'PH Can and Bottle': 'phillipino-product-snacks',
  'PH Coconut Milk': 'phillipino-product-snacks',

  'Variety Pickle': 'pickles-and-paste',
  'Lime Pickle': 'pickles-and-paste',
  'Mango Pickle': 'pickles-and-paste',
  'Pickles': 'pickles-and-paste',
  'Ginger Garlic Paste': 'pickles-and-paste',
  'Soy Sauce and Vinegar': 'pickles-and-paste',
  'Tamarind': 'pickles-and-paste',

  'Drinks': 'drinks',
  'Bournvita Boost Horlicks': 'drinks',
  'Coffee': 'drinks',
  'Tea': 'drinks',

  'Biscuits': 'rusk-biscuts-swet-and-dates',
  'Rusk': 'rusk-biscuts-swet-and-dates',
  'Packed sweets': 'rusk-biscuts-swet-and-dates',

  'Urad Dall': 'beans',
  'Toor Dall': 'beans',
  'Moong Dall': 'beans',
  'Chana Dall': 'beans',
  'Urad Whole': 'beans',
  'Dry Beans': 'beans',
  'Gram Beans': 'beans',
  'Peas': 'beans',
  'Seeds': 'beans',
  'Pulses': 'beans',

  'Cooking Oil': 'ghee-oil-and-payasam-product',
  'Ghee': 'ghee-oil-and-payasam-product',
  'Payasam Related': 'ghee-oil-and-payasam-product',
  'Jaggery Products': 'ghee-oil-and-payasam-product',
  'Coconut': 'ghee-oil-and-payasam-product',

  'Soap': 'personal-care-products',
  'Hair Oil': 'personal-care-products',
  'Hair Dye': 'personal-care-products',
  'Healthcare': 'personal-care-products',

  'Maggi Products': 'maggi-products',
  'Noodles': 'maggi-products',

  'Nuts and Dates': 'nuts-and-dates',

  'Household': 'classic-collection-and-over-the-counter',
  'Misc': 'classic-collection-and-over-the-counter',
  'No Type': 'classic-collection-and-over-the-counter',
  'Uncategorized': 'classic-collection-and-over-the-counter',
};

let mapped = 0;
let unmapped = [];
const colCount = {};

allProds.forEach(p => {
  let targetCol = null;
  if (prodToCols[p.id] && prodToCols[p.id].length > 0) {
    targetCol = prodToCols[p.id][0];
  } else if (p.product_type && typeToCol[p.product_type]) {
    targetCol = typeToCol[p.product_type];
  } else {
    targetCol = 'classic-collection-and-over-the-counter';
  }

  colCount[targetCol] = (colCount[targetCol] || 0) + 1;
  mapped++;
});

console.log(`\nSuccessfully mapped ${mapped} / ${allProds.length} products!`);
console.log('\nProducts per collection:');
for (const [handle, count] of Object.entries(colCount)) {
  const col = collections.find(c => c.handle === handle);
  console.log(`- ${col ? col.title : handle} (${handle}): ${count} products`);
}
