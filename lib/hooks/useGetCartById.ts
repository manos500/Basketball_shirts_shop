import { useQuery } from "@tanstack/react-query";

export const useGetCartById = (userId?: string, guestId?: string) => {
  return useQuery({
    queryKey: ["cart", { userId, guestId }],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (userId) query.append("userId", userId);
      if (guestId) query.append("guestId", guestId);

      const res = await fetch(`/api/cart?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });
};
