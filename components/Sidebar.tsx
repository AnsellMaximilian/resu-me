"use client";

import { ID, Models } from "appwrite";
import React, {
  useMemo,
  useState,
  Fragment,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import {
  AiFillCaretDown as Down,
  AiFillCaretRight as Right,
} from "react-icons/ai";
import { FaPlus as Plus } from "react-icons/fa";
import Spinner from "./Spinner";
import GroupForm, { SubmitFunction } from "./GroupForm";
import { toast } from "react-toastify";
import { databases } from "@/libs/appwrite";
import GroupList, { Group } from "./GroupList";
import Dialog from "./Dialog";

export default function Sidebar({
  groups,
  setGroups,
  setResumeGroupFilter,
  resumeGroupFilter,
}: {
  groups: Group[];
  setGroups: Dispatch<SetStateAction<Group[]>>;
  setResumeGroupFilter: Dispatch<SetStateAction<string | null>>;
  resumeGroupFilter: string | null;
}) {
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);

  const handleGroupSubmit: SubmitFunction = async (name, parentGroupId) => {
    try {
      if (!name) throw new Error("Name field is required.");
      if (name.length > 20) throw new Error("Maximum is 20 characters.");

      const group = (await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_GROUP_COLLECTION_ID as string,
        ID.unique(),
        {
          name,
          parentGroupId,
        }
      )) as Group;

      setIsCreateGroupDialogOpen(false);
      setGroups((prev) => [...prev, group]);

      toast.success("Group created.");
    } catch (error: any) {
      if (Object.hasOwn(error, "message")) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    }
  };

  const handleGroupUpdate: SubmitFunction = async (name, parentGroupId) => {
    if (groupToEdit) {
      try {
        if (!name) throw new Error("Name field is required.");
        if (name.length > 20) throw new Error("Maximum is 20 characters.");

        const newGroup = (await databases.updateDocument(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_GROUP_COLLECTION_ID as string,
          groupToEdit.$id,
          {
            name,
            parentGroupId,
          }
        )) as Group;

        setIsCreateGroupDialogOpen(false);
        setGroups((prev) =>
          prev.map((group) => {
            if (group.$id === newGroup.$id) {
              return newGroup;
            }
            return group;
          })
        );

        toast.success("Group updated.");
      } catch (error: any) {
        if (Object.hasOwn(error, "message")) {
          toast.error(error.message);
        } else {
          toast.error("Unknown error");
        }
      }
    }
  };

  useEffect(() => {
    if (groupToEdit !== null) {
      setIsCreateGroupDialogOpen(true);
    }
  }, [groupToEdit]);

  useEffect(() => {
    if (isCreateGroupDialogOpen === false) {
      setGroupToEdit(null);
    }
  }, [isCreateGroupDialogOpen]);

  return (
    <div className="w-sidebar-w-open sidebar bg-white fixed left-0 border-r border-gray-200 p-4">
      <div className="mb-4 flex--between">
        <div className="text-md font-semibold">Groups</div>
        <button
          className="outline-btn py-1"
          onClick={() => setIsCreateGroupDialogOpen(true)}
        >
          <Plus />
        </button>
      </div>

      <GroupList
        groups={groups}
        setResumeGroupFilter={setResumeGroupFilter}
        setGroups={setGroups}
        resumeGroupFilter={resumeGroupFilter}
        setGroupToEdit={setGroupToEdit}
      />
      <Dialog
        onClose={() => {
          setIsCreateGroupDialogOpen(false);
        }}
        title={!groupToEdit ? "Add Group" : "Edit Group"}
        open={isCreateGroupDialogOpen}
      >
        <GroupForm
          groups={groups}
          onSubmit={!groupToEdit ? handleGroupSubmit : handleGroupUpdate}
          groupToEdit={groupToEdit}
          resumeGroupFilter={resumeGroupFilter}
        />
      </Dialog>
    </div>
  );
}
