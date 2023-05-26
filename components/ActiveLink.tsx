"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ActiveLinkProps {
  href: string;
  label: string;
  className?: string;
}

export default function ActiveLink({
  href,
  label,
  className = "",
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      className={`${isActive ? "text-secondary-main" : ""} ${className}`}
      href={href}
    >
      {label}
    </Link>
  );
}
