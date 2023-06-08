import React from "react";
import { Resume } from "./ResumeList";
import {
  FaFilePdf as PDF,
  FaFileWord as Word,
  FaTrash as Trash,
} from "react-icons/fa";

import { RiMoreLine } from "react-icons/ri";
import { ImArrowDown as Download } from "react-icons/im";
import { BsEyeFill as Eye } from "react-icons/bs";
import { Menu } from "@headlessui/react";
import { MdModeEditOutline as Edit } from "react-icons/md";
import { storage } from "@/libs/appwrite";
import Link from "next/link";
import { useDrag } from "react-dnd";
import { GROUP_DROP_ID_PREFIX, dropItemTypes } from "@/constants/dragAndDrop";

export default function ResumeCard({
  resume,
  handleDelete,
  draggableIndex,
}: {
  resume: Resume;
  handleDelete: (resumeId: string) => Promise<boolean>;
  draggableIndex: number;
}) {
  const url = storage.getFileDownload(
    process.env.NEXT_PUBLIC_BUCKET_ID as string,
    resume.$id
  );

  const [{ isDragging }, drag] = useDrag(() => ({
    item: resume,
    type: dropItemTypes.RESUME,
    collect: (monitor) => {
      // console.log(monitor);
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
  }));
  return (
    <div
      ref={drag}
      className="bg-white shadow-md rounded-md border-gray-300 border flex gap-4 items-center justify-start p-4 w-full sm:w-64 h-24 relative"
    >
      <Menu as="div" className="absolute top-0 right-0 text-right">
        <Menu.Button className="p-1">
          <RiMoreLine />
        </Menu.Button>
        <Menu.Items className="absolute text-sm z-50 right-0 shadow-lg origin-top-right bg-white mt-1 w-32 ring-1 ring-gray-200 rounded-lg overflow-hidden">
          <Menu.Item>
            <button
              onClick={() => handleDelete(resume.$id)}
              className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
            >
              <Trash size={10} className="text-gray-600" /> Delete
            </button>
          </Menu.Item>
          <Menu.Item>
            <a
              download
              //   target="_blank"
              className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
              href={url.href}
            >
              <Download size={10} className="text-gray-600" /> Download
            </a>
          </Menu.Item>
          <Menu.Item>
            <Link
              className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
              href={`/app/resumes/${resume.$id}/edit`}
            >
              <Edit size={10} className="text-gray-600" /> Edit
            </Link>
          </Menu.Item>
          <Menu.Item>
            <a
              download
              target="_blank"
              className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
              href={url.href.replace("download", "view")}
            >
              <Eye size={10} className="text-gray-600" /> View File
            </a>
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
          <Link href={`/app/resumes/${resume.$id}`} className="hover:underline">
            {resume.title}
          </Link>
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
