"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/",      icon: "🏠", label: "ホーム" },
  { href: "/plan",  icon: "📊", label: "プラン" },
  { href: "/trip",  icon: "🗺️", label: "ガイド" },
  { href: "/after", icon: "📝", label: "記録" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "430px",
        background: "#FFFFFF",
        borderTop: "1.5px solid #E2D9CC",
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", padding: "6px 0 8px" }}>
        {navItems.map(item => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                padding: "4px 0",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "22px", lineHeight: 1 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: isActive ? "#1D3D2A" : "#9CA3AF",
                  fontFamily: "inherit",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    width: "20px",
                    height: "3px",
                    borderRadius: "2px",
                    background: "#C2E03A",
                    marginTop: "1px",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
