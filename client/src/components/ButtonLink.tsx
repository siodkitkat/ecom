import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const ButtonLink = ({
  children,
  to,
  ...rest
}: Omit<React.ComponentProps<typeof Button>, "tabIndex"> & {
  to: React.ComponentProps<typeof Link>["to"];
}) => {
  return (
    <Link className="inline-block" to={to} tabIndex={-1}>
      <Button {...rest}>{children}</Button>
    </Link>
  );
};

export default ButtonLink;
