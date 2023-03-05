import React from "react";
import { motion } from "framer-motion";
import { getAnimationVariant, defaultAnimationTransition } from "../utils/animationHelpers";
import Loader from "./Loader";

const PageSpinner = ({ children }: React.PropsWithChildren) => {
  return (
    <motion.div
      className="absolute flex h-screen w-full items-center justify-center"
      variants={getAnimationVariant("fade")}
      initial={"hidden"}
      animate={"visible"}
      exiti={"hidden"}
      transition={defaultAnimationTransition}
    >
      <div className="flex max-w-max flex-col items-center gap-8 text-lg tracking-wider md:text-4xl">
        <Loader height="4em" width="4em" />
        {children}
      </div>
    </motion.div>
  );
};

export default PageSpinner;
