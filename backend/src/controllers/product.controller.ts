import { Request, Response } from 'express';
import prisma from '../config/prisma';

const SYNONYM_DICTIONARY: Record<string, string[]> = {
  besan: ['gram flour', 'chickpea flour', 'gram', 'chana flour'],
  'gram flour': ['besan', 'chickpea flour', 'chana'],
  atta: ['wheat powder', 'wheat flour', 'chakki atta', 'flour'],
  'wheat flour': ['atta', 'wheat powder'],
  'chana dal': ['gram', 'bengal gram', 'chickpea'],
  haldi: ['turmeric', 'turmeric powder'],
  turmeric: ['haldi'],
  jeera: ['cumin', 'cumin seeds', 'cumin powder'],
  cumin: ['jeera'],
  dhania: ['coriander', 'coriander powder'],
  coriander: ['dhania'],
  mirch: ['chilli', 'chilli powder', 'pepper'],
  chilli: ['mirch', 'chili'],
  chili: ['mirch', 'chilli'],
  maggi: ['noodle', 'noodles', 'ramen', 'instant noodles'],
  noodles: ['maggi', 'ramen', 'soba', 'udon', 'vermicelli'],
  ramen: ['noodles', 'noodle', 'buldak', 'shin'],
  ghee: ['clarified butter', 'butter'],
  matta: ['kerala rice', 'rose matta', 'red rice', 'boiled rice'],
  basmati: ['rice', 'aromatic rice'],
  rice: ['basmati', 'matta', 'ponni', 'sona masoori', 'jasmine'],
  dal: ['lentil', 'lentils', 'toor', 'moong', 'urad', 'chana'],
  lentil: ['dal', 'lentils', 'dhal'],
  lentils: ['dal', 'dhal'],
  rava: ['sooji', 'suji', 'semolina'],
  sooji: ['rava', 'suji', 'semolina'],
  semolina: ['rava', 'sooji', 'suji'],
  poha: ['flattened rice', 'aval', 'beaten rice'],
  aval: ['poha', 'flattened rice'],
  jaggery: ['gur', 'sharkara', 'panela'],
  gur: ['jaggery', 'sharkara'],
  sharkara: ['jaggery', 'gur'],
  masala: ['spice', 'curry powder', 'seasoning'],
  achar: ['pickle', 'pickles'],
  pickle: ['achar'],
  appam: ['palappam', 'hopper', 'rice powder'],
  puttu: ['puttu podi', 'rice powder', 'steamed rice cake'],
  dosa: ['idli', 'rice powder', 'batter'],
  idli: ['dosa', 'rice powder', 'batter'],
  tofu: ['bean curd', 'soya'],
  soy: ['soya', 'shoyu'],
  buldak: ['samyang', 'ramen', 'spicy noodles', 'korean'],
  nori: ['seaweed', 'sushi'],
};

const expandSearchTerms = (query: string): string[] => {
  const cleanQ = query.trim().toLowerCase();
  const terms = new Set<string>([cleanQ]);

  // Check full query
  if (SYNONYM_DICTIONARY[cleanQ]) {
    SYNONYM_DICTIONARY[cleanQ].forEach((syn) => terms.add(syn));
  }

  // Check individual words
  const words = cleanQ.split(/\s+/).filter((w) => w.length > 2);
  for (const word of words) {
    if (SYNONYM_DICTIONARY[word]) {
      SYNONYM_DICTIONARY[word].forEach((syn) => terms.add(syn));
    }
  }

  return Array.from(terms);
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      dietary,
      origin,
      brand,
      inStock,
      featured,
      bestSeller,
      ids,
      sort = 'newest',
      page = '1',
      limit = '24',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Category filter by slug or ID
    if (category && category !== 'all') {
      const cat = await prisma.category.findFirst({
        where: {
          OR: [{ slug: category as string }, { id: category as string }],
        },
      });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    // Keyword search with fuzzy synonyms
    if (search) {
      const searchTerms = expandSearchTerms(search as string);
      where.OR = searchTerms.flatMap((term) => [
        { name: { contains: term } },
        { description: { contains: term } },
        { brand: { contains: term } },
        { originCountry: { contains: term } },
        { ingredients: { contains: term } },
      ]);
    }

    // Price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    // Dietary tags
    if (dietary && dietary !== 'all') {
      const tags = (dietary as string).split(',');
      where.AND = tags.map((t) => ({
        dietaryTags: { contains: t.trim() },
      }));
    }

    // Origin
    if (origin && origin !== 'all') {
      where.originCountry = { contains: origin as string };
    }

    // Stock availability
    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    // Featured & Best Sellers
    if (featured === 'true') where.isFeatured = true;
    if (bestSeller === 'true') where.isBestSeller = true;

    // Filter by specific IDs (e.g. wishlist, cart items)
    if (ids) {
      const idList = (ids as string).split(',').map((s) => s.trim()).filter(Boolean);
      if (idList.length > 0) {
        where.id = { in: idList };
      }
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'name-asc') orderBy = { name: 'asc' };
    else if (sort === 'bestselling') orderBy = [{ isBestSeller: 'desc' }, { stock: 'desc' }];
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    let [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true, image: true } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
    ]);

    // Fallback gracefully to popular products if isBestSeller/isFeatured yield 0
    if (products.length === 0 && (where.isBestSeller || where.isFeatured)) {
      const fallbackWhere = { ...where };
      delete fallbackWhere.isBestSeller;
      delete fallbackWhere.isFeatured;
      [total, products] = await Promise.all([
        prisma.product.count({ where: fallbackWhere }),
        prisma.product.findMany({
          where: fallbackWhere,
          include: {
            category: { select: { id: true, name: true, slug: true, image: true } },
            reviews: { select: { rating: true } },
          },
          orderBy: { stock: 'desc' },
          skip,
          take: limitNum,
        }),
      ]);
    }

    const formattedProducts = products.map((prod) => {
      const ratings = prod.reviews.map((r) => r.rating);
      const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5.0;
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(prod.images);
      } catch {
        parsedImages = [prod.images];
      }

      return {
        ...prod,
        images: parsedImages,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: ratings.length,
      };
    });

    res.json({
      success: true,
      products: formattedProducts,
      total,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    let parsedImages = [];
    try {
      parsedImages = JSON.parse(product.images);
    } catch {
      parsedImages = [product.images];
    }

    const ratings = product.reviews.map((r) => r.rating);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5.0;

    // Fetch related products in same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 8,
      include: { category: true, reviews: true },
    });

    const formattedRelated = related.map((r) => {
      let rImages = [];
      try {
        rImages = JSON.parse(r.images);
      } catch {
        rImages = [r.images];
      }
      return {
        ...r,
        images: rImages,
        avgRating: r.reviews.length
          ? Number((r.reviews.reduce((a, b) => a + b.rating, 0) / r.reviews.length).toFixed(1))
          : 5.0,
      };
    });

    res.json({
      success: true,
      product: {
        ...product,
        images: parsedImages,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
      },
      related: formattedRelated,
      relatedProducts: formattedRelated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching product' });
  }
};

export const getFeaturedAndBestSellers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [featured, bestSellers, newArrivals] = await Promise.all([
      prisma.product.findMany({
        where: { isFeatured: true },
        take: 8,
        include: { category: true, reviews: true },
      }),
      prisma.product.findMany({
        where: { isBestSeller: true },
        take: 8,
        include: { category: true, reviews: true },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { category: true, reviews: true },
      }),
    ]);

    const format = (list: any[]) =>
      list.map((p) => {
        let imgs = [];
        try {
          imgs = JSON.parse(p.images);
        } catch {
          imgs = [p.images];
        }
        return {
          ...p,
          images: imgs,
          avgRating: p.reviews.length
            ? Number((p.reviews.reduce((a: any, b: any) => a + b.rating, 0) / p.reviews.length).toFixed(1))
            : 5.0,
        };
      });

    res.json({
      success: true,
      featured: format(featured),
      bestSellers: format(bestSellers),
      newArrivals: format(newArrivals),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching featured products' });
  }
};

export const searchSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      res.json({ success: true, suggestions: [] });
      return;
    }

    const query = q.trim();
    const searchTerms = expandSearchTerms(query);
    const products = await prisma.product.findMany({
      where: {
        OR: searchTerms.flatMap((term) => [
          { name: { contains: term } },
          { brand: { contains: term } },
          { category: { name: { contains: term } } },
          { description: { contains: term } },
          { ingredients: { contains: term } },
        ]),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        category: { select: { name: true } },
      },
      take: 8,
    });

    const suggestions = products.map((p) => {
      let imgs = [];
      try {
        imgs = JSON.parse(p.images);
      } catch {
        imgs = [p.images];
      }
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: imgs[0] || '',
        category: p.category.name,
      };
    });

    res.json({ success: true, suggestions });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching suggestions' });
  }
};
