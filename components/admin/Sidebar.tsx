"use client";

import { ID, Models } from "appwrite";
import React, {
  useMemo,
  useState,
  Fragment,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import {
  AiFillCaretDown as Down,
  AiFillCaretRight as Right,
} from "react-icons/ai";
import { FaPlus as Plus } from "react-icons/fa";
import UserMenu from "../UserMenu";
import { Industry, Role, Skill } from "@/app/app/resumes/upload/page";
import CollectionTab from "./CollectionTab";

export default function Sidebar({
  open,
  skills,
  roles,
  industries,
  setSelectedCollectionTab,
  selectedCollectionTab,
}: {
  open: boolean;
  skills: Skill[];
  roles: Role[];
  industries: Industry[];
  setSelectedCollectionTab: Dispatch<SetStateAction<string | null>>;
  selectedCollectionTab: string | null;
}) {
  const unApprovedSkills = useMemo(
    () => skills.filter((item) => !item.approved),
    [skills]
  );
  const unApprovedRoles = useMemo(
    () => roles.filter((item) => !item.approved),
    [roles]
  );
  const unApprovedIndustries = useMemo(
    () => industries.filter((item) => !item.approved),
    [industries]
  );
  return (
    <div
      className={`${
        open ? "w-sidebar-w-open" : "w-0"
      } h-full bg-white fixed left-0 border-r border-gray-200 overflow-x-hidden transition-all duration-100`}
    >
      <div className="p-4">
        <h1 className="font-bold text-lg">Resu-Me</h1>
      </div>
      <div className="bg-secondary-main text-white p-4">
        <UserMenu adminPage />
      </div>
      <CollectionTab
        setSelectedCollectionTab={setSelectedCollectionTab}
        selectedCollectionTab={selectedCollectionTab}
        name="Skills"
        totalUnapproved={unApprovedSkills.length}
        collectionId={process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string}
      />
      <CollectionTab
        setSelectedCollectionTab={setSelectedCollectionTab}
        selectedCollectionTab={selectedCollectionTab}
        name="Roles"
        totalUnapproved={unApprovedRoles.length}
        collectionId={process.env.NEXT_PUBLIC_ROLE_COLLECTION_ID as string}
      />
      <CollectionTab
        setSelectedCollectionTab={setSelectedCollectionTab}
        selectedCollectionTab={selectedCollectionTab}
        name="Industries"
        totalUnapproved={unApprovedIndustries.length}
        collectionId={process.env.NEXT_PUBLIC_INDUSTRY_COLLECTION_ID as string}
      />
    </div>
  );
}
