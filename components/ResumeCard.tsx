import React from "react";
import { Resume } from "./ResumeList";
import {
  FaFilePdf as PDF,
  FaFileWord as Word,
  FaTrash as Trash,
} from "react-icons/fa";

import { RiMoreLine } from "react-icons/ri";
import { Menu } from "@headlessui/react";

export default function ResumeCard({
  resume,
  handleDelete,
}: {
  resume: Resume;
  handleDelete: (resumeId: string) => Promise<boolean>;
}) {
  return (
    <div className="bg-white shadow-md rounded-md border-gray-300 border flex gap-4 items-center justify-start p-4 w-64 h-24 relative">
      <Menu as="div" className="absolute top-0 right-0 text-right">
        <Menu.Button className="p-1">
          <RiMoreLine />
        </Menu.Button>
        <Menu.Items className="absolute text-xs z-50 right-0 shadow-lg origin-top-right bg-white mt-1 w-32 ring-1 ring-gray-200 rounded-lg overflow-hidden">
          <Menu.Item>
            <button
              onClick={() => handleDelete(resume.$id)}
              className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
            >
              <Trash size={10} className="text-gray-600" /> Delete
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>

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
          {resume.description ? resume.description : "No description."}
        </div>
        <div className="text-xs text-gray-400 text-ellipsis overflow-hidden">
          File: {resume?.file?.name}
        </div>
      </div>
    </div>
  );
}
