import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Authenticating with https://asianmix.ie...');
  const initialRes = await fetch('https://asianmix.ie/password');
  const initCookie = initialRes.headers.get('set-cookie') || '';

  const formParams = new URLSearchParams();
  formParams.append('form_type', 'storefront_password');
  formParams.append('utf8', '✓');
  formParams.append('password', '1234');
  formParams.append('commit', 'Enter');

  const loginRes = await fetch('https://asianmix.ie/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': initCookie,
    },
    body: formParams.toString(),
    redirect: 'manual',
  });

  const authCookie = loginRes.headers.get('set-cookie') || initCookie;
  console.log('✅ Authenticated successfully!');

  const headers = {
    'Cookie': authCookie,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  };

  const collections = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'raw_collections.json'), 'utf8')
  );

  console.log(`Mapping ${collections.length} collections...`);
  const collectionProductMap: Record<string, number[]> = {};
  const productCollectionMap: Record<number, string[]> = {};

  for (const col of collections) {
    let page = 1;
    collectionProductMap[col.handle] = [];

    while (true) {
      const res = await fetch(
        `https://asianmix.ie/collections/${col.handle}/products.json?limit=250&page=${page}`,
        { headers }
      );

      if (!res.ok) {
        console.error(`Failed to fetch ${col.handle} page ${page}: ${res.status}`);
        break;
      }

      const data: any = await res.json();
      if (!data.products || data.products.length === 0) break;

      for (const p of data.products) {
        collectionProductMap[col.handle].push(p.id);
        if (!productCollectionMap[p.id]) {
          productCollectionMap[p.id] = [];
        }
        if (!productCollectionMap[p.id].includes(col.handle)) {
          productCollectionMap[p.id].push(col.handle);
        }
      }

      if (data.products.length < 250) break;
      page++;
    }

    console.log(`  -> Found ${collectionProductMap[col.handle].length} products in "${col.title}" (${col.handle})`);
  }

  fs.writeFileSync(
    path.join(__dirname, 'data', 'collection_product_map.json'),
    JSON.stringify({ collectionProductMap, productCollectionMap }, null, 2)
  );

  console.log('✅ Finished mapping collections to products!');

  const allProducts = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'raw_products.json'), 'utf8')
  );
  let mappedCount = 0;
  let unmapped: any[] = [];
  for (const p of allProducts) {
    if (productCollectionMap[p.id] && productCollectionMap[p.id].length > 0) {
      mappedCount++;
    } else {
      unmapped.push({ id: p.id, title: p.title, type: p.product_type });
    }
  }

  console.log(`Total Products in Store: ${allProducts.length}`);
  console.log(`Mapped to Collections: ${mappedCount}`);
  console.log(`Unmapped to Collections: ${unmapped.length}`);
}

main().catch(console.error);
