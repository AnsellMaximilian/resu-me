import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
