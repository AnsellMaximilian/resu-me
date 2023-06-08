"use client";

import { Dialog, Menu, Transition } from "@headlessui/react";
import { ID, Models } from "appwrite";
import { FaLayerGroup as All } from "react-icons/fa";
import { MdModeEditOutline as Edit } from "react-icons/md";
import { FaTrash as Trash } from "react-icons/fa";

import Group from "./Group";

import React, {
  useMemo,
  useState,
  Fragment,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
} from "react";
import {
  AiFillCaretDown as Down,
  AiFillCaretRight as Right,
} from "react-icons/ai";
import { RiMoreLine as More } from "react-icons/ri";
import { getAllGroupIds, organizeGroups } from "@/helpers";
import { functions } from "@/libs/appwrite";
import { Droppable } from "react-beautiful-dnd";
import {
  ALL_GROUP_DROP_ID,
  GROUP_DROP_ID_PREFIX,
} from "@/constants/dragAndDrop";
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
}: {
  groups: Group[];
  setResumeGroupFilter: Dispatch<SetStateAction<string | null>>;
  setGroups: Dispatch<SetStateAction<Group[]>>;
  setGroupToEdit: Dispatch<React.SetStateAction<Group | null>>;
  resumeGroupFilter: string | null;
}) {
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const organizedGroups = useMemo(() => {
    return organizeGroups(groups);
  }, [groups]);
  return (
    <ul className="flex flex-col gap-2">
      <li>
        <div>
          <Droppable droppableId={ALL_GROUP_DROP_ID}>
            {(provided) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeGroupFilter(null);
                  }}
                >
                  <div
                    className={`group flex items-center justify-between px-2 py-1 bg-primary-main hover:bg-primary-dark rounded-full cursor-pointer ${
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
                        {isGroupsOpen ? (
                          <Down size={12} />
                        ) : (
                          <Right size={12} />
                        )}
                      </button>
                      <span className="block w-full text-ellipsis overflow-hidden whitespace-nowrap">
                        All
                      </span>
                    </div>
                  </div>
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
          {isGroupsOpen && organizedGroups.length > 0 && (
            <ul className="flex flex-col gap-2 mt-2">
              {organizedGroups.map((group) => {
                return (
                  <li key={group.group.$id} className="pl-4">
                    <Group
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
