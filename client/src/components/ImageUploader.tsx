import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { ImageSchema } from "../types";
import Button from "./Button";

const ImageUploader = ({
  errorMessage,
  className = "",
  onComplete,
}: {
  errorMessage?: string;
  className?: string;
  onComplete?: (image: z.infer<typeof ImageSchema>) => void;
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const { mutate, isSuccess, isLoading, isError, reset } = useMutation({
    mutationFn: async (file: File) => {
      if (!file.type.trim().toLowerCase().startsWith("image")) {
        throw new Error("Only image files are allowed.");
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget?.files?.[0];
    if (!file) {
      return;
    }
    setFile(file);
    reset();
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) {
      return;
    }
    mutate(file);
  };

  const renderFileName = (file: File) => {
    let fileName = file.name;
    if (fileName.length > 5) {
      let [base, ext] = fileName.split(".");
      //This should not be possible
      if (!base) {
        return null;
      }

      fileName = `${base.slice(0, 20)}...` + (ext ? `.${ext}` : "");
    }

    return fileName;
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <input
          className="hidden"
          accept="image/*"
          type="file"
          name="image"
          onChange={handleChange}
          ref={fileInputRef}
        />
        <Button
          variants={{ type: "secondary", weight: "semibold" }}
          onClick={() => {
            if (!fileInputRef.current) {
              return;
            }

            fileInputRef.current.click();
          }}
        >
          Choose a file
        </Button>
        <Button variants={{ type: "secondary", weight: "semibold" }} type="submit" onClick={handleClick}>
          Upload
        </Button>
      </div>
      <div className="flex w-max flex-col">
        {file ? (
          <div className="text-[0.75em]">
            <p title={file.name}>{renderFileName(file)}</p>
          </div>
        ) : null}
        {/* Loader */}
        {isLoading || isSuccess ? (
          <div className={`h-1 rounded-sm bg-pink-600 transition-all ${isSuccess ? "w-full" : "w-1"}`} />
        ) : null}
      </div>
      {isError || errorMessage ? (
        <p className="truncate text-base text-red-500">
          {isError ? "Failed to upload your image :(" : `${errorMessage}`}
        </p>
      ) : null}
      {true}
    </div>
  );
};

export default ImageUploader;
