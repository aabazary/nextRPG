"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GameDashboardLayout({ children }) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

  }, []);

  if (!isMounted) {
    return null; // Avoid rendering during SSR
  }

  return (
    <div>
      <nav className="relative flex space-x-4 border-b pb-1">
        {[
          { href: "/game-dashboard", label: "Profile" },
          { href: "/game-dashboard/gather", label: "Gather" },
          { href: "/game-dashboard/mob-grind", label: "Mob Grind" },
          { href: "/game-dashboard/quest", label: "Quest" },
          { href: "/game-dashboard/shop", label: "Shop" },
          { href: "/game-dashboard/upgrade", label: "Upgrade" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`relative px-4 py-2 rounded-t-lg transition-all duration-300 ${
              pathname === item.href
                ? "bg-secondary text-textLight shadow-md"
                : "group hover:text-secondary"
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
      <div className="mt-2">{children}</div>
    </div>
  );
}
