"use client";

import { storage } from "@/libs/appwrite";
import { ID } from "appwrite";
import React, { useCallback, FormEventHandler, useState } from "react";
import { useDropzone, DropEvent, FileRejection } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";

export default function UploadResumePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // FILE HANDLING
  const handleOnFileChosen: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles);
  }, []);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop: handleOnFileChosen,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/msword": [".doc"],
      },
    });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (!title) throw new Error("Title field is required.");
      if (acceptedFiles.length <= 0)
        throw new Error("Please select a resume file.");

      const file = await storage.createFile(
        process.env.NEXT_PUBLIC_BUCKED_ID as string,
        ID.unique(),
        acceptedFiles[0]
      );

      toast.success("Resume uploaded.");
    } catch (error: any) {
      if (Object.hasOwn(error, "message")) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
  };
  return (
    <div className="p-4">
      <div className="head-text">Upload Resume</div>
      <section className="bg-white">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Upload Resume
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  name="title"
                  id="title"
                  className="input"
                  placeholder="Type resume title"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  rows={8}
                  className="input"
                  placeholder="Your description here"
                ></textarea>
              </div>
              <div className="sm:col-span-2">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="file_input"
                >
                  Upload Resume File
                </label>
                <div
                  {...getRootProps({
                    className:
                      "input text-gray-400 h-16 flex items-center border-dashed",
                  })}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the resume file here ...</p>
                  ) : (
                    <p>
                      {acceptedFiles.length > 0
                        ? `File Chosen: ${acceptedFiles[0].name}`
                        : "Drag and drop some your resume file here, or click to browse."}
                    </p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500" id="file_input_help">
                  PDF, DOC, or DOCX (MAX. 400 MB).
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm primary-btn"
            >
              Upload
            </button>
          </form>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
