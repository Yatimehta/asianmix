import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Authenticating with https://asianmix.ie using store password...');

  // 1. Initial request to get session cookies
  const initialRes = await fetch('https://asianmix.ie/password');
  const setCookies = initialRes.headers.get('set-cookie') || '';

  // 2. Post password
  const formParams = new URLSearchParams();
  formParams.append('form_type', 'storefront_password');
  formParams.append('utf8', '✓');
  formParams.append('password', '1234');
  formParams.append('commit', 'Enter');

  const loginRes = await fetch('https://asianmix.ie/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': setCookies,
    },
    body: formParams.toString(),
    redirect: 'manual',
  });

  const authCookies = loginRes.headers.get('set-cookie') || setCookies;
  console.log('✅ Logged in to asianmix.ie. Cookie acquired.');

  const headers = {
    'Cookie': authCookies,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
  };

  // 3. Fetch all collections
  console.log('📦 Fetching collections...');
  let collections: any[] = [];
  let colPage = 1;
  while (true) {
    const colRes = await fetch(`https://asianmix.ie/collections.json?limit=250&page=${colPage}`, { headers });
    if (!colRes.ok) break;
    const colData: any = await colRes.json();
    if (!colData.collections || colData.collections.length === 0) break;
    collections.push(...colData.collections);
    if (colData.collections.length < 250) break;
    colPage++;
  }
  console.log(`✅ Retrieved ${collections.length} collections.`);

  // 4. Fetch navigation menu from homepage
  console.log('🧭 Fetching storefront homepage HTML for navigation structure...');
  const homeRes = await fetch('https://asianmix.ie/', { headers });
  const homeHtml = await homeRes.text();

  // 5. Fetch all products with pagination
  console.log('🛒 Fetching all products from /products.json...');
  let products: any[] = [];
  let prodPage = 1;
  while (true) {
    console.log(`   Fetching products page ${prodPage}...`);
    const prodRes = await fetch(`https://asianmix.ie/products.json?limit=250&page=${prodPage}`, { headers });
    if (!prodRes.ok) {
      console.error(`Failed to fetch page ${prodPage}: HTTP ${prodRes.status}`);
      break;
    }
    const prodData: any = await prodRes.json();
    if (!prodData.products || prodData.products.length === 0) break;
    products.push(...prodData.products);
    console.log(`   Page ${prodPage}: got ${prodData.products.length} products (running total: ${products.length})`);
    if (prodData.products.length < 250) break;
    prodPage++;
  }

  console.log(`🎉 Total real products fetched: ${products.length}`);

  // Save raw data for inspection
  const outDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'raw_collections.json'), JSON.stringify(collections, null, 2));
  fs.writeFileSync(path.join(outDir, 'raw_products.json'), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(outDir, 'homepage.html'), homeHtml);

  console.log(`💾 Saved data to ${outDir}`);
}

main().catch(console.error);
