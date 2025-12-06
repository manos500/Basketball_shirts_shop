import { useQuery } from "@tanstack/react-query";

export const useGetAddress = (userId?: string) => {
  return useQuery({
    queryKey: ["address", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No userId provided");

      const res = await fetch(`/api/address?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch address");

      return res.json(); 
    },
    enabled: !!userId,
  });
};
