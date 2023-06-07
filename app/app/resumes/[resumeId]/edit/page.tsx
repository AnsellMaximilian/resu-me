"use client";

import CheckBoxList, { Checkbox } from "@/components/CheckBoxList";
import { Group } from "@/components/GroupList";
import ResumeForm, {
  SumbitFunction,
  WithChecked,
} from "@/components/ResumeForm";
import { Resume } from "@/components/ResumeList";
import Spinner from "@/components/Spinner";
import useAuth from "@/hooks/useAuth";
import { account, databases, functions, storage } from "@/libs/appwrite";
import { ID, Models, Query } from "appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useMemo,
  FormEventHandler,
  useState,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  AiFillCaretLeft as Left,
  AiFillCaretRight as Right,
} from "react-icons/ai";

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

export default function EditResumePage({
  params: { resumeId },
}: {
  params: { resumeId: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { currentAccount } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [resume, setResume] = useState<Resume>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("none");

  useEffect(() => {
    (async () => {
      const resume = (await databases.getDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string,
        resumeId
      )) as Resume;
      setTitle(resume.title);
      setDescription(resume.description);

      const skills = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string
        )
      ).documents as WithChecked<Skill>[];

      setSkills(
        skills
          .filter((item) => item.approved || resume.skillIds.includes(item.$id))
          .map((item) =>
            resume.skillIds.includes(item.$id)
              ? { ...item, checked: true }
              : item
          )
      );

      const industries = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_INDUSTRY_COLLECTION_ID as string
        )
      ).documents as WithChecked<Industry>[];

      setIndustries(
        industries
          .filter(
            (item) => item.approved || resume.industryIds.includes(item.$id)
          )
          .map((item) =>
            resume.industryIds.includes(item.$id)
              ? { ...item, checked: true }
              : item
          )
      );

      const roles = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_ROLE_COLLECTION_ID as string
        )
      ).documents as WithChecked<Role>[];

      setRoles(
        roles
          .filter((item) => item.approved || resume.roleIds.includes(item.$id))
          .map((item) =>
            resume.roleIds.includes(item.$id)
              ? { ...item, checked: true }
              : item
          )
      );
      setResume(resume);
      const groups = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_GROUP_COLLECTION_ID as string
        )
      ).documents as Group[];

      setGroups(groups);

      // Group ID
      const resumeGroup = groups.find((g) => g.$id === resume.groupId);
      if (resumeGroup) {
        setSelectedGroupId(resume.groupId === null ? "none" : resume.groupId);
      }
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

      if (!currentAccount) throw new Error("Please log in.");

      if (acceptedFiles.length > 0) {
        await storage.deleteFile(
          process.env.NEXT_PUBLIC_BUCKET_ID as string,
          resumeId
        );
        const file = await storage.createFile(
          process.env.NEXT_PUBLIC_BUCKET_ID as string,
          resumeId,
          acceptedFiles[0]
        );
      }

      const selectedSkillIds = skillCheckboxes
        .filter((box) => box.checked)
        .map((box) => box.item.$id);

      const selectedIndustryIds = industryCheckboxes
        .filter((box) => box.checked)
        .map((box) => box.item.$id);

      const selectedRoleIds = roleCheckboxes
        .filter((box) => box.checked)
        .map((box) => box.item.$id);

      const resume = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string,
        resumeId,
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

      toast.success("Resume updated.");
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
      <section className="bg-white p-4 rounded-sm shadow">
        {/* <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16"> */}
        <div className="">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Edit Resume {title}
          </h2>
          <ResumeForm
            groups={groups}
            onSubmit={handleSubmit}
            skills={skills}
            roles={roles}
            industries={industries}
            oldTitle={title}
            oldDescription={description}
            oldGroupId={selectedGroupId}
            edit
          />
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
