import AppHeader from "@/components/AppHeader";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AppHeader />
      <div className="p-4 bg-primary-main mt-12">{children}</div>
    </div>
  );
}
