import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { z } from "zod";
import { ImageSchema } from "../types";
import Button from "./Button";

const ImageUploader = ({
  errorMessage,
  onComplete,
}: {
  errorMessage?: string;
  onComplete?: (image: z.infer<typeof ImageSchema>) => void;
}) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const file = fileInputRef.current?.files?.[0];

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
      return;
    }
    mutate();
  };

  return (
    <div>
      <div className="flex items-center gap-16 md:gap-24">
        <input className="hidden" type="file" name="image" ref={fileInputRef} />
        <Button
          onClick={() => {
            if (!fileInputRef.current) {
              return;
            }

            fileInputRef.current.click();
          }}
        >
          Choose a file
        </Button>
        <Button type="submit" onClick={handleClick}>
          Upload
        </Button>
      </div>
      {errorMessage ? <p className="truncate text-base text-red-500">{`${errorMessage}`}</p> : null}
    </div>
  );
};

export default ImageUploader;
