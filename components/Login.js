"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/app/api/graphql/mutations";

export default function Login() {
  const [login] = useMutation(LOGIN_MUTATION);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const sanitizedEmail=email.toLowerCase()
      const { data } = await login({ variables: { email:sanitizedEmail, password } });
      document.cookie = `authToken=${data.login.token}; path=/`;
      alert("Login successful!");
      window.location.href = "/game-dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
