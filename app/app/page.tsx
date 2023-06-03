"use client";

import client, { account, databases, storage } from "@/libs/appwrite";
import { Account, Models } from "appwrite";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState, useMemo } from "react";
import ResumeList, { Resume } from "@/components/ResumeList";
import { ToastContainer, toast } from "react-toastify";
import { Popover } from "@headlessui/react";
import { Skill, Industry, Role } from "./resumes/upload/page";
import CheckBoxList, { Checkbox } from "@/components/CheckBoxList";
import ResumeFilter, { FilterFunction } from "@/components/ResumeFilter";
import Sidebar, { Group } from "@/components/Sidebar";

export default function AppPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const approvedSkills = useMemo(
    () => skills.filter((item) => item.approved),
    [skills]
  );
  const approvedRoles = useMemo(
    () => roles.filter((item) => item.approved),
    [roles]
  );
  const approvedIndustries = useMemo(
    () => industries.filter((item) => item.approved),
    [industries]
  );

  useEffect(() => {
    (async () => {
      const resumeDocuments = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string
      );
      const resumeFiles = await storage.listFiles(
        process.env.NEXT_PUBLIC_BUCKET_ID as string
      );

      const resumes: Resume[] = resumeDocuments.documents.map((doc) => {
        const resume = { ...doc };
        resume.title = doc.title as string;
        resume.description = doc.description as string;
        resume.file =
          resumeFiles.files.find((file) => file.$id === resume.$id) || null;
        return resume as Resume;
      });

      setResumes(resumes);
      setFilteredResumes(resumes);

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

      const groups = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_GROUP_COLLECTION_ID as string
      );

      setGroups(groups.documents as Group[]);
    })();
  }, []);

  const handleDelete = async (resumeId: string) => {
    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string,
        resumeId
      );

      await storage.deleteFile(
        process.env.NEXT_PUBLIC_BUCKET_ID as string,
        resumeId
      );
      setResumes((prev) => prev.filter((res) => res.$id !== resumeId));
      toast.success(`Deleted resume of id ${resumeId}`);
      return true;
    } catch (error) {
      toast.error(`Failed to delete.`);

      return false;
    }
  };

  const handleFilter: FilterFunction = (
    skillsCheckboxes,
    roleCheckboxes,
    industryCheckboxes,
    titleFilter
  ) => {
    const checkedSkillIds = skillsCheckboxes
      .filter((box) => box.checked)
      .map((box) => box.item.$id);
    const checkedRoleIds = roleCheckboxes
      .filter((box) => box.checked)
      .map((box) => box.item.$id);
    const checkedIndustryIds = industryCheckboxes
      .filter((box) => box.checked)
      .map((box) => box.item.$id);

    console.log(resumes[1], checkedSkillIds);

    setFilteredResumes((prev) =>
      resumes.filter((res) => {
        return (
          res.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
          (checkedSkillIds.length === 0 ||
            res.skillIds.some((id) => checkedSkillIds.includes(id))) &&
          (checkedRoleIds.length === 0 ||
            res.roleIds.some((id) => checkedRoleIds.includes(id))) &&
          (checkedIndustryIds.length === 0 ||
            res.industryIds.some((id) => checkedIndustryIds.includes(id)))
        );
      })
    );
  };

  return (
    <div className="bg-primary-main overflow-hidden h-full">
      <Sidebar groups={groups} />
      <div className="ml-sidebar-w-open h-full">
        <div className="p-4 h-full">
          <div className="mb-4">
            <ResumeFilter
              skills={approvedSkills}
              industries={approvedIndustries}
              roles={approvedRoles}
              onFilter={handleFilter}
            />
          </div>
          <ResumeList resumes={filteredResumes} handleDelete={handleDelete} />
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
