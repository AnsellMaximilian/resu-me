"use client";

import useAuth from "@/hooks/useAuth";
import { Models } from "appwrite";
import Link from "next/link";
import ActiveLink from "./ActiveLink";
import { Menu } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { avatars } from "@/libs/appwrite";
import { BiLogOut as LogoutIcon } from "react-icons/bi";
import { MdAdminPanelSettings as AdminLogo } from "react-icons/md";

export default function AppHeader() {
  const { currentAccount, logout } = useAuth();
  return (
    <header className="bg-white h-appheader-h px-4 flex items-center sticky top-0 inset-x-0 z-50 border-b border-gray-200">
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

        {currentAccount ? (
          <Menu as="div" className="relative">
            <Menu.Button className="p-1">
              <div className="flex items-center gap-2">
                <Image
                  src={avatars.getInitials(currentAccount.name).href}
                  alt="user initials"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>{currentAccount.name}</div>
              </div>
            </Menu.Button>
            <Menu.Items className="absolute text-sm z-50 right-0 shadow-lg origin-top-right bg-white mt-1 w-48 ring-1 ring-gray-200 rounded-lg overflow-hidden flex flex-col">
              {currentAccount.isAdmin && (
                <Menu.Item>
                  <button
                    // onClick={logout}
                    className="flex items-center gap-2 p-2 hover:bg-primary-main border-t border-gray-200"
                  >
                    <AdminLogo /> <span>Admin Page</span>
                  </button>
                </Menu.Item>
              )}

              <Menu.Item>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 p-2 hover:bg-primary-main border-t border-gray-200"
                >
                  <LogoutIcon /> <span>Logout</span>
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Skeleton count={1} width={120} />
        )}
      </nav>
    </header>
  );
}
