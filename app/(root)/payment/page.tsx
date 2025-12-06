"use client";

import { useGetCartById } from "@/lib/hooks/useGetCartById";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useGetAddress } from "@/lib/hooks/useGetAddress";
import { useState } from "react";
import { useCreateOrder } from "@/lib/hooks/useCreateOrder";
import { useRouter } from "next/navigation";



const formatPrice = (price: number) => `${price.toFixed(2)}€`;

const PaymentPage = () => {
  const router = useRouter();
  const [creditCardSelected, setCreditCardSelected] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: cart, isLoading, isError } = useGetCartById(userId);
  const { data, isLoading2, isError2 } = useGetAddress(userId);
  const { mutate: createOrder, isPending } = useCreateOrder();

  if (!userId) return <p>Please login</p>;
  if (isLoading2) return <p>Loading address...</p>;
  if (isError2) return <p>Failed to load address</p>;

  const address = data?.address;

  if (!address) return <p>No address found</p>;

  if (isLoading) return <p>Loading your cart...</p>;
  if (isError) return <p>Failed to load cart.</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  const cartTotal = cart.items.reduce((total: number, item) => {
    const price = Number(item.variant.salePrice ?? item.variant.price);
    return total + price * item.quantity;
  }, 0);

  const totalItems = cart.items.reduce((sum: number, item) => sum + item.quantity, 0);

const handlePlaceOrder = () => {
  createOrder(
    {
      userId,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      paymentMethod: "cod",
    },
    {
      onSuccess: (data) => {
        router.push(`/order-success`);
      },
    }
  );
};


  return (
    <div className="mx-auto container pt-20 lg:pt-30 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-light">
      <h1 className="text-heading-3 text-dark mb-10">Secure checkout</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px]">
        <div className="flex flex-col ">
          <h1 className="text-dark mb-2 font-medium text-lg">Shipping Address</h1>
          <div className="border border-gray-300 px-6 py-2">
             <p>{address.firstName} {address.lastName}</p>
             <p>{address.street}</p>
             <p>{address.city}, {address.country}, {address.postalCode} </p>
          </div>
         
          <h2 className="text-dark mt-4 mb-6 font-medium text-lg">Payment</h2>
          <div className="border border-gray-300 px-6 py-2">
          <div className="flex flex-col gap-4 py-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="paypal" className="accent-red-600" onChange={() => setCreditCardSelected(false)}/>
              PayPal
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="klarna" className="accent-red-600" onChange={() => setCreditCardSelected(false)}/>
              Klarna
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="credit_card" className="accent-red-600" onChange={() => setCreditCardSelected(true)}/>
              Credit Card (Visa / MasterCard / and more)
            </label>
          </div>
          {creditCardSelected && (
            <div className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              name="cardNumber"
              required
              placeholder="Card Number"
              className="w-full p-3 border border-neutral-400 rounded"
            />
            <div className="flex gap-4">
              <input
                type="text"
                required
                name="expiry"
                placeholder="MM/YY"
                className="w-1/2 p-3 border border-neutral-400 rounded"
              />
              <input
                type="text"
                required
                name="cvv"
                placeholder="CVV"
                className="w-1/2 p-3 border border-neutral-400 rounded"
              />
            </div>
          </div>
          )}
           
          <h2 className="font-medium text-dark mt-4 text-lg">Billing Address</h2>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="sameAsShipping" className="accent-red-600" checked/>
            Same as shipping address
          </label>
          <p className="text-sm text-gray-600 mt-2">
            By placing an order, you agree to our{" "}
            <a href="/terms" className="underline text-blue-600">
              Terms of Use
            </a>{" "}
            &{" "}
            <a href="/privacy" className="underline text-blue-600">
              Privacy Policy
            </a>
            .
          </p>
        <button
          type="submit"
          className=" bg-[#E61A4D] text-white mb-4 mt-4 py-3 px-6 rounded-full w-full md:w-[50%] hover:opacity-90 transition hover:cursor-pointer"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
        </div>
        </div>
        <div className="flex flex-col gap-6 border border-gray-300 p-8">
          <header className="flex flex-col gap-2">
            <h2 className="text-heading-3 text-dark mb-4">Order Summary</h2>
            <div className="flex justify-between ">
              <h3>Item Total</h3>
              <h3>{formatPrice(cartTotal)}</h3>
            </div>
            <div className="flex justify-between">
              <h3>Shipping</h3>
              <h3>{formatPrice(4.99)}</h3>
            </div>
            <div className="flex justify-between mt-4 text-dark font-medium">
              <h3>Total</h3>
              <h3>{formatPrice(cartTotal + 4.99)}</h3>
            </div>
          </header>
          <h2 className="text-dark font-medium">Items({totalItems})</h2>
          
           {cart.items.map((item) => {
            const primaryShirtImage =
            item.variant.shirt.images.find((img) => img.isPrimary) ||
            item.variant.shirt.images[0];

          const imageUrl = primaryShirtImage?.url
            ? `/${primaryShirtImage.url}`
            : "/placeholder.png";

          const itemPrice = Number(item.variant.salePrice ?? item.variant.price);
          const itemTotal = itemPrice * item.quantity;

          return (

              <div key={item.id} className="flex justify-between flex-col-2 ">
                <Image
                  src={imageUrl}
                  alt={item.variant.shirt.name}
                  width={100}
                  height={100}
                  className="object-cover rounded-md"
                />
                <div className="space-y-2">
                  <p>{item.variant.shirt.name}</p>
                  <p className="text-dark font-medium">{formatPrice((item.variant.salePrice ?? item.variant.price) * item.quantity)}</p>
                  <div className="flex justify-between text-dark font-medium">
                    <p>SIZE {item.variant.size.name}</p>
                    <p>Quantity {item.quantity}</p>
                  </div>
                  <p className="text-green-700">This item will ship within 5 business days.</p>
                </div>
                
              </div>
            );
        })}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
