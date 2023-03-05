import React, { useState } from "react";
import Button from "../components/Button";

const Test = () => {
  const [key, setKey] = useState("");

  return (
    <div>
      <form action="/api/images" encType="multipart/form-data" method="POST">
        <input type="file" name="image" />
        <Button type="submit">Upload</Button>
      </form>
      Delete
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const body = new URLSearchParams({
            key: key,
          });

          const req = await fetch("/api/images", {
            method: "DELETE",
            body: body,
          });

          console.log(await req.json());
        }}
      >
        <input
          name="key"
          value={key}
          onChange={(e) => {
            setKey(e.currentTarget.value);
          }}
        />
        <Button type="submit">Delete</Button>
      </form>
    </div>
  );
};

export default Test;
