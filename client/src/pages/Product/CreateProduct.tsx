import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import ImageUploader from "../../components/ImageUploader";

const CreateProduct = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [imageId, setImageId] = useState("");

  const {
    mutateAsync,
    isLoading,
    data: productId,
  } = useMutation({
    mutationFn: async (input: { imageId: string; title: string; body: string; price: string; quantity: string }) => {
      if (isLoading) {
        throw new Error("Waiting for previous mutation to finish.");
      }

      for (let [key, value] of Object.entries(input)) {
        if (!value) {
          throw new Error(`Missing ${key} in request`);
        }
      }

      const res = await (
        await fetch("/api/products", {
          method: "POST",
          body: new URLSearchParams(input),
        })
      ).json();

      if (!res?.product?._id || typeof res.product._id !== "string") {
        throw new Error("Failed to get id from the created product");
      }

      return res.product._id as string;
    },
    onSuccess: (data) => {
      console.log("Created the product", data);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutateAsync({ title, body, imageId, price, quantity });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <p>title</p>
          <input value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
        </label>
        <label>
          <p>body</p>
          <input value={body} onChange={(e) => setBody(e.currentTarget.value)} />
        </label>
        <label>
          <p>price</p>
          <input value={price} onChange={(e) => setPrice(e.currentTarget.value)} />
        </label>
        <label>
          <p>quantity</p>
          <input value={quantity} onChange={(e) => setQuantity(e.currentTarget.value)} />
        </label>
        <ImageUploader
          onComplete={(image) => {
            if (!image._id) {
              throw new Error("Uploaded image has no id uh oh");
            }
            setImageId(image._id);
            //To do throw a toast here for feedback
            console.log("done updating image");
          }}
        />
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
      {productId ? <Link to={`/products/${productId}`}>Successfully created the new product!</Link> : null}
    </div>
  );
};

export default CreateProduct;
