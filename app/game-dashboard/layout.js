"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";

export default function GameDashboardLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState(""); 
  const pathname = usePathname();

  const { data, loading } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const hasActiveCharacter = !!data?.me?.activeCharacter;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer); 
    }
  }, [message]);

  if (!isMounted || loading) {
    return null; 
  }

  const navItems = [
    { href: "/game-dashboard", label: "Profile", requiresCharacter: false },
    { href: "/game-dashboard/gather", label: "Gather", requiresCharacter: true },
    { href: "/game-dashboard/mob-grind", label: "Mob Grind", requiresCharacter: true },
    { href: "/game-dashboard/quest", label: "Quest", requiresCharacter: true },
    { href: "/game-dashboard/shop", label: "Shop", requiresCharacter: true },
    { href: "/game-dashboard/upgrade", label: "Upgrade", requiresCharacter: true },
  ];

  return (
    <div>
      <nav className="relative flex space-x-4 border-b pb-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.requiresCharacter && !hasActiveCharacter ? undefined : item.href}
            onClick={(e) => {
              if (item.requiresCharacter && !hasActiveCharacter) {
                e.preventDefault();
                setMessage("Please select an active character to access this section.");
              } else {
                setMessage("");
              }
            }}
            className={`relative px-4 py-2 rounded-t-lg transition-all duration-300 ${
              pathname === item.href
                ? "bg-secondary text-textLight shadow-md"
                : "group hover:text-secondary"
            } ${
              item.requiresCharacter && !hasActiveCharacter
                ? "cursor-not-allowed text-gray-400 hover:text-gray-400"
                : ""
            }`}
          >
            {/* Active tab background */}
            <span
              className={`absolute left-0 bottom-[-4px] w-full h-1 bg-secondary transform scale-x-0 origin-center transition-transform duration-300 ${
                pathname === item.href ? "scale-x-100" : ""
              }`}
            />
            {/* Hover tab background */}
            <span
              className={`absolute left-0 bottom-[-4px] w-full h-1 bg-primary transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100`}
            />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Display message if no active character */}
      {message && (
        <div className="mt-2 p-2 text-red-500 bg-red-100 border border-red-300 rounded">
          {message}
        </div>
      )}

      <div className="mt-2">{children}</div>
    </div>
  );
}
