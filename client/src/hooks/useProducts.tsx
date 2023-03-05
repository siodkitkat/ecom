import { useQuery } from "@tanstack/react-query";
import { ProductSchema } from "../types";
import { TIME_IN_MS } from "../utils";

const useProducts = () => {
  return useQuery(["products-get-all"], {
    queryFn: async () => {
      const req = await fetch("/api/products");

      if (!req.ok) {
        throw new Error("Failed to get products.");
      }

      const products = (await req.json())?.products;

      if (!products) {
        throw new Error('Invalid response received. No "products" field exits on the response.');
      }

      if (!Array.isArray(products)) {
        throw new Error('Invalid response received. The "products" field is not an array.');
      }

      const validProducts = [];

      for (let product of products) {
        try {
          validProducts.push(ProductSchema.parse(product));
        } catch (e) {
          continue;
        }
      }

      return validProducts;
    },
    initialData: [],
    initialDataUpdatedAt: 0,
    staleTime: TIME_IN_MS.FIVE_MINUTES,
  });
};
export default useProducts;
