import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteShirt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (shirtId: string) => {
            const res = await fetch(`/api/jerseys?id=${shirtId}`, {
            method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to delete shirt");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jerseys"] });
            queryClient.invalidateQueries({ queryKey: ["shirts"] });
        },
    })
}