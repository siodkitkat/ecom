import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import TruncatedText from "../../components/TruncatedText";
import { ProductSchema } from "../../types";
import { TIME_IN_MS } from "../../utils";

const Products = () => {
  const { data: products } = useQuery(["products-get-all"], {
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

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center gap-2">
        <b className="text-3xl">Products</b>
        <Link className="flex items-center gap-1 text-xl" to={`/products/create`}>
          <Button variants={{ type: "secondary" }}>Create</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 md:gap-8 xl:flex-row xl:flex-wrap">
        {products.map((product) => {
          return (
            <Link
              className="flex w-full items-start gap-2 rounded-sm p-4 text-base text-zinc-200 hover:bg-zinc-800 md:gap-4 md:text-2xl xl:max-w-[30%]"
              key={product._id}
              to={`/products/${product._id}`}
            >
              <img
                className="w-36 shrink-0 self-center rounded-sm object-cover md:w-56"
                src={product.image[0]?.publicUrl ?? ""}
                style={{ aspectRatio: "1 / 1" }}
              />
              <div className="flex flex-col">
                <TruncatedText className="text-xl font-bold md:text-3xl" title={product.title} maxLines={2}>
                  {product.title}
                </TruncatedText>
                <p className="text-zinc-300 md:text-3xl">{`$${product.price}`}</p>

                <TruncatedText className="mt-2 text-zinc-400" maxLines={3}>
                  {product.body}
                </TruncatedText>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
