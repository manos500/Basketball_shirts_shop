import { NextRequest, NextResponse } from "next/server";
import { addToCart } from "@/lib/actions/cart";
import { getCart } from "@/lib/actions/cart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, guestId, variantId, quantity } = body;

    if (!variantId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cart = await addToCart({ userId, guestId, variantId, quantity });
    return NextResponse.json(cart);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? undefined;
    const guestId = url.searchParams.get("guestId") ?? undefined;

    const cart = await getCart({ userId, guestId });

    return NextResponse.json(cart);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
