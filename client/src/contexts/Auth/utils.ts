import { QueryClient } from "@tanstack/react-query";
import { AuthQueryKey } from "./AuthContext";

export const refetchUser = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: [AuthQueryKey],
    exact: true,
    refetchType: "all",
  });
};
