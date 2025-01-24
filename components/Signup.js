"use client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "@/app/api/graphql/mutations";

export default function Signup() {
  const [signup] = useMutation(SIGNUP_MUTATION);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setFeedbackMessage(null); // Clear previous messages
    try {
      const sanitizedEmail = email.toLowerCase();
      const { data } = await signup({ variables: { username, email: sanitizedEmail, password } });
      document.cookie = `authToken=${data.signup.token}; path=/`;
      setFeedbackMessage({ type: "success", message: "Signup successful! Redirecting..." });
      setTimeout(() => {
        window.location.href = "/";
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
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-accent"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          Signup
        </button>
      </form>
    </div>
  );
}
