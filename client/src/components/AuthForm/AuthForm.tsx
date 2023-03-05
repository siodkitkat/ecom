import { zodResolver } from "@hookform/resolvers/zod";
import React, { ForwardedRef } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../Button";

const AuthFormSchema = z.object({
  username: z.string().min(1, "Must be atleast 1 character"),
  password: z.string().min(1, "Must be atleast 1 character"),
});

type AuthFormType = z.infer<typeof AuthFormSchema>;

const Input = React.forwardRef(
  (
    {
      name,
      errors,
      className = "",
      ...rest
    }: Exclude<React.ComponentProps<"input">, "name"> & {
      errors: FieldErrors<AuthFormType>;
      name: keyof AuthFormType;
    },
    passedRef: ForwardedRef<HTMLInputElement>
  ) => {
    const errorMessage = errors[name]?.message;

    return (
      <label className="flex flex-col gap-1 capitalize md:gap-2">
        {name}
        <input
          {...rest}
          name={name}
          className={`rounded border border-pink-600 bg-neutral-900 p-1 transition hover:border-pink-300 focus:border-pink-400 focus:outline-0 xl:max-w-[60%] ${className}`}
          aria-invalid={errorMessage !== undefined}
          ref={passedRef}
        />
        {errorMessage !== undefined ? <p className="text-[0.75em] text-red-500">{errorMessage}</p> : null}
      </label>
    );
  }
);

Input.displayName = "Input";

const AuthForm = ({
  title,
  image,
  onSubmit,
}: {
  title: string;
  image: string;
  onSubmit: SubmitHandler<AuthFormType>;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthFormType>({
    resolver: zodResolver(AuthFormSchema),
  });

  return (
    <div className="flex flex-col xl:flex-row">
      <div
        className={`relative flex h-[50vh] w-full justify-center overflow-hidden before:absolute before:h-full before:w-full before:bg-gradient-to-b before:from-transparent before:to-[var(--bg-color)_95%] before:content-[""] md:h-[60vh] xl:order-last xl:h-full xl:before:hidden`}
      >
        <img
          className="aspect-square h-[99%] w-full rounded object-cover object-top xl:mr-8 xl:h-full xl:w-3/4"
          src={image}
        />
      </div>
      <div className="relative flex w-full flex-col gap-2 p-4 pt-0 text-xl md:gap-5 md:p-8 md:text-3xl xl:w-1/2 xl:flex-shrink-0 xl:justify-center xl:p-12">
        <h2 className="text-5xl font-bold md:text-7xl">{title}</h2>
        <form className="flex flex-col gap-4 pr-8 md:gap-8 xl:pr-0" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("username")} errors={errors} />
          <Input {...register("password")} errors={errors} />

          <Button className="mt-2" variants={{ size: "lg", type: "secondary" }} type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
