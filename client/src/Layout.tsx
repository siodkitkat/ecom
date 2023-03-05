import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PageSpinner from "./components/PageSpinner";
import useAuth from "./hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { defaultAnimationTransition, getAnimationVariant } from "./utils/animationHelpers";

const Layout = () => {
  const { isLoading } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <Navbar />
          <motion.div
            key={location.key}
            variants={getAnimationVariant("fade")}
            initial={"hidden"}
            animate={"visible"}
            exit={"hidden"}
            transition={defaultAnimationTransition}
          >
            <Outlet />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Layout;
