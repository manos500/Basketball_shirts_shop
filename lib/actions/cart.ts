import { prisma } from "@/lib/prisma";

export async function addToCart(
    {
        userId,
        guestId,
        variantId,
        quantity,
    }: {
        userId?: string;
        guestId?: string;
        variantId: string;
        quantity: number;
    }
) {

    // Check if there is an existing cart for user or guest
    let cart = await prisma.cart.findFirst({
        where: {
            userId,
            guestId
        }
    });

    // If no cart exists, create one
    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId,
                guestId,
            },
        })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            variantId,
        },
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { 
                id: existingItem.id 
            },
            data: { 
                quantity: existingItem.quantity + quantity 
            },
        })
    }else {
   
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                variantId,
                quantity,
            },
        });
    }
     return cart;
}

export async function getCart({ userId, guestId }: { userId?: string; guestId?: string }) {
  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      guestId,
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
