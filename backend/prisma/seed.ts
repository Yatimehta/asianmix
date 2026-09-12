import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Helper to strip HTML tags for clean description
function cleanHtml(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log('🌱 Replacing Asianmix database with real Shopify catalog from asianmix.ie...');

  // 1. Delete all existing placeholder data in cascading order
  console.log('🧹 Clearing existing demo products, categories, cart and test orders...');
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Ensure Admin and Demo Customer accounts exist
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  let admin = await prisma.user.findUnique({ where: { email: 'admin@asianmix.ie' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@asianmix.ie',
        name: 'Asianmix Store Admin',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        phone: '+353 21 427 8899',
      },
    });
  }

  let customer = await prisma.user.findUnique({ where: { email: 'customer@example.ie' } });
  if (!customer) {
    customer = await prisma.user.create({
      data: {
        email: 'customer@example.ie',
        name: 'Sean Murphy',
        passwordHash: passwordHash,
        role: 'CUSTOMER',
        phone: '+353 87 123 4567',
      },
    });
  }

  console.log('✅ Retained Admin & Customer user accounts.');

  // 2. Load scraped raw data from asianmix.ie
  const dataDir = path.join(__dirname, 'data');
  const collectionsRaw = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'raw_collections.json'), 'utf8')
  );
  const productsRaw = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'raw_products.json'), 'utf8')
  );
  const colMap = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'real_collection_products.json'), 'utf8')
  );

  // 3. Create the 16 real Collections / Categories from asianmix.ie
  console.log(`📁 Creating ${collectionsRaw.length} real categories from asianmix.ie navigation/collections...`);
  const categoryDbMap: Record<string, any> = {}; // handle -> Category DB record

  const categoryImages: Record<string, string> = {
    'biriyani-essential': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Indiangatebasmati.jpg?v=1700756384',
    'beans': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/collections/Peas_lentils_beans.jpg?v=1704227200',
    'classic-collection-and-over-the-counter': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Bournvita.jpg?v=1701538806',
    'drinks': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/download.jpg?v=1718267006',
    'fresh-and-frozen-vegetables': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Greenchilli.jpg?v=1701202606',
    'ghee-oil-and-payasam-product': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6848.jpg?v=1626133901',
    'maggi-products': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6983.jpg?v=1626047863',
    'nuts-and-dates': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/5db73d34-bdde-447e-b868-d8e7ec1383d6.webp?v=1717845939',
    'personal-care-products': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6849.jpg?v=1626133903',
    'phillipino-product-snacks': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/WhatsApp_Image_2021-08-30_at_3.36.34_PM_1.jpg?v=1630356343',
    'pickles-and-paste': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/IMG_6808.jpg?v=1700684129',
    'rice-and-grains': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Pavizhammatta.jpg?v=1700683462',
    'all-flour-1': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6967.jpg?v=1626047841',
    'rusk-biscuts-swet-and-dates': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SoanPapdi.jpg?v=1700593680',
    'snacks-kerala-and-north-indian': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/SweetCheeda.jpg?v=1700595967',
    'spices-whole-spice-powder-and-masalas': 'https://cdn.shopify.com/s/files/1/0582/8336/0440/products/IMG_E6802.jpg?v=1626047789',
  };

  let orderIdx = 1;
  for (const col of collectionsRaw) {
    const cleanDesc = cleanHtml(col.description) || null;
    const catImage = (col.image && col.image.src) || categoryImages[col.handle] || null;

    const created = await prisma.category.create({
      data: {
        name: col.title.trim(),
        slug: col.handle.trim(),
        description: cleanDesc,
        image: catImage,
        orderIndex: orderIdx++,
      },
    });
    categoryDbMap[col.handle] = created;
    console.log(`   [${created.slug}] ${created.name}`);
  }

  // Build reverse map: productId -> collection handles
  const prodToCols: Record<number, string[]> = {};
  for (const [handle, items] of Object.entries(colMap as Record<string, any[]>)) {
    for (const item of items) {
      if (!prodToCols[item.id]) prodToCols[item.id] = [];
      prodToCols[item.id].push(handle);
    }
  }

  // Fallback map by product_type for items not placed in manual collections
  const typeToCol: Record<string, string> = {
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

  // 4. Import all real products
  console.log(`\n🛍️ Importing ${productsRaw.length} real products from asianmix.ie...`);

  let importedCount = 0;
  const failedProducts: { title: string; reason: string }[] = [];
  const categoryCountMap: Record<string, number> = {};

  for (const p of productsRaw) {
    try {
      // Determine target category
      let colHandle: string | null = null;
      if (prodToCols[p.id] && prodToCols[p.id].length > 0) {
        colHandle = prodToCols[p.id][0];
      } else if (p.product_type && typeToCol[p.product_type]) {
        colHandle = typeToCol[p.product_type];
      } else {
        colHandle = 'classic-collection-and-over-the-counter';
      }

      const category = categoryDbMap[colHandle];
      if (!category) {
        throw new Error(`Category with handle "${colHandle}" not found`);
      }

      const primaryVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
      const price = primaryVariant ? parseFloat(primaryVariant.price) : 0.0;
      const compareAtPrice = primaryVariant && primaryVariant.compare_at_price
        ? parseFloat(primaryVariant.compare_at_price)
        : null;

      const cleanDesc = cleanHtml(p.body_html);
      let imageUrls = (p.images || []).map((img: any) => img.src).filter(Boolean);
      if (imageUrls.length === 0 && category.image) {
        imageUrls = [category.image];
      }

      // Weight from variant title or grams
      let weight: string | null = null;
      if (primaryVariant) {
        if (primaryVariant.title && primaryVariant.title !== 'Default Title') {
          weight = primaryVariant.title;
        } else if (primaryVariant.grams && primaryVariant.grams > 0) {
          weight = primaryVariant.grams >= 1000
            ? `${(primaryVariant.grams / 1000).toFixed(primaryVariant.grams % 1000 === 0 ? 0 : 2)} Kg`
            : `${primaryVariant.grams}g`;
        }
      }

      // Origin country from tags or vendor
      let originCountry = 'Asia / Ireland';
      const vendorLower = (p.vendor || '').toLowerCase();
      if (vendorLower.includes('brahmins') || vendorLower.includes('shan') || vendorLower.includes('kera') || vendorLower.includes('mayil') || vendorLower.includes('double horse') || vendorLower.includes('haldirams') || vendorLower.includes('parle') || vendorLower.includes('britannia') || vendorLower.includes('east end') || vendorLower.includes('kitchen treasures') || vendorLower.includes('heera') || vendorLower.includes('daily delight') || vendorLower.includes('elite')) {
        originCountry = 'India';
      } else if (colHandle === 'phillipino-product-snacks' || (p.product_type || '').startsWith('PH ')) {
        originCountry = 'Philippines';
      }

      // Stock: if available true in Shopify, set default 100 (or inventory_quantity if positive)
      const stock = primaryVariant && primaryVariant.inventory_quantity && primaryVariant.inventory_quantity > 0
        ? primaryVariant.inventory_quantity
        : (primaryVariant?.available !== false ? 100 : 0);

      const sku = primaryVariant?.sku && primaryVariant.sku.trim() ? primaryVariant.sku.trim() : null;
      const brand = p.vendor && p.vendor.trim() ? p.vendor.trim() : null;

      // Dietary tags
      const dietaryTags = (p.tags || []).filter((t: string) =>
        ['Vegan', 'Halal', 'Gluten-Free', 'Vegetarian'].includes(t)
      ).join(',') || null;

      await prisma.product.create({
        data: {
          name: p.title.trim(),
          slug: p.handle.trim(),
          description: cleanDesc,
          originCountry,
          brand,
          price,
          compareAtPrice,
          stock,
          sku,
          images: JSON.stringify(imageUrls),
          weight,
          unit: null,
          dietaryTags,
          isFeatured: (p.tags || []).includes('featured'),
          isBestSeller: (p.tags || []).includes('bestseller'),
          categoryId: category.id,
        },
      });

      importedCount++;
      categoryCountMap[category.name] = (categoryCountMap[category.name] || 0) + 1;
    } catch (err: any) {
      console.error(`❌ Failed to import "${p.title}":`, err.message);
      failedProducts.push({ title: p.title, reason: err.message });
    }
  }

  console.log('\n==========================================');
  console.log(`✨ IMPORT COMPLETE!`);
  console.log(`Total Products Scraped: ${productsRaw.length}`);
  console.log(`Total Products Successfully Imported: ${importedCount}`);
  console.log(`Failed Products: ${failedProducts.length}`);
  console.log('==========================================');

  console.log('\n📊 CATEGORY BREAKDOWN:');
  for (const [catName, count] of Object.entries(categoryCountMap)) {
    console.log(`- ${catName}: ${count} products`);
  }

  if (failedProducts.length > 0) {
    console.log('\n⚠️ Failed Products Details:');
    console.log(failedProducts);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
