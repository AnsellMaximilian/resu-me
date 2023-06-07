"use client";

import CheckBoxList, { Checkbox } from "@/components/CheckBoxList";
import { Group } from "@/components/GroupList";
import ResumeForm, { SumbitFunction } from "@/components/ResumeForm";
import Spinner from "@/components/Spinner";
import useAuth from "@/hooks/useAuth";
import { account, databases, functions, storage } from "@/libs/appwrite";
import { ID, Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  FormEventHandler,
  useState,
  useEffect,
} from "react";
import { useDropzone, DropEvent, FileRejection } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  AiFillCaretLeft as Left,
  AiFillCaretRight as Right,
} from "react-icons/ai";
import Link from "next/link";

export interface Skill extends Models.Document {
  name: string;
  approved: boolean;
}

export interface Industry extends Models.Document {
  name: string;
  approved: boolean;
}

export interface Role extends Models.Document {
  name: string;
  approved: boolean;
}

export default function UploadResumePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { currentAccount } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    (async () => {
      const skills = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string,
          [Query.equal("approved", true)]
        )
      ).documents as Skill[];

      setSkills(skills);

      const industries = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_INDUSTRY_COLLECTION_ID as string,
          [Query.equal("approved", true)]
        )
      ).documents as Industry[];

      setIndustries(industries);

      const roles = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_ROLE_COLLECTION_ID as string,
          [Query.equal("approved", true)]
        )
      ).documents as Role[];

      setRoles(roles);

      const groups = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_GROUP_COLLECTION_ID as string
        )
      ).documents as Group[];

      setGroups(groups);
    })();
  }, []);

  const handleSubmit: SumbitFunction = async (
    title,
    description,
    acceptedFiles,
    skillCheckboxes,
    roleCheckboxes,
    industryCheckboxes,
    selectedGroupId
  ) => {
    try {
      if (!title) throw new Error("Title field is required.");
      if (acceptedFiles.length <= 0)
        throw new Error("Please select a resume file.");

      if (!currentAccount) throw new Error("Please log in.");

      const id = uuidv4();

      const file = await storage.createFile(
        process.env.NEXT_PUBLIC_BUCKET_ID as string,
        id,
        acceptedFiles[0]
      );

      const selectedSkillIds = skillCheckboxes
        .filter((box) => box.checked)
        .map((box) => box.item.$id);

      const selectedIndustryIds = industryCheckboxes
        .filter((box) => box.checked)
        .map((box) => box.item.$id);

      const selectedRoleIds = roleCheckboxes
        .filter((box) => box.checked)
        .map((box) => box.item.$id);

      const resume = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string,
        id,
        {
          title,
          description,
          userId: currentAccount.$id,
          skillIds: selectedSkillIds,
          industryIds: selectedIndustryIds,
          roleIds: selectedRoleIds,
          groupId: selectedGroupId === "none" ? null : selectedGroupId,
        }
      );

      router.push("/app");

      toast.success("Resume uploaded.");
    } catch (error: any) {
      if (Object.hasOwn(error, "message")) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        <Link href="/app" className="flex gap-1 items-center hover:underline">
          <Left />
          <span>Go back</span>
        </Link>
      </div>
      <section className="bg-white p-4 rounded-md shadow">
        {/* <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16"> */}
        <div className="">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Upload Resume
          </h2>
          <ResumeForm
            onSubmit={handleSubmit}
            skills={skills}
            roles={roles}
            industries={industries}
            groups={groups}
          />
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
