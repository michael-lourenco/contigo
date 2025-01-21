import { Icon } from "./icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const menuItems = [
  { icon: "LuHome", label: "Home", href: "/" },
  { icon: "LuLayoutDashboard", label: "Dashboard", href: "/player" },
  { icon: "LuHelpCircle", label: "Como Jogar", href: "/how_to_play" },
  { icon: "LuUser", label: "Perfil", href: "/player" },
] as const; // Use "as const" para garantir os tipos corretos.

export function Footer() {
  return (
    <footer className="sticky bottom-0 w-full bg-slate-800 p-4 shadow-lg">
      <nav className="flex justify-between items-center max-w-md mx-auto">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center text-slate-300 hover:text-slate-50"
            >
              <Icon name={item.icon} className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </footer>
  );
}
