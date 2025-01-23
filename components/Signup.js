"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/app/api/graphql/mutations";

export default function Signup() {
  const [signup] = useMutation(SIGNUP_MUTATION);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email,setEmail]=useState("")
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const sanitizedEmail = email.toLowerCase();
      const { data } = await signup({ variables: { username, email:sanitizedEmail, password } });
      document.cookie = `authToken=${data.signup.token}; path=/`;
      alert("Signup successful!");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignup}>
      <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
