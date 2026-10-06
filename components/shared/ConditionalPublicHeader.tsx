"use client";

import { usePathname } from "next/navigation";
import PublicHeader from "./PublicHeader";

const memberPrefixes = [
  "/dashboard", "/search", "/online", "/new-members", "/premium-members", "/health-cases",
  "/messages", "/notifications", "/profile", "/photos", "/knowledge", "/reports", "/safety-center",
  "/settings", "/blocks", "/profile-views", "/payments", "/engagement-wedding-photos", "/my-subscription",
  "/who-likes-me", "/mutual-interests", "/matches", "/visitors", "/interests", "/member-photos", "/members",
  "/privileges", "/auto-search", "/blocklist", "/myaccount"
];

const groupedMainPrefixes = ["/signup", "/contact", "/favorites", "/privacy", "/subscriptions"];

export default function ConditionalPublicHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (pathname === "/") return null;
  if (memberPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;
  if (groupedMainPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))) return null;
  return <PublicHeader />;
}
