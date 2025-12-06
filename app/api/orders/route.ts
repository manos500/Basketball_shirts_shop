import { NextRequest, NextResponse } from "next/server";
import { placeOrder } from "@/lib/actions/order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, guestId, shippingAddressId, billingAddressId } = body;

    const result = await placeOrder(
      userId,
      shippingAddressId,
      billingAddressId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
