"use client";

import React, {
  FormEventHandler,
  useState,
  useEffect,
  useCallback,
} from "react";
import Spinner from "@/components/Spinner";
import CheckBoxList, { Checkbox } from "./CheckBoxList";
import { useDropzone, DropEvent, FileRejection } from "react-dropzone";
import { Skill, Role, Industry } from "@/app/app/resumes/upload/page";
import { functions } from "@/libs/appwrite";
import { Group } from "./GroupList";
import Skeleton from "react-loading-skeleton";

export type SumbitFunction = (
  title: string,
  description: string,
  acceptedFiles: File[],
  skillCheckboxes: Checkbox<Skill>[],
  roleCheckboxes: Checkbox<Role>[],
  industryCheckboxes: Checkbox<Industry>[],
  selectedGroupId: string
) => Promise<void>;

export type WithChecked<T> = T & {
  checked?: boolean;
};

interface ResumeFormProps {
  onSubmit: SumbitFunction;
  skills: Array<Skill | WithChecked<Skill>>;
  industries: Array<Industry | WithChecked<Industry>>;
  roles: Array<Role | WithChecked<Role>>;
  oldTitle?: string;
  oldDescription?: string;
  oldGroupId?: string;
  edit?: boolean;
  groups: Group[];
}

export default function ResumeForm({
  onSubmit,
  skills,
  industries,
  roles,
  oldTitle,
  oldDescription,
  oldGroupId,
  edit = false,
  groups,
}: ResumeFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillCheckboxes, setSkillCheckboxes] = useState<Checkbox<Skill>[]>([]);
  const [industryCheckboxes, setIndustryCheckboxes] = useState<
    Checkbox<Industry>[]
  >([]);
  const [roleCheckboxes, setRoleCheckboxes] = useState<Checkbox<Role>[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("none");

  const handleSumbit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(
      title,
      description,
      acceptedFiles,
      skillCheckboxes,
      roleCheckboxes,
      industryCheckboxes,
      selectedGroupId
    );
    setSubmitting(false);
  };

  useEffect(() => {
    (async () => {
      if (oldTitle) {
        setTitle(oldTitle);
      }
      if (oldDescription) {
        setDescription(oldDescription);
      }

      if (oldGroupId) {
        setSelectedGroupId(oldGroupId);
      }
      const skillCheckboxes: Checkbox<Skill>[] = skills.map((skill) => ({
        key: skill.$id,
        item: skill,
        checked: !!skill.checked,
      }));

      setSkillCheckboxes(skillCheckboxes);

      const industryCheckboxes: Checkbox<Industry>[] = industries.map(
        (industry) => ({
          key: industry.$id,
          item: industry,
          checked: !!industry.checked,
        })
      );

      setIndustryCheckboxes(industryCheckboxes);

      const roleCheckboxes: Checkbox<Role>[] = roles.map((role) => ({
        key: role.$id,
        item: role,
        checked: !!role.checked,
      }));

      setRoleCheckboxes(roleCheckboxes);
    })();
  }, [skills, roles, industries, oldTitle, oldDescription, oldGroupId]);

  // FILE HANDLING
  const handleOnFileChosen: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void = useCallback((acceptedFiles) => {
    // Do something with the files
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

  const checkBoxesFinishedLoading =
    skillCheckboxes.length > 0 &&
    roleCheckboxes.length > 0 &&
    industryCheckboxes.length > 0;
  return (
    <form
      onSubmit={handleSumbit}
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
        <div className="sm:col-span-2">
          <label
            htmlFor="group"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Group
          </label>
          {groups.length > 0 ? (
            <select
              value={selectedGroupId}
              id="group"
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="input"
            >
              <option value="none">None</option>
              {groups.map((group) => (
                <option key={group.$id} value={group.$id}>
                  {group.name}
                </option>
              ))}
            </select>
          ) : (
            <Skeleton height={64} />
          )}
        </div>
      </div>
      {/* METADATA */}
      <div className="col-span-12 md:col-span-6">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 col-span-12 md:col-span-6">
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Skills
            </div>
            {checkBoxesFinishedLoading ? (
              <CheckBoxList
                items={skillCheckboxes}
                renderId={(checkbox) => checkbox.item.name + checkbox.item.$id}
                renderLabel={(checkbox) => checkbox.item.name}
                handleCustomValueSubmit={async (customValue) => {
                  try {
                    const skillResponse = await functions.createExecution(
                      process.env
                        .NEXT_PUBLIC_FUNCTION_ID_SUBMIT_CUSTOM_SKILL as string,
                      JSON.stringify({ name: customValue })
                    );
                    const skill = JSON.parse(skillResponse.response) as Skill;
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
            ) : (
              <Skeleton height={64} />
            )}
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Industry
            </div>
            {checkBoxesFinishedLoading ? (
              <CheckBoxList
                items={industryCheckboxes}
                renderId={(checkbox) => checkbox.item.name + checkbox.item.$id}
                renderLabel={(checkbox) => checkbox.item.name}
                handleCustomValueSubmit={async (customValue) => {
                  try {
                    const industryResponse = await functions.createExecution(
                      process.env
                        .NEXT_PUBLIC_FUNCTION_ID_SUBMIT_CUSTOM_INDUSTRY as string,
                      JSON.stringify({ name: customValue })
                    );
                    const industry = JSON.parse(
                      industryResponse.response
                    ) as Industry;
                    const industryCheckbox: Checkbox<Industry> = {
                      key: industry.$id,
                      item: industry,
                      checked: false,
                    };
                    setIndustryCheckboxes((prev) => [
                      ...prev,
                      industryCheckbox,
                    ]);
                    return true;
                  } catch (error) {
                    return false;
                  }
                }}
                setCheckboxes={setIndustryCheckboxes}
              />
            ) : (
              <Skeleton height={64} />
            )}
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Roles
            </div>
            {checkBoxesFinishedLoading ? (
              <CheckBoxList
                items={roleCheckboxes}
                renderId={(checkbox) => checkbox.item.name + checkbox.item.$id}
                renderLabel={(checkbox) => checkbox.item.name}
                handleCustomValueSubmit={async (customValue) => {
                  try {
                    const roleResponse = await functions.createExecution(
                      process.env
                        .NEXT_PUBLIC_FUNCTION_ID_SUBMIT_CUSTOM_ROLE as string,
                      JSON.stringify({ name: customValue })
                    );
                    const role = JSON.parse(roleResponse.response) as Industry;
                    const roleCheckbox: Checkbox<Role> = {
                      key: role.$id,
                      item: role,
                      checked: false,
                    };
                    setRoleCheckboxes((prev) => [...prev, roleCheckbox]);
                    return true;
                  } catch (error) {
                    return false;
                  }
                }}
                setCheckboxes={setRoleCheckboxes}
              />
            ) : (
              <Skeleton height={64} />
            )}
          </div>
        </div>
      </div>

      <div className="col-span-12 text-right">
        <button
          type="submit"
          disabled={submitting}
          className={
            "inline-flex items-center px-5 py-2.5 text-sm primary-btn relative max-w-full w-28 " +
            (submitting ? "justify-start" : "justify-center")
          }
        >
          <span>{edit ? "Update" : "Upload"}</span>
          {submitting && <Spinner />}
        </button>
      </div>
    </form>
  );
}
