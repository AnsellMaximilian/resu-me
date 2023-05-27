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

export type Resume = Models.Document & {
  title: string;
  description: string;
  userId: string;
  test: Models.Document;
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
        process.env.NEXT_PUBLIC_BUCKED_ID as string
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
            <li key={resume.$id}>
              <div className="bg-white shadow-md rounded-md border-gray-300 border flex gap-4 items-center justify-between p-4 w-64 h-24">
                <div>
                  {resume.file ? (
                    resume.file.mimeType === "application/pdf" ? (
                      <PDF className="text-red-600" size={42} />
                    ) : (
                      <Word className="text-blue-800" size={42} />
                    )
                  ) : (
                    <div>No File.</div>
                  )}
                </div>
                <div className="whitespace-nowrap overflow-hidden">
                  <div className="text-md text-secondary-main font-bold text-ellipsis overflow-hidden">
                    {resume.title}
                  </div>
                  <div className="text-sm text-ellipsis overflow-hidden">
                    {resume.description
                      ? resume.description
                      : "No description."}
                  </div>
                  <div className="text-xs text-gray-400 text-ellipsis overflow-hidden">
                    File: {resume?.file?.name}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
