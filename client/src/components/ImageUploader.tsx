import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { z } from "zod";
import { ImageSchema } from "../types";
import Button from "./Button";

const ImageUploader = ({ onComplete }: { onComplete?: (image: z.infer<typeof ImageSchema>) => void }) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const file = fileinputRef.current?.files?.[0];

      if (!file) {
        throw new Error("No file was added to upload.");
      }

      const formData = new FormData();

      formData.append("image", file);

      const req = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!req.ok) {
        throw new Error("Failed to upload image.");
      }

      const image = ImageSchema.parse((await req.json())?.image);

      return image;
    },
    onSuccess: onComplete
      ? (image) => {
          //To do throw a toast here
          onComplete(image);
        }
      : undefined,
  });

  const fileinputRef = useRef<HTMLInputElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate();
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
