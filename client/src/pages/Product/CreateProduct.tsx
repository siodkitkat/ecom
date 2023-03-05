import React, { useState } from "react";
import Button from "../../components/Button";
import ImageUploader from "../../components/ImageUploader";

const CreateProduct = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [imageId, setImageId] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageId) {
      return;
    }

    const req = await fetch("/api/product", {
      method: "POST",
      body: new URLSearchParams({
        title: title,
        body: body,
        price: price,
        quantity: quantity,
        imageId: imageId,
      }),
    });

    console.log(await req.json());
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
            console.log("done updating image");
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default CreateProduct;
