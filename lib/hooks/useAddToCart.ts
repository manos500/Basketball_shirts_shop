"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddToCartParams {
  userId?: string;
  guestId?: string;
  variantId: string;
  quantity: number;
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToCartParams) => {
      const res = await fetch("/api/cart/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
