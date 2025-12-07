import { prisma } from "@/lib/prisma";

export async function addToCart({
  userId,
  guestId,
  variantId,
  quantity,
}: {
  userId?: string;
  guestId?: string;
  variantId: string;
  quantity: number;
}) {
  if (!userId && !guestId) {
    throw new Error("No userId or guestId provided");
  }

  // Find existing cart
  let cart = await prisma.cart.findFirst({
    where: {
      OR: [{ userId }, { guestId }],
    },
  });

  // If no cart exists, create one
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        guestId,
      },
    });
  }

  // Check if item already exists
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      variantId,
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  }

  // Return updated cart with items
  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: true },
  });

  return updatedCart;
}


export async function getCart(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              shirt: {
                include: {
                  images: true,
                },
              },
              size: true,
              images: true,
            },
          },
        },
      },
    },
  });

  return cart;
}


export async function removeFromCart(cartItemId: string) {
  const existingItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!existingItem) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  const cart = await prisma.cart.findUnique({
    where: { id: existingItem.cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              shirt: {
                include: {
                  images: true,
                },
              },
              size: true,
              images: true,
            },
          },
        },
      },
    },
  });

  return cart;
}
