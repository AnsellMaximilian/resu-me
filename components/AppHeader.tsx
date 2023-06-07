"use client";

import useAuth from "@/hooks/useAuth";
import { Models } from "appwrite";
import Link from "next/link";
import ActiveLink from "./ActiveLink";
import UserMenu from "./UserMenu";
import Image from "next/image";

export default function AppHeader() {
  const { currentAccount, logout } = useAuth();
  return (
    <header className="bg-white px-4 flex items-center app-header border-b border-gray-200">
      <nav className="flex justify-between items-center w-full">
        <div className="flex gap-8 items-center">
          <Link href="/app">
            <Image src="/logo.svg" alt="logo" width={64} height={32} />
          </Link>
          <div>
            {/* <ul className="flex gap-4 items-center text-sm">
              <li>
                <ActiveLink label="Dashboard" href="/app" />
              </li>
            </ul> */}
          </div>
        </div>

        <UserMenu />
      </nav>
    </header>
  );
}
