"use client";

import useAuth from "@/hooks/useAuth";
import { Models } from "appwrite";
import Link from "next/link";
import ActiveLink from "./ActiveLink";

export default function AppHeader() {
  const { currentAccount, logout } = useAuth();
  return (
    <header className="bg-white h-14 px-4 shadow-md flex items-center fixed top-0 inset-x-0">
      <nav className="flex justify-between items-center w-full">
        <div className="flex gap-8 items-center">
          <div className="font-bold text-lg">Resu-Me</div>
          <div>
            <ul className="flex gap-4 items-center text-sm">
              <li>
                <ActiveLink label="Dashboard" href="/app" />
              </li>
              {/* <li>
                <ActiveLink label="Resume" href="/app/resumes" />
              </li>
              <li>
                <ActiveLink label="Groups" href="/app/groups" />
              </li> */}
            </ul>
          </div>
        </div>
        <button onClick={logout} className="text-sm primary-btn">
          Logout
        </button>
      </nav>
    </header>
  );
}
