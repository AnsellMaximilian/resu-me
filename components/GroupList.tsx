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
export interface OrganizedGroup {
  group: Group;
  subgroups: OrganizedGroup[];
}

export type Group = Models.Document & {
  name: string;
  parentGroupId?: string;
};

const Group = ({
  group,
  filterGroup,
}: {
  group: OrganizedGroup;
  filterGroup: (id: string | null) => React.MouseEventHandler<HTMLDivElement>;
}) => {
  const [subgroupOpen, setSubgroupOpen] = useState(false);
  const handleDelete = () => {};
  return (
    <div onClick={filterGroup(group.group.$id)} className="">
      <div className="group flex items-center justify-between px-2 py-1 bg-primary-main hover:bg-primary-dark rounded-full cursor-pointer">
        <div className="flex items-center gap-2">
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
            className="block hover:text-secondary-main"
            onClick={(e) => e.stopPropagation()}
          >
            <More />
          </Menu.Button>
          <Menu.Items className="absolute text-sm z-50 right-0 shadow-lg origin-top-right bg-white mt-1 w-32 ring-1 ring-gray-200 rounded-lg overflow-hidden">
            <Menu.Item>
              <button
                onClick={() => {}}
                className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main"
              >
                <Trash size={10} className="text-gray-600" /> Delete
              </button>
            </Menu.Item>
            <Menu.Item>
              <button className="flex gap-2 items-center px-3 py-2 hover:text-black transition-all duration-100 w-full text-left hover:bg-primary-main">
                <Edit size={10} className="text-gray-600" /> Edit
              </button>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      {subgroupOpen && group.subgroups.length > 0 && (
        <ul className="flex flex-col gap-2 mt-2">
          {group.subgroups.map((group, idx) => (
            <li key={group.group.$id} className="pl-4">
              <Group group={group} filterGroup={filterGroup} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function organizeGroups(groups: Group[], parentId?: string): OrganizedGroup[] {
  const organizedGroups: OrganizedGroup[] = [];

  // Find all groups with the specified parentId
  const filteredGroups = groups.filter((group) =>
    parentId ? group.parentGroupId === parentId : !group.parentGroupId
  );

  // Iterate over each filtered group and organize its subgroups recursively
  for (const group of filteredGroups) {
    const organizedGroup: OrganizedGroup = {
      group,
      subgroups: organizeGroups(groups, group.$id), // Recursively organize subgroups
    };

    organizedGroups.push(organizedGroup);
  }

  return organizedGroups;
}

export default function GroupList({
  groups,
  setResumeGroupFilter,
}: {
  groups: Group[];
  setResumeGroupFilter: Dispatch<SetStateAction<string | null>>;
}) {
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const organizedGroups = useMemo(() => {
    return organizeGroups(groups);
  }, [groups]);

  const filterGroup = (id: string | null) => {
    const handleFilterClick: MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation();
      setResumeGroupFilter(id);
    };

    return handleFilterClick;
  };

  return (
    <ul className="flex flex-col gap-2">
      <li>
        <div>
          <div
            className="px-2 py-1 bg-primary-main hover:bg-primary-dark rounded-full cursor-pointer flex items-center gap-2"
            onClick={filterGroup(null)}
          >
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
          {isGroupsOpen && organizedGroups.length > 0 && (
            <ul className="flex flex-col gap-2 mt-2">
              {organizedGroups.map((group) => {
                return (
                  <li key={group.group.$id} className="pl-4">
                    <Group group={group} filterGroup={filterGroup} />
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
