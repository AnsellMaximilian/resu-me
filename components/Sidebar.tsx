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
import { BiChevronRight as Right, BiChevronLeft as Left } from "react-icons/bi";
import { FaPlus as Plus } from "react-icons/fa";
import Spinner from "./Spinner";
import GroupForm, { SubmitFunction } from "./GroupForm";
import { toast } from "react-toastify";
import { databases } from "@/libs/appwrite";
import GroupList, { Group } from "./GroupList";
import Dialog from "./Dialog";
import { Droppable } from "react-beautiful-dnd";

export default function Sidebar({
  groups,
  setGroups,
  setResumeGroupFilter,
  resumeGroupFilter,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  groups: Group[];
  setGroups: Dispatch<SetStateAction<Group[]>>;
  setResumeGroupFilter: Dispatch<SetStateAction<string | null>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
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
    <div
      onClick={() => {
        if (!isSidebarOpen) setIsSidebarOpen(true);
      }}
      className={`${
        isSidebarOpen
          ? "w-sidebar-w-open"
          : "w-8 hover:bg-primary-dark sm:hover:bg-white cursor-pointer"
      } sidebar bg-white fixed left-0 border-r border-gray-200 p-4 transition-all duration-100 z-50`}
    >
      {isSidebarOpen && (
        <>
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
        </>
      )}
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
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="shadow w-8 h-8 rounded-full border border-gray-200 absolute bottom-16 -right-4 bg-white items-center flex justify-center hover:bg-primary-dark"
      >
        {isSidebarOpen ? <Left size={20} /> : <Right size={20} />}
      </button>
    </div>
  );
}
