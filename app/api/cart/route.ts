import { NextRequest, NextResponse } from "next/server";
import { addToCart, getCart } from "@/lib/actions/cart";
import { withAuth, withOptionalAuth } from "@/lib/api-auth";


export const POST = withOptionalAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json();
    const { variantId, quantity, guestId } = body;

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    const userId = session?.user?.id;

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "Either authentication or guestId is required" }, 
        { status: 400 }
      );
    }

    const cart = await addToCart({ userId, guestId, variantId, quantity });

    return NextResponse.json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json(
      { error: "Failed to add to cart" }, 
      { status: 500 }
    );
  }
});

export const GET = withAuth(async (request, session) => {
  try {
    const cart = await getCart(session.user.id);
    return NextResponse.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    return NextResponse.json(
      { error: "Failed to fetch cart" }, 
      { status: 500 }
    );
  }
});