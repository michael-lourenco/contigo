"use client";

import { Icon } from "./icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: "LuHome", label: "Home", href: "/" },
  { icon: "LuHelpCircle", label: "Como Jogar", href: "/how_to_play" },
  { icon: "LuUser", label: "Perfil", href: "/player" },
] as const;

export function Footer() {
  const pathname = usePathname(); // Obtém a rota atual

  return (
    <footer className="sticky bottom-0 w-full bg-slate-800 p-4 shadow-lg">
      <nav className="flex justify-between items-center max-w-md mx-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center p-2 text-slate-300 hover:text-slate-50 ${
                isActive ? "bg-slate-700 text-white" : ""
              }`}
            >
              <Icon name={item.icon} className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
