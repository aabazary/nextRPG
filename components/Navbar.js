"use client";

import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // For icons
import { FaSpinner } from "react-icons/fa"; // For loading indicator
import AuthModal from "@/components/AuthModal"; // Import modal component
import Link from "next/link";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

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

  return (
    <>
      <nav className="bg-primary text-textLight py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-accent">
            NextRPG
          </Link>

          {/* Hamburger Menu Icon */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Links */}
          <ul
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:flex md:gap-6 gap-4 items-center text-center md:text-left md:static absolute left-0 top-[70px] w-full md:w-auto bg-primary md:bg-transparent z-10`}
          >
            <li className="py-2 md:py-0">
              <Link
                href="/high-scores"
                className="block hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                High Scores
              </Link>
            </li>
            {loading ? (
              <li className="py-2 md:py-0 flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                <span>Loading...</span>
              </li>
            ) : data?.me ? (
              <>
                <li className="py-2 md:py-0">
                  <Link
                    href="/game-dashboard"
                    className="block hover:text-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Game Dashboard
                  </Link>
                </li>
                <li className="py-2 md:py-0 text-accent">{data.me.username}</li>
                <li className="py-2 md:py-0">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-secondary px-4 py-2 rounded-md text-textLight hover:bg-primary"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="py-2 md:py-0">
                <button
                  className="block hover:text-accent"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                    setIsLogin(true);
                  }}
                >
                  Login / Signup
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isLogin={isLogin}
          closeModal={() => setIsAuthModalOpen(false)}
          toggleForm={() => setIsLogin(!isLogin)}
        />
      )}
    </>
  );
}
