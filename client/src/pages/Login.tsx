import React, { useState } from "react";
import Button from "../components/Button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new URLSearchParams({
      username: username,
      password: password,
    });

    const req = await fetch("/api/login", {
      body: body,
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    });

    const res = await req.json();

    console.log(res);
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

export default Login;
