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
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import { Droppable } from "react-beautiful-dnd";
import { RESUME_LIST_DROP_ID } from "@/constants/dragAndDrop";

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
  isLoading,
}: {
  resumes: Resume[];
  handleDelete: (resumeId: string) => Promise<boolean>;
  isLoading: boolean;
}) {
  return (
    <Droppable droppableId={RESUME_LIST_DROP_ID}>
      {(provided) => {
        return (
          <section ref={provided.innerRef} {...provided.droppableProps}>
            <header className="flex justify-between items-end mb-4">
              <div className="head-text">Resumes</div>
              <Link
                href="/app/resumes/upload"
                className="flex items-center justify-between gap-2 outline-btn"
              >
                <span>Upload</span> <Plus />
              </Link>
            </header>
            {!isLoading ? (
              resumes.length > 0 ? (
                <ul className="flex gap-4 flex-wrap">
                  {resumes.map((resume, index) => (
                    <ResumeCard
                      draggableIndex={index}
                      key={resume.$id}
                      resume={resume}
                      handleDelete={handleDelete}
                    />
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Image
                    src="/empty.svg"
                    alt="empty"
                    height={632.17383}
                    width={647.63626}
                    className="max-w-full w-64"
                  />
                  <h2 className="text-xl font-medium">It&apos;s Empty Here</h2>
                </div>
              )
            ) : (
              <Skeleton count={5} height={40} />
            )}
            {provided.placeholder}
          </section>
        );
      }}
    </Droppable>
  );
}
