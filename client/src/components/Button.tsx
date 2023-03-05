import React, { ForwardedRef } from "react";

const Button = React.forwardRef(
  (
    { children, type = "button", className, ...rest }: React.ComponentPropsWithoutRef<"button">,
    passedRef: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <button {...rest} type={type} className={`${className}`} ref={passedRef}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
