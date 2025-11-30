import { prisma } from "@/lib/prisma";

type FilterParams = {
  search?: string;
  sizeSlugs?: string[];
  brandSlugs?: string[];
  leagueSlugs?: string[];
  teamSlugs?: string[];
  priceMin?: number;
  priceMax?: number;
  priceRanges?: Array<[number | undefined, number | undefined]>;
  sort?: "featured" | "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
};

export async function getAllShirts(filters: FilterParams) {
  const {
    search,
    sizeSlugs,
    brandSlugs,
    leagueSlugs,
    teamSlugs,
    priceMin,
    priceMax,
    priceRanges,
    sort = "newest",
    page = 1,
    limit = 24,
  } = filters;

  const where: any = { isPublished: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { team: { name: { contains: search, mode: "insensitive" } } },
      { brand: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (brandSlugs?.length) where.brand = { slug: { in: brandSlugs } };
  if (leagueSlugs?.length) where.league = { slug: { in: leagueSlugs } };
  if (teamSlugs?.length) where.team = { slug: { in: teamSlugs } };

  if (sizeSlugs?.length) {
    where.variants = {
      some: { size: { slug: { in: sizeSlugs } } },
    };
  }

  const orPriceConditions: any[] = [];

  if (priceRanges && priceRanges.length > 0) {
    for (const [min, max] of priceRanges) {
      const priceFilter: any = {};
      if (min !== undefined) priceFilter.gte = min;
      if (max !== undefined) priceFilter.lte = max;

      if (Object.keys(priceFilter).length > 0) {
        orPriceConditions.push({
          variants: { some: { price: priceFilter } },
        });
      }
    }
  } else if (priceMin !== undefined || priceMax !== undefined) {
    const priceFilter: any = {};
    if (priceMin !== undefined) priceFilter.gte = priceMin;
    if (priceMax !== undefined) priceFilter.lte = priceMax;

    where.variants = {
      some: { price: priceFilter },
    };
  }

  if (orPriceConditions.length > 0) {
    where.OR = [...(where.OR ?? []), ...orPriceConditions];
  }

  const shirts = await prisma.shirt.findMany({
    where,
    include: {
      brand: true,
      league: true,
      team: true,
      variants: {
        include: {
          size: true,
          images: true,
        },
      },
      images: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const formattedShirts = shirts.map((shirt) => {
    const prices = shirt.variants.map((v) => Number(v.salePrice ?? v.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const primaryImage =
      shirt.images.find((img) => img.isPrimary)?.url ?? shirt.images[0]?.url ?? null;

    return {
      id: shirt.id,
      name: shirt.name,
      description: shirt.description,
      minPrice,
      maxPrice,
      mainImage: primaryImage,
    };
  });

  if (filters.sort === "price_asc") {
    formattedShirts.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0));
  } else if (filters.sort === "price_desc") {
    formattedShirts.sort((a, b) => (b.minPrice ?? 0) - (a.minPrice ?? 0));
  } else if (filters.sort === "newest") {
    formattedShirts.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return {
    shirts: formattedShirts,
    totalCount: formattedShirts.length,
  };
}

export const getShirt = async (id: string) => {
  const shirt = await prisma.shirt.findUnique({
    where: { id },
    include: {
      brand: true,
      league: true,
      team: true,
      player: true,
      variants: {
        include: {
          size: true,
          images: true,
        },
      },
      images: true,
    },
  });

  if (!shirt) return null;

  const primaryImage =
    shirt.images.find((img) => img.isPrimary)?.url ??
    shirt.images[0]?.url ??
    null;

  const sortedImages = shirt.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    }));

  return {
    id: shirt.id,
    name: shirt.name,
    description: shirt.description,
    brand: shirt.brand,
    league: shirt.league,
    team: shirt.team,
    player: shirt.player,
    mainImage: primaryImage,
    images: sortedImages,
    variants: shirt.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      salePrice: v.salePrice ? Number(v.salePrice) : null,
      size: v.size.name,
      imageUrl: v.images[0]?.url ?? null,
      inStock: v.inStock,
    })),
  };
};


