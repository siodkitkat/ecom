import { QueryClient } from "@tanstack/react-query";

export const TIME_IN_MS = {
  FIVE_MINUTES: 1000 * 60 * 5,
} as const;

export const ALL_PRODUCTS_QUERY_KEY = ["products-get-all"];

export const invalidateProducts = async (queryClient: QueryClient) => {
  await queryClient.invalidateQueries({
    queryKey: ALL_PRODUCTS_QUERY_KEY,
    refetchType: "all",
    exact: true,
  });
};
