"use client";

import { Dialog, Menu, Transition } from "@headlessui/react";
import { ID, Models } from "appwrite";
import { FaLayerGroup as All } from "react-icons/fa";
import { MdModeEditOutline as Edit } from "react-icons/md";
import { FaTrash as Trash } from "react-icons/fa";

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
import { Group, OrganizedGroup } from "./GroupList";

export default function Group({
  group,
  setGroups,
  setResumeGroupFilter,
  resumeGroupFilter,
  setGroupToEdit,
}: {
  group: OrganizedGroup;
  setResumeGroupFilter: Dispatch<SetStateAction<string | null>>;
  setGroupToEdit: Dispatch<React.SetStateAction<Group | null>>;

  resumeGroupFilter: string | null;
  setGroups: Dispatch<SetStateAction<Group[]>>;
}) {
  const [subgroupOpen, setSubgroupOpen] = useState(false);
  const handleDelete = async (group: OrganizedGroup) => {
    const ids = getAllGroupIds(group);
    const res = await functions.createExecution(
      process.env.NEXT_PUBLIC_FUNCTION_ID_DELETE_GROUP as string,
      JSON.stringify({ groupIds: ids })
    );
    const { successes } = JSON.parse(res.response) as {
      successes: string[];
      fails: string[];
    };
    setGroups((prev) => prev.filter((group) => !successes.includes(group.$id)));
    setResumeGroupFilter((prev) => {
      if (prev !== null && successes.includes(prev)) {
        return null;
      } else {
        return prev;
      }
    });
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setResumeGroupFilter(group.group.$id);
      }}
      className=""
    >
      <Droppable droppableId={`${GROUP_DROP_ID_PREFIX}-${group.group.$id}`}>
        {(provided) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div
                className={`group flex items-center justify-between px-2 py-1 bg-primary-main hover:bg-primary-dark rounded-full cursor-pointer ${
                  resumeGroupFilter === group.group.$id
                    ? "bg-secondary-lighter hover:bg-secondary-light"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2 w-full text-ellipsis overflow-hidden whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSubgroupOpen(!subgroupOpen);
                    }}
                  >
                    {subgroupOpen ? <Down size={12} /> : <Right size={12} />}
                  </button>
                  <span className="block w-full text-ellipsis overflow-hidden whitespace-nowrap">
                    {group.group.name}
                  </span>
                </div>
                <Menu as="div" className="relative hidden group-hover:block ">
                  <Menu.Button
                    className="block hover:text-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <More />
                  </Menu.Button>
                  <Menu.Items className="absolute text-sm z-50 right-0 shadow-lg origin-top-right bg-white mt-1 w-32 ring-1 ring-gray-200 rounded-lg overflow-hidden">
                    <Menu.Item>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(group);
                        }}
                        className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
                      >
                        <Trash size={10} className="text-gray-600" /> Delete
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToEdit(group.group);
                        }}
                        className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
                      >
                        <Edit size={10} className="text-gray-600" /> Edit
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
      {subgroupOpen && group.subgroups.length > 0 && (
        <ul className="flex flex-col gap-2 mt-2">
          {group.subgroups.map((group, idx) => (
            <li key={group.group.$id} className="pl-4">
              <Group
                resumeGroupFilter={resumeGroupFilter}
                setResumeGroupFilter={setResumeGroupFilter}
                group={group}
                setGroups={setGroups}
                setGroupToEdit={setGroupToEdit}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
