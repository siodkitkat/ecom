import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import TruncatedText from "../../components/TruncatedText";
import useAuth from "../../hooks/useAuth";
import useProducts from "../../hooks/useProducts";

const Products = () => {
  const { isLoggedIn } = useAuth();

  const { data: products } = useProducts();

  return (
    <div className="flex flex-col items-center gap-2 p-4 md:gap-4 md:p-8">
      <div className="ml-1 flex items-center gap-2 md:ml-2 xl:ml-3">
        <h2 className="text-3xl font-semibold md:text-5xl">Products</h2>
        <Link className="flex items-center gap-1 text-xl" to={`/products/create`}>
          {isLoggedIn ? <Button variants={{ type: "secondary" }}>Create</Button> : null}
        </Link>
      </div>
      <div className="flex w-full flex-col items-center gap-4 md:gap-8 xl:flex-row xl:flex-wrap">
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
              <div className="flex min-w-0 flex-col">
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
