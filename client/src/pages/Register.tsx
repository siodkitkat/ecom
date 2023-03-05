import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Button from "../components/Button";
import { refetchUser } from "../contexts/Auth/utils";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const { mutate: register, isLoading } = useMutation({
    mutationFn: async () => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoading) {
      register();
    }

    return false;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        username
        <input
          name="username"
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value);
          }}
        />
        password
        <input
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Register;
