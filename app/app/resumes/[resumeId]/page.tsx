"use client";

import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Resume } from "@/components/ResumeList";
import { databases, storage } from "@/libs/appwrite";
import { Industry, Role, Skill } from "../upload/page";
import { Models, Query } from "appwrite";
import { BsEyeFill as Eye } from "react-icons/bs";
import { ImArrowDown as Download } from "react-icons/im";
import { MdModeEditOutline as Edit } from "react-icons/md";
import { AiOutlineLoading3Quarters as Spinner } from "react-icons/ai";

import {
  FaFilePdf as PDF,
  FaFileWord as Word,
  FaTrash as Trash,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Group } from "@/components/GroupList";
import Image from "next/image";

export default function ResumePage({
  params: { resumeId },
}: {
  params: { resumeId: string };
}) {
  const [resume, setResume] = useState<Resume>();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [file, setFile] = useState<Models.File>();
  const [group, setGroup] = useState<Group | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
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

      router.push("/app/");
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resume = (await databases.getDocument(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string,
          resumeId
        )) as Resume;
        setResume(resume);

        if (resume.skillIds?.length > 0) {
          const skills = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string,
            [Query.equal("$id", resume.skillIds)]
          );

          setSkills(skills.documents as Skill[]);
        }

        if (resume.industryIds?.length > 0) {
          const industries = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_INDUSTRY_COLLECTION_ID as string,
            [Query.equal("$id", resume.industryIds)]
          );

          setIndustries(industries.documents as Role[]);
        }

        if (resume.roleIds?.length > 0) {
          const roles = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_ROLE_COLLECTION_ID as string,
            [Query.equal("$id", resume.roleIds)]
          );

          setRoles(roles.documents as Role[]);
        }
        if (resume.groupId) {
          try {
            const group = await databases.getDocument(
              process.env.NEXT_PUBLIC_DATABASE_ID as string,
              process.env.NEXT_PUBLIC_GROUP_COLLECTION_ID as string,
              resume.groupId
            );

            setGroup(group as Group);
          } catch (error) {
            console.log("Group not found.");
          }
        }

        const file = await storage.getFile(
          process.env.NEXT_PUBLIC_BUCKET_ID as string,
          resume.$id
        );

        setFile(file);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [resumeId]);

  if (resume) {
    const url = file
      ? storage.getFileDownload(
          process.env.NEXT_PUBLIC_BUCKET_ID as string,
          file.$id
        )
      : undefined;

    return (
      <div className="p-4">
        <section>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 bg-white p-4 shadow-md rounded-md flex items-center justify-between">
              <div>
                <h2 className="text-gray-500">
                  {group ? group.name : "Not assigned to any group."}
                </h2>
                <h1 className="font-bold text-2xl">{resume.title}</h1>
              </div>
              <Link
                href={`/app/resumes/${resumeId}/edit`}
                className="outline-btn flex gap-2 items-center"
              >
                <Edit /> <span>Edit</span>
              </Link>
            </div>
            <div className="col-span-12 md:col-span-6 bg-white p-4 shadow-md rounded-md">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 col-span-12 md:col-span-6">
                <div className="sm:col-span-2">
                  <div className="mb-2 font-semibold text-gray-900">
                    Description
                  </div>
                  <p className="font-light">
                    {resume.description
                      ? resume.description
                      : "No description."}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <div className="mb-2 font-semibold text-gray-900">Skills</div>
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <li key={skill.$id}>
                          <span className="badge--outline">{skill.name}</span>
                        </li>
                      ))
                    ) : (
                      <p className="font-light">No skills assigned.</p>
                    )}
                  </ul>
                </div>
                <div className="sm:col-span-2">
                  <div className="mb-2 font-semibold text-gray-900">
                    Industries
                  </div>
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {industries.length > 0 ? (
                      industries.map((industry) => (
                        <li key={industry.$id}>
                          <span className="badge--outline">
                            {industry.name}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="font-light">No industries assigned.</p>
                    )}
                  </ul>
                </div>
                <div className="sm:col-span-2">
                  <div className="mb-2 font-semibold text-gray-900">Roles</div>
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <li key={role.$id}>
                          <span className="badge--outline">{role.name}</span>
                        </li>
                      ))
                    ) : (
                      <p className="font-light">No roles assigned.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 bg-white p-4 shadow-md rounded-md">
              {file && url ? (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 col-span-12 md:col-span-6">
                  <div className="sm:col-span-2">
                    <div className="mb-2 flex gap-2 items-center">
                      <div className="font-semibold text-gray-900">
                        Resume File
                      </div>
                      <div className="text-gray-500 text-xs flex items-baseline gap-1">
                        <div>{file.name}</div>
                        {file.mimeType === "application/pdf" ? (
                          <PDF className="text-pdf" />
                        ) : (
                          <Word className="text-word" />
                        )}
                      </div>
                    </div>
                    {file.mimeType === "application/pdf" ? (
                      <div className="w-72 h-64 aspect-square flex--center">
                        <iframe
                          src={
                            url.href.replace("download", "view") + "#toolbar=0"
                          }
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full flex-col justify-center items-center flex">
                        <Image
                          src="/files.svg"
                          alt="files"
                          height={632.17383}
                          width={647.63626}
                          className="max-w-full w-64"
                        />
                        <div className="mt-4 text-md">No Preview Available</div>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex gap-4 flex-wrap">
                      <a
                        href={url.href}
                        className="primary-btn flex gap-2 items-center"
                      >
                        <Download /> <span>Download</span>
                      </a>
                      <button
                        className="btn danger-btn flex gap-2 items-center"
                        onClick={handleDelete}
                      >
                        <Trash /> <span>Delete</span>
                      </button>
                      <a
                        className="outline-btn flex gap-2 items-center"
                        href={url.href.replace("download", "view")}
                        target="_blank"
                      >
                        <Eye /> <span>View File</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-span12 flex--center h-full">
                  <Spinner
                    size={64}
                    className="animate-spin text-secondary-main"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
        <ToastContainer />
      </div>
    );
  }

  return <div>Loading</div>;
}
