import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import "./globals.css";
import Product from "./pages/Product";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/products/:id",
    element: <Product />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
