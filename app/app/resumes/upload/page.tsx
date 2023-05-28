"use client";

import CheckBoxList, { Checkbox } from "@/components/CheckBoxList";
import useAuth from "@/hooks/useAuth";
import { account, databases, functions, storage } from "@/libs/appwrite";
import { ID, Models, Query } from "appwrite";
import React, {
  useCallback,
  FormEventHandler,
  useState,
  useEffect,
} from "react";
import { useDropzone, DropEvent, FileRejection } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

interface Skill extends Models.Document {
  name: string;
}

export default function UploadResumePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { currentAccount } = useAuth();
  const [skillCheckboxes, setSkillCheckboxes] = useState<Checkbox<Skill>[]>([]);

  useEffect(() => {
    (async () => {
      const skills = (
        await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_SKILL_COLLECTION_ID as string,
          [Query.equal("approved", true)]
        )
      ).documents as Skill[];

      const skillCheckboxes: Checkbox<Skill>[] = skills.map((skill) => ({
        key: skill.$id,
        item: skill,
        checked: false,
      }));

      setSkillCheckboxes(skillCheckboxes);
    })();
  }, []);

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

      if (!currentAccount) throw new Error("Please log in.");

      const id = uuidv4();

      const file = await storage.createFile(
        process.env.NEXT_PUBLIC_BUCKED_ID as string,
        id,
        acceptedFiles[0]
      );

      const selectedSkillIds = skillCheckboxes.map((box) => box.item.$id);

      const resume = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string,
        id,
        {
          title,
          description,
          userId: currentAccount.$id,
          skillIds: selectedSkillIds,
        }
      );

      toast.success("Resume uploaded.");
    } catch (error: any) {
      console.log(error);
      if (Object.hasOwn(error, "message")) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
  };
  return (
    <div className="p-4">
      <section className="bg-white">
        {/* <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16"> */}
        <div className="">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Upload Resume
          </h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="grid grid-cols-12 gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 col-span-12 md:col-span-6">
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
            {/* METADATA */}
            <div className="col-span-12 md:col-span-6">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 col-span-12 md:col-span-6">
                <div className="sm:col-span-2">
                  <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Skills
                  </div>
                  <CheckBoxList
                    items={skillCheckboxes}
                    renderId={(checkbox) =>
                      checkbox.item.name + checkbox.item.$id
                    }
                    renderLabel={(checkbox) => checkbox.item.name}
                    handleCustomValueSubmit={async (customValue) => {
                      try {
                        const skillResponse = await functions.createExecution(
                          process.env
                            .NEXT_PUBLIC_FUNCTION_ID_SUMBIT_CUSTOM_SKILL as string,
                          JSON.stringify({ name: customValue })
                        );
                        const skill = JSON.parse(
                          skillResponse.response
                        ) as Skill;
                        const skillCheckbox: Checkbox<Skill> = {
                          key: skill.$id,
                          item: skill,
                          checked: false,
                        };
                        setSkillCheckboxes((prev) => [...prev, skillCheckbox]);
                        return true;
                      } catch (error) {
                        return false;
                      }
                    }}
                    setCheckboxes={setSkillCheckboxes}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-2.5 text-sm primary-btn"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
