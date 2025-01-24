"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/app/api/graphql/mutations";

export default function Login() {
  const [login] = useMutation(LOGIN_MUTATION);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedbackMessage(null); // Clear previous messages
    try {
      const sanitizedEmail = email.toLowerCase();
      const { data } = await login({ variables: { email: sanitizedEmail, password } });
      document.cookie = `authToken=${data.login.token}; path=/`;
      setFeedbackMessage({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(() => {
        window.location.href = "/game-dashboard";
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setFeedbackMessage({ type: "error", message: err.message });
    }
  };

  return (
    <div>
      {feedbackMessage && (
        <p
          className={`${
            feedbackMessage.type === "success" ? "text-green-500" : "text-red-500"
          } mb-4`}
        >
          {feedbackMessage.message}
        </p>
      )}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-accent"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-accent"
        />
        <button
          type="submit"
          className="bg-secondary text-textLight py-2 rounded-lg hover:bg-primary transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}
