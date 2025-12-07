import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { addToCart, getCart } from "@/lib/actions/cart";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { variantId, quantity } = body;

    if (!variantId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    const guestId = body.guestId;

    const cart = await addToCart({ userId, guestId, variantId, quantity });

    return NextResponse.json(cart);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const cart = await getCart(userId);

    return NextResponse.json(cart);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}