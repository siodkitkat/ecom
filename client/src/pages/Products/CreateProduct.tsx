import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ForwardedRef, useState } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import ImageUploader from "../../components/ImageUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { invalidateProducts } from "../../utils";

const CreateProductFormSchema = z.object({
  title: z.string().min(1, "Atleast 1 character required"),
  body: z.string().min(1, "Atleast 1 character required"),
  price: z.number({ invalid_type_error: "Must be a number" }).positive(),
  quantity: z.number({ invalid_type_error: "Must be a number" }).nonnegative(),
});

type CreateProductForm = z.infer<typeof CreateProductFormSchema>;

const Input = React.forwardRef(
  (
    {
      name,
      errors,
      ...rest
    }: Omit<React.ComponentProps<"input">, "name"> & {
      errors: FieldErrors<CreateProductForm>;
      name: keyof CreateProductForm;
    },
    passedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const inputProps = {
      name,
      ...rest,
    };

    const errorMessage = errors[name]?.message;

    return (
      <label className="flex w-max flex-col">
        <div className="flex w-full flex-col gap-2 md:gap-4">
          <p className="capitalize">{name}</p>
        </div>
        <input
          {...inputProps}
          className="rounded bg-zinc-800 p-1"
          aria-invalid={errorMessage !== undefined}
          ref={passedRef as ForwardedRef<HTMLInputElement>}
        />
        {errorMessage ? <p className="truncate text-base text-red-500">{`${errorMessage}`}</p> : null}
      </label>
    );
  }
);

Input.displayName = "Input";

const CreateProduct = () => {
  const queryClient = useQueryClient();

  const [imageId, setImageId] = useState("");

  const {
    register,
    formState: { errors, submitCount },
    handleSubmit,
  } = useForm<CreateProductForm>({
    resolver: zodResolver(CreateProductFormSchema),
  });

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
      invalidateProducts(queryClient);
    },
  });

  const createProduct: SubmitHandler<CreateProductForm> = async (data, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageId) {
      return;
    }

    const { title, body, price, quantity } = data;

    mutateAsync({ title, body, price: `${price}`, quantity: `${quantity}`, imageId });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-2 text-lg md:gap-8 md:px-8 md:py-4 md:text-4xl xl:px-12 xl:py-6">
      <h2>Create a new product</h2>
      <form className="flex w-max flex-col gap-4" onSubmit={handleSubmit(createProduct)}>
        <Input {...register("title")} errors={errors} />
        <Input {...register("body")} errors={errors} />
        <Input {...register("price", { valueAsNumber: true })} errors={errors} />
        <Input {...register("quantity", { valueAsNumber: true })} errors={errors} />
        <ImageUploader
          className="md:mt-2"
          errorMessage={submitCount > 0 && !imageId ? "Atleast 1 image is required" : undefined}
          onComplete={(image) => {
            if (!image._id) {
              throw new Error("Uploaded image has no id uh oh");
            }
            setImageId(image._id);
            //To do throw a toast here for feedback
          }}
        />
        <Button className="md:mt-2" type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
      {productId ? <Link to={`/products/${productId}`}>Success! Click here to visit your new product</Link> : null}
    </div>
  );
};

export default CreateProduct;
