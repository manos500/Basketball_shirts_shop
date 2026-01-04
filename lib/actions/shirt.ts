import { prisma } from "@/lib/prisma";

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

  if (priceRanges?.length) {
    for (const [min, max] of priceRanges) {
      const priceFilter: any = {};
      if (min !== undefined) priceFilter.gte = min;
      if (max !== undefined) priceFilter.lte = max;

      orPriceConditions.push({
        variants: { some: { price: priceFilter } },
      });
    }
  } else if (priceMin !== undefined || priceMax !== undefined) {
    const priceFilter: any = {};
    if (priceMin !== undefined) priceFilter.gte = priceMin;
    if (priceMax !== undefined) priceFilter.lte = priceMax;

    where.variants = {
      some: { price: priceFilter },
    };
  }

  if (orPriceConditions.length) {
    where.OR = [...(where.OR ?? []), ...orPriceConditions];
  }

  const totalCount = await prisma.shirt.count({ where });

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
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    const mainImage =
      shirt.images.find((img) => img.isPrimary)?.url ??
      shirt.images[0]?.url ??
      null;

    return {
      id: shirt.id,
      name: shirt.name,
      description: shirt.description,
      minPrice,
      maxPrice,
      mainImage,
    };
  });

  // Client-side sorting (OK)
  if (sort === "price_asc") {
    formattedShirts.sort((a, b) => a.minPrice - b.minPrice);
  } else if (sort === "price_desc") {
    formattedShirts.sort((a, b) => b.minPrice - a.minPrice);
  } else if (sort === "newest") {
    formattedShirts.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return {
    shirts: formattedShirts,
    totalCount, // ✅ REAL TOTAL
  };
}


export const getFeaturedShirts = async (shirtId: string) => {
  const currentShirt = await prisma.shirt.findUnique({
    where: { id: shirtId },
    select: {
      id: true,
      team: true,
    },
  })

  if (!currentShirt) return [];

  const featuredShirts = await prisma.shirt.findMany({
    where: {
      team: currentShirt.team,
      id: { not: currentShirt.id },
    },
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
  })

  return featuredShirts.map((shirt) => {

    const prices = shirt.variants.map(v =>
      Number(v.salePrice ?? v.price)
    );

    const minPrice = prices.length ? Math.min(...prices) : null;
    const maxPrice = prices.length ? Math.max(...prices) : null;

    const defaultVariant = shirt.defaultVariantId
      ? shirt.variants.find(v => v.id === shirt.defaultVariantId)
      : null;

    const displayPrice =
      defaultVariant
        ? Number(defaultVariant.salePrice ?? defaultVariant.price)
        : minPrice;


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
    price: displayPrice,
  };
  });

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




