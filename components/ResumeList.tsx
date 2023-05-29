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
};

export default function ResumeList() {
  const [resumes, setResumes] = useState<Resume[]>([]);

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
