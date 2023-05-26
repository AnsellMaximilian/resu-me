import AppHeader from "@/components/AppHeader";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppHeader />
      <div className="min-h-screen bg-primary-main mt-14">{children}</div>
    </div>
  );
}
