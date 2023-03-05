import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthForm from "../components/AuthForm";
import { refetchUser } from "../contexts/Auth/utils";

const Register = () => {
  const queryClient = useQueryClient();

  const { mutate: register, isLoading } = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (isLoading) {
        return;
      }

      const body = new URLSearchParams({
        username: username,
        password: password,
      });

      await fetch("/api/register", {
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
      title={"Register"}
      image="/images/login-lg.jpeg"
      onSubmit={async (values, e) => {
        e.preventDefault();

        if (!isLoading) {
          register(values);
        }

        return false;
      }}
    />
  );
};

export default Register;
