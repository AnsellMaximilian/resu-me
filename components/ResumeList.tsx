"use client";
import { databases, storage } from "@/libs/appwrite";
import { Models } from "appwrite";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaPlus as Plus,
  FaFilePdf as PDF,
  FaFileWord as Word,
} from "react-icons/fa";
import ResumeCard from "./ResumeCard";
import { toast } from "react-toastify";

export type Resume = Models.Document & {
  title: string;
  description: string;
  userId: string;
  skillIds: string[];
  roleIds: string[];
  industryIds: string[];
  file: Models.File | null;
  groupId: string | null;
};

export default function ResumeList({
  resumes,
  handleDelete,
}: {
  resumes: Resume[];
  handleDelete: (resumeId: string) => Promise<boolean>;
}) {
  return (
    <section>
      <header className="flex justify-between items-end mb-4">
        <div className="head-text">Resumes</div>
        <Link
          href="/app/resumes/upload"
          className="flex items-center justify-between gap-2 outline-btn"
        >
          <span>Upload</span> <Plus />
        </Link>
      </header>
      {resumes.length > 0 && (
        <ul className="flex gap-4 flex-wrap">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.$id}
              resume={resume}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
