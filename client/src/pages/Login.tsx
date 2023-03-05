import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthForm from "../components/AuthForm";
import { refetchUser } from "../contexts/Auth/utils";

const Login = () => {
  const queryClient = useQueryClient();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (isLoading) {
        return;
      }

      const body = new URLSearchParams({
        username: username,
        password: password,
      });

      await fetch("/api/login", {
        body: body,
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      });
    },
    onSuccess: () => {
      //invalidate auth to force a refetch
      return refetchUser(queryClient);
    },
  });

  return (
    <AuthForm
      title={"Sign in"}
      image="/images/login-lg.jpeg"
      onSubmit={async ({ username, password }, e) => {
        e.preventDefault();
        if (isLoading) {
          return;
        }
        login({ username, password });
      }}
    />
  );
};

export default Login;
