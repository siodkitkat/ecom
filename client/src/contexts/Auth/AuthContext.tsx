import { useQuery } from "@tanstack/react-query";
import React, { createContext } from "react";
import { User, UserSchema } from "../../types";

const DEFAULT_CONTEXT: {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
} = { user: null, isLoggedIn: false, isLoading: false };

export const AuthQueryKey = "auth-me" as const;

export const AuthContext = createContext(DEFAULT_CONTEXT);

const FIVE_MINUTES = 1000 * 60 * 5;

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const { data: user = null, isFetching } = useQuery([AuthQueryKey], {
    queryFn: async () => {
      try {
        const req = await fetch("/api/me");

        if (req.ok) {
          return UserSchema.parse((await req.json()).user);
        }

        return null;
      } catch (e) {
        return null;
      }
    },

    staleTime: FIVE_MINUTES,
  });

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isLoggedIn: user !== null,
        isLoading: isFetching,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
