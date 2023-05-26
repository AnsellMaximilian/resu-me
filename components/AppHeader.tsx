"use client";

import useAuth from "@/hooks/useAuth";
import { Models } from "appwrite";
import Link from "next/link";
import ActiveLink from "./ActiveLink";

export default function AppHeader() {
  const { currentAccount, logout } = useAuth();
  return (
    <header className="py-3 px-4 shadow-md">
      <nav className="flex justify-between items-center">
        <div className="flex gap-8 items-center">
          <div className="font-bold text-lg">Resu-Me</div>
          <div>
            <ul className="flex gap-4 items-center text-sm">
              <li>
                <ActiveLink label="Dashboard" href="/app" />
              </li>
              <li>
                <ActiveLink label="Resume" href="/app/resume" />
              </li>
              <li>
                <ActiveLink label="Groups" href="/app/groups" />
              </li>
            </ul>
          </div>
        </div>
        <button
          onClick={logout}
          className="bg-secondary-main text-white px-4 py-1 rounded-md hover:bg-secondary-dark text-sm"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
