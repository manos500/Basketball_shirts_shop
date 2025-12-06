
import { useMutation } from "@tanstack/react-query";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: {
      userId?: string;
      guestId?: string;
      shippingAddressId: string;
      billingAddressId: string;
      paymentMethod: "cod" | "paypal" | "stripe";
    }) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
  });
};
