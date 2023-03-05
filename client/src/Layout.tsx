import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import useAuth from "./hooks/useAuth";

const Layout = () => {
  const { isLoading } = useAuth();

  //To do create a proper spinner for loading here

  return isLoading ? (
    <p>Loading</p>
  ) : (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
