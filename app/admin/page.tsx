"use client";

import client, { account, databases, storage } from "@/libs/appwrite";
import { Account, Models } from "appwrite";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState, useMemo, useTransition } from "react";
import ResumeList, { Resume } from "@/components/ResumeList";
import { ToastContainer, toast } from "react-toastify";
import { Popover } from "@headlessui/react";
import { Skill, Industry, Role } from "../app/resumes/upload/page";
import CheckBoxList, { Checkbox } from "@/components/CheckBoxList";
import ResumeFilter, { FilterFunction } from "@/components/ResumeFilter";
import Sidebar from "@/components/admin/Sidebar";
import { Group } from "@/components/GroupList";
import { getAllGroupIds, getGroupParents, organizeGroups } from "@/helpers";
import Skeleton from "react-loading-skeleton";
import UserMenu from "@/components/UserMenu";
import { FaPlus as Plus } from "react-icons/fa";
import { HiBars3CenterLeft as SidebarOpenLogo } from "react-icons/hi2";
import ApprovalTable from "@/components/admin/ApprovalTable";

export default function AppPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCollectionTab, setSelectedCollectionTab] = useState<
    string | null
  >(process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string);

  useEffect(() => {
    (async () => {
      const skills = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string
      );

      setSkills(skills.documents as Skill[]);

      const industries = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_INDUSTRY_COLLECTION_ID as string
      );

      setIndustries(industries.documents as Role[]);

      const roles = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_ROLE_COLLECTION_ID as string
      );

      setRoles(roles.documents as Role[]);

      setIsLoading(false);
    })();
  }, []);

  async function handleApproveCollection<T>(
    collectionId: string,
    documentId: string,
    value: boolean
  ): Promise<T | false> {
    try {
      const res = (await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        collectionId,
        documentId,
        { approved: value }
      )) as T;
      return res;
    } catch (error) {
      return false;
    }
  }

  return (
    <div className="bg-primary-main h-full">
      <Sidebar
        selectedCollectionTab={selectedCollectionTab}
        setSelectedCollectionTab={setSelectedCollectionTab}
        open={isSidebarOpen}
        skills={skills}
        roles={roles}
        industries={industries}
      />
      <div
        className={`${
          isSidebarOpen ? "ml-sidebar-w-open" : "ml-0"
        } h-full transition-all duration-75`}
      >
        <header className="bg-white border-b border-gray-200 p-4 flex items-center sticky top-0 w-full z-50">
          <button
            className="hover:text-secondary-main"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <SidebarOpenLogo size={20} />
          </button>
        </header>
        <div className="p-4">
          <ApprovalTable
            onApprove={async (collectionId, documentId, value) => {
              const skill = await handleApproveCollection<Skill>(
                collectionId,
                documentId,
                value
              );
              if (skill) {
                setSkills((prev) =>
                  prev.map((item) =>
                    item.$id === documentId
                      ? { ...item, approved: value }
                      : item
                  )
                );
                return true;
              }
              return false;
            }}
            name="Skills"
            selectedCollectionTab={selectedCollectionTab}
            collectionId={process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string}
            items={skills}
            renderId={(item) => item.$id}
            renderApproval={(item) => item.approved}
            renderName={(item) => item.name}
          />
          <ApprovalTable
            onApprove={async (collectionId, documentId, value) => {
              const role = await handleApproveCollection<Role>(
                collectionId,
                documentId,
                value
              );
              if (role) {
                setRoles((prev) =>
                  prev.map((item) =>
                    item.$id === documentId
                      ? { ...item, approved: value }
                      : item
                  )
                );
                return true;
              }
              return false;
            }}
            name="Roles"
            selectedCollectionTab={selectedCollectionTab}
            collectionId={process.env.NEXT_PUBLIC_ROLE_COLLECTION_ID as string}
            items={roles}
            renderId={(item) => item.$id}
            renderApproval={(item) => item.approved}
            renderName={(item) => item.name}
          />
          <ApprovalTable
            onApprove={async (collectionId, documentId, value) => {
              const industry = await handleApproveCollection<Industry>(
                collectionId,
                documentId,
                value
              );
              if (industry) {
                setIndustries((prev) =>
                  prev.map((item) =>
                    item.$id === documentId
                      ? { ...item, approved: value }
                      : item
                  )
                );
                return true;
              }
              return false;
            }}
            name="Industries"
            selectedCollectionTab={selectedCollectionTab}
            collectionId={
              process.env.NEXT_PUBLIC_INDUSTRY_COLLECTION_ID as string
            }
            items={industries}
            renderId={(item) => item.$id}
            renderApproval={(item) => item.approved}
            renderName={(item) => item.name}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
