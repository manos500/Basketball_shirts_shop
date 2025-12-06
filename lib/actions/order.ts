"use server";

import { prisma } from "@/lib/prisma";

export async function placeOrder(
  userId: string,
  shippingAddressId: string,
  billingAddressId?: string
) {
  if (!userId) throw new Error("Not authenticated");

  
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          variant: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + Number(item.variant.price) * item.quantity;
  }, 0);

  
  const order = await prisma.order.create({
    data: {
      userId,
      status: "PAID", 
      totalAmount,
      shippingAddressId,
      billingAddressId,

      items: {
        create: cart.items.map((item) => ({
          productVariantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: item.variant.price,
        })),
      },

      payments: {
        create: {
          method: "cod", 
          status: "completed",
          paidAt: new Date(),
          transactionId: "FAKE_" + Date.now(),
        },
      },
    },
  });

 
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return { success: true, orderId: order.id };
}
