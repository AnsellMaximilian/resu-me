"use client";

import { Models } from "appwrite";
import React, { useMemo, useState } from "react";
import {
  AiFillCaretDown as Down,
  AiFillCaretRight as Right,
} from "react-icons/ai";
import { FaPlus as Plus } from "react-icons/fa";

interface OrganizedGroup {
  group: Group;
  subgroups: OrganizedGroup[];
}

export type Group = Models.Document & {
  name: string;
  parentGroupId?: string;
};

const Group = ({
  group,
  padding = 1,
}: {
  group: OrganizedGroup;
  padding?: number;
}) => {
  const [subgroupOpen, setSubgroupOpen] = useState(false);
  return (
    <div>
      <div className="px-2 py-1 bg-primary-main hover:bg-primary-dark rounded-full cursor-pointer flex items-center gap-2">
        <button onClick={() => setSubgroupOpen(!subgroupOpen)}>
          {subgroupOpen ? <Down size={12} /> : <Right size={12} />}
        </button>
        <span className="block w-full text-ellipsis overflow-hidden whitespace-nowrap">
          {group.group.name}
        </span>
      </div>
      {subgroupOpen && group.subgroups.length > 0 && (
        <ul className="flex flex-col gap-2 mt-2">
          {group.subgroups.map((group, idx) => (
            <li
              key={group.group.$id}
              className=""
              style={{ paddingLeft: `${padding * 16}px` }}
            >
              <Group group={group} padding={padding + 1} />
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

export default function Sidebar({ groups }: { groups: Group[] }) {
  const organizedGroups = useMemo(() => {
    return organizeGroups(groups);
  }, [groups]);

  return (
    <div className="w-sidebar-w-open sidebar bg-white fixed left-0 border-r border-gray-200 p-2">
      <div className="mb-4 flex--between">
        <div className="text-md font-semibold">Groups</div>
        <button className="outline-btn py-1">
          <Plus />
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {organizedGroups.map((group) => {
          return (
            <li key={group.group.$id}>
              <Group group={group} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
