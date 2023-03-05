import React, { useRef } from "react";
import { IImage } from "../../../server/models/Image";
import Button from "./Button";

const ImageUploader = ({ onComplete }: { onComplete?: (image: IImage) => void }) => {
  const fileinputRef = useRef<HTMLInputElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const file = fileinputRef.current?.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();

    formData.append("image", file);

    const req = await fetch("/api/images", {
      method: "POST",
      body: formData,
    });

    if (!req.ok) {
      return;
    }

    const image = (await req.json())?.image as IImage | undefined;

    if (!image) {
      return;
    }

    if (onComplete) {
      onComplete(image);
    }
  };

  return (
    <div>
      <input type="file" name="image" ref={fileinputRef} />
      <Button type="submit" onClick={handleClick}>
        Upload
      </Button>
    </div>
  );
};

export default ImageUploader;
