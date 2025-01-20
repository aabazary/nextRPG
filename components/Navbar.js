"use client";

import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import Link from "next/link";
import { useEffect, useState } from "react";

const getAuthToken = () => {
  const cookies = document.cookie.split(";");
  let token = null;
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key.trim() === "authToken") {
      token = value;
    }
  });
  return token;
};

export default function Navbar() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromCookies = getAuthToken();
    setToken(tokenFromCookies);
  }, []);

  const { data, error, loading } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
    skip: !token,
  });

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  useEffect(() => {
    if (error && error.message.includes("Token")) {
      handleLogout();
    }
  }, [error]);

  if (loading) return <div>Loading...</div>;

  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/high-scores">High Scores</Link></li>
        {data?.me ? (
          <>
            <li><Link href="/game-dashboard">Game Dashboard</Link></li>
            <li>{data.me.username}</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link href="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
