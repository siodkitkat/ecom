import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./Layout";
import Home from "./pages/Home";
import GuestRoute from "./components/GuestRoute";
import Register from "./pages/Register";
import Product from "./pages/Products/Product";
import Products from "./pages/Products";
import { AuthProvider } from "./contexts/Auth";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProduct from "./pages/Products/CreateProduct";

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
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/create",
        element: (
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
