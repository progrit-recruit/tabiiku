"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/plan",  label: "旅行前", icon: "📊", sub: "プランニング" },
  { href: "/trip",  label: "旅行中", icon: "🗺️", sub: "AIガイド" },
  { href: "/after", label: "旅行後", icon: "📝", sub: "思い出整理" },
];

export default function Header() {
  const path = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: "#FFFFFF", borderColor: "#E2D9CC" }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg"
            style={{ background: "#1D3D2A" }}
          >
            ✈️
          </div>
          <div className="leading-none">
            <span
              className="text-xl font-black tracking-tight"
              style={{ color: "#1D3D2A" }}
            >
              たびいく！
            </span>
            <div className="text-[10px] font-medium mt-0.5" style={{ color: "#9CA3AF" }}>
              家族旅行を一生モノの学びに
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={
                  active
                    ? { background: "#1D3D2A", color: "#FFFFFF" }
                    : { background: "transparent", color: "#6B7280" }
                }
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
