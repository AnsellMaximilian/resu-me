"use client";

import useAuth, { UserObject } from "@/hooks/useAuth";
import { avatars } from "@/libs/appwrite";
import { Menu } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { BiLogOut as LogoutIcon } from "react-icons/bi";
import { MdAdminPanelSettings as AdminLogo } from "react-icons/md";

export default function UserMenu({
  adminPage = false,
}: {
  adminPage?: boolean;
}) {
  const { currentAccount, logout } = useAuth();

  if (currentAccount)
    return (
      <Menu as="div" className="relative">
        <Menu.Button className="p-1">
          <div className="flex items-center gap-2">
            <Image
              src={avatars.getInitials(currentAccount.name).href}
              alt="user initials"
              width={adminPage ? 40 : 32}
              height={adminPage ? 40 : 32}
              className="rounded-full bg-white"
            />
            <div className="flex flex-col items-start">
              <div>{currentAccount.name}</div>
              {currentAccount.isAdmin && adminPage && (
                <div className="text-xs text-gray-100">Admin</div>
              )}
            </div>
          </div>
        </Menu.Button>
        <Menu.Items className="absolute text-sm z-50 right-0 shadow-lg origin-top-right bg-white mt-1 w-48 ring-1 ring-gray-200 rounded-lg overflow-hidden flex flex-col text-black">
          {currentAccount.isAdmin && (
            <Menu.Item>
              <Link
                // onClick={logout}
                href="/admin"
                className="flex items-center gap-2 p-2 hover:bg-primary-main border-t border-gray-200"
              >
                <AdminLogo /> <span>Admin Page</span>
              </Link>
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
    );

  return <Skeleton count={1} width={120} />;
}
