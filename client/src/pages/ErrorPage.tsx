import React from "react";
import { Link } from "react-router-dom";

const STATUS_CODES = {
  400: "Whoops! Bad request",
  404: "Not found",
  500: "Something went wrong",
} as const;

const ErrorPage = ({
  code = 500,
  message,
  backTo = {
    link: "/",
    text: "Back to home",
  },
}: {
  code?: keyof typeof STATUS_CODES;
  message?: string;
  backTo?: {
    link: React.ComponentProps<typeof Link>["to"];
    text: string;
  };
}) => {
  return (
    <div className="w-full">
      <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-xl md:text-4xl">
        <div className="flex items-center">
          <h2 className="border-r p-2 md:p-4">{code}</h2>
          <b className="ml-2 whitespace-pre md:ml-4">{message ? message : STATUS_CODES[code]}</b>
        </div>
        <Link className="text-[0.65em] transition hover:text-pink-500 focus:text-pink-500" to={backTo.link}>
          {backTo.text}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
