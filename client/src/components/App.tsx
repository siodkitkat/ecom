import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "../Layout";
import Home from "../pages/Home";
import GuestRoute from "./GuestRoute";
import Register from "../pages/Register";
import Product from "../pages/Product";
import { AuthProvider } from "../contexts/Auth";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      {
        path: "/products/:id",
        element: <Product />,
      },
    ],
  },
]);

const App = () => {
  const [queryClient] = useState(new QueryClient());

  //To do make a component that throws a loader while auth is loading and if loaded returns router provider

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
