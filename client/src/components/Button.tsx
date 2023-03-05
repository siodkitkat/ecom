import { cva } from "class-variance-authority";
import React, { ForwardedRef } from "react";

const cvaVariants = {
  type: {
    primary: [
      "bg-pink-600",
      "text-pink-100",
      "enabled:hover:bg-pink-700",
      "enabled:hover:text-pink-200",
      "focus:bg-pink-700",
      "focus:text-pink-200",
      "focus:outline-0",
      "focus:ring-2",
      "focus:ring-pink-400",
      "disabled:bg-pink-800",
      "disabled:opacity-50",
      "",
    ],
    secondary: [
      "bg-neutral-1000",
      "text-pink-700",
      "border-2",
      "border-pink-700",
      "enabled:hover:bg-pink-900/25",
      "enabled:hover:text-pink-600",
      "enabled:hover:border-pink-600",
      "focus:bg-pink-900/20",
      "focus:text-pink-600",
      "focus:border-pink-600",
      "focus:outline-0",
      "disabled:opacity-50",
    ],
  },
  size: {
    sm: ["px-1", "py-1", "text-sm", "md:px-3", "md:py-2", "md:text-base"],
    md: ["px-2", "py-1", "text-base", "md:px-3", "md:py-2", "md:text-xl"],
    lg: ["px-2", "py-1", "text-lg", "md:px-3", "md:py-2", "md:text-2xl"],
  },
  weight: {
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
};

const DEFAULT_BUTTON_VARIANTS: {
  [k in keyof typeof cvaVariants]: keyof (typeof cvaVariants)[k];
} = {
  type: "primary",
  size: "md",
  weight: "medium",
};

const buttonClasses = cva(["w-max", "font-medium", "rounded"], {
  variants: cvaVariants,
});

const Button = React.forwardRef(
  (
    {
      children,
      type = "button",
      variants: passedVariants = DEFAULT_BUTTON_VARIANTS,
      className = "",
      ...rest
    }: React.ComponentProps<"button"> & {
      variants?: Partial<typeof DEFAULT_BUTTON_VARIANTS>;
    },
    passedRef: ForwardedRef<HTMLButtonElement>
  ) => {
    const variants = { ...DEFAULT_BUTTON_VARIANTS, ...passedVariants };

    return (
      <button {...rest} type={type} className={`${buttonClasses(variants)} ${className}`} ref={passedRef}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
