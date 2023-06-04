"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ID, Models } from "appwrite";
import React, {
  useMemo,
  useState,
  Fragment,
  Dispatch,
  SetStateAction,
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

export default function Sidebar({
  groups,
  setGroups,
}: {
  groups: Group[];
  setGroups: Dispatch<SetStateAction<Group[]>>;
}) {
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);

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
      <GroupList groups={groups} />
      <Transition appear show={isCreateGroupDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsCreateGroupDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add group
                  </Dialog.Title>
                  <div className="mt-3">
                    <GroupForm groups={groups} onSubmit={handleGroupSubmit} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
