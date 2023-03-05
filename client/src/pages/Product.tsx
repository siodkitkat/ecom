import React from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Dialog from "../components/Dialog";

const img = "https://m.media-amazon.com/images/I/41I3dqoDN9L._SL1000_.jpg";

const Product = () => {
  const { id } = useParams();

  /* To do fetch  */

  return (
    <div className="w-full">
      <div className="flex flex-col items-baseline gap-4 p-4 md:gap-8 md:p-12 xl:flex-row">
        <img className="w-[35rem] self-center rounded-sm object-cover" src={img} style={{ aspectRatio: "1 / 1" }} />
        <div className="flex flex-col items-baseline gap-2 p-1 md:gap-4 xl:py-8 xl:px-4">
          <div className="flex w-full items-center gap-4 text-2xl text-zinc-200 md:text-4xl xl:gap-32">
            <b className="max-w-[80%] xl:max-w-[65%]">Very special very cute very poggers long cat doll</b>
            <p className="font-medium tracking-wider">$500</p>
          </div>
          <p className="text-lg text-zinc-400 md:text-2xl 2xl:max-w-[55%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus est voluptate facilis ab ratione.
            Molestiae molestias, error obcaecati sequi voluptatibus non. Vel pariatur at voluptatibus temporibus
            adipisci aperiam voluptatem neque?
          </p>
          <Dialog
            Opener={<Button className="mt-4 bg-teal-600 py-1 px-2 md:mt-2">Buy</Button>}
            title="Kekw"
            description="some desc"
          ></Dialog>
        </div>
      </div>
    </div>
  );
};

export default Product;
