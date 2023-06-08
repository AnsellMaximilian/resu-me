"use client";

import { ID, Models } from "appwrite";

import Group from "./Group";
import React, { useMemo, useState, Dispatch, SetStateAction } from "react";
import {
  AiFillCaretDown as Down,
  AiFillCaretRight as Right,
} from "react-icons/ai";
import { organizeGroups } from "@/helpers";
import { useDrop } from "react-dnd";

import { Resume } from "./ResumeList";
import { dropItemTypes } from "@/constants/dragAndDrop";
import { updateResume } from "@/services/resumes";
export interface OrganizedGroup {
  group: Group;
  subgroups: OrganizedGroup[];
}

export type Group = Models.Document & {
  name: string;
  parentGroupId?: string;
};

export default function GroupList({
  groups,
  setResumeGroupFilter,
  setGroups,
  resumeGroupFilter,
  setGroupToEdit,
  setResumes,
}: {
  groups: Group[];
  setResumeGroupFilter: Dispatch<SetStateAction<string | null>>;
  setGroups: Dispatch<SetStateAction<Group[]>>;
  setGroupToEdit: Dispatch<React.SetStateAction<Group | null>>;
  resumeGroupFilter: string | null;
  setResumes: Dispatch<SetStateAction<Resume[]>>;
}) {
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const organizedGroups = useMemo(() => {
    return organizeGroups(groups);
  }, [groups]);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: dropItemTypes.RESUME,
      drop: async (item, monitor) => {
        const draggedResume = monitor.getItem() as Resume;
        const resume = await updateResume(draggedResume.$id, { groupId: null });
        setResumeGroupFilter(null);
        setResumes((prev) =>
          prev.map((res) =>
            res.$id === resume.$id ? { ...res, groupId: null } : res
          )
        );
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );
  return (
    <ul className="flex flex-col gap-2">
      <li>
        <div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setResumeGroupFilter(null);
            }}
          >
            <div
              ref={drop}
              className={`${
                isOver ? "bg-primary-dark" : "bg-primary-main"
              } group flex items-center justify-between px-2 py-1 hover:bg-primary-dark rounded-full cursor-pointer ${
                resumeGroupFilter === null
                  ? "bg-secondary-lighter hover:bg-secondary-light"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2 w-full text-ellipsis overflow-hidden whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGroupsOpen(!isGroupsOpen);
                  }}
                >
                  {isGroupsOpen ? <Down size={12} /> : <Right size={12} />}
                </button>
                <span className="block w-full text-ellipsis overflow-hidden whitespace-nowrap">
                  All
                </span>
              </div>
            </div>
          </div>
          {isGroupsOpen && organizedGroups.length > 0 && (
            <ul className="flex flex-col gap-2 mt-2">
              {organizedGroups.map((group) => {
                return (
                  <li key={group.group.$id} className="pl-4">
                    <Group
                      setResumes={setResumes}
                      resumeGroupFilter={resumeGroupFilter}
                      setResumeGroupFilter={setResumeGroupFilter}
                      group={group}
                      setGroups={setGroups}
                      setGroupToEdit={setGroupToEdit}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </li>
    </ul>
  );
}
