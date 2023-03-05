import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import ButtonLink from "../components/ButtonLink";
import TruncatedText from "../components/TruncatedText";
import useProducts from "../hooks/useProducts";

const FEATURED_PRODUCTS = {
  "Exquisite Ripe Banana": true,
  "Chanel Eau De Parfum": true,
  "Modern watch": true,
  "Minimalistic shoes": true,
};

const FeaturedProducts = () => {
  const { data: products } = useProducts();

  const featuredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.title in FEATURED_PRODUCTS) {
        return product;
      }
    });
  }, [products]);

  return (
    <div className="flex flex-col gap-3 p-4 py-8 md:gap-10 md:p-6 md:py-16">
      <h2 className="text-3xl font-bold text-zinc-100 md:text-6xl">Featured Products</h2>
      <div>
        <div className="mobile-scrollbar flex w-full gap-2 overflow-x-auto md:gap-4">
          {featuredProducts.map((product) => {
            return (
              <Link
                className="flex w-[75%] max-w-[28rem] flex-shrink-0 scale-[98%] flex-col gap-1 brightness-[80%] transition hover:scale-100 hover:brightness-100 focus:scale-100 focus:outline-0 focus:brightness-100"
                to={`/products/${product._id}`}
                key={product._id}
              >
                <img
                  className="rounded rounded-t-2xl"
                  style={{ aspectRatio: "10 / 11", objectFit: "cover" }}
                  src={product.image[0].publicUrl}
                />
                <TruncatedText className="tracking-wide text-zinc-400 md:text-3xl" maxLines={5}>
                  {product.body}
                </TruncatedText>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex flex-col gap-4 text-zinc-200">
      <div className="flex items-center">
        <div
          className={`relative flex h-[65vh] w-full items-center p-4 before:absolute before:inset-0 before:h-full before:w-full before:animate-[focus-in_1.25s_ease-in_forwards] before:bg-[url("/images/hero-banner.webp")] before:bg-cover before:bg-center before:bg-no-repeat before:brightness-50 before:grayscale md:h-[70vh] md:p-8 xl:h-[80vh] xl:before:bg-[length:70%] xl:before:bg-[right_30%]`}
          style={{
            backgroundPosition: "right 30%",
          }}
        >
          <div className={`relative z-10 flex flex-col gap-2 md:gap-4 xl:ml-12`}>
            <div className="fade-in animate-[fade-in_0.5s_ease-in_0.4s_forwards] text-5xl font-bold text-zinc-100 opacity-0 md:text-8xl">
              <h2 className="inline">
                Something <br /> for
              </h2>
              <h2 className="inline text-pink-700"> everyone</h2>
              <h2 className="inline font-[arial] text-pink-700">.</h2>
            </div>
            <div className="ml-1">
              <ButtonLink
                to={"/products"}
                className="animate-[fade-in_0.5s_ease-in_0.7s_forwards] opacity-0"
                variants={{ type: "translucent", size: "xl" }}
              >
                Explore
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
      <FeaturedProducts />
    </div>
  );
};

export default Home;
