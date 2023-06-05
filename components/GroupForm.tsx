"use client";
import React, { useEffect, useState, useMemo } from "react";
import Spinner from "./Spinner";
import { Group } from "./GroupList";

export type SubmitFunction = (
  name: string,
  parentGroupId: string | null
) => Promise<void>;

export default function GroupForm({
  groups,
  onSubmit,
  groupToEdit,
  resumeGroupFilter,
}: {
  groups: Group[];
  onSubmit: SubmitFunction;
  groupToEdit: Group | null;
  resumeGroupFilter: string | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [selectedParentGroupId, setSelectedParentGroupId] =
    useState<string>("none");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(
      name,
      selectedParentGroupId === "none" ? null : selectedParentGroupId
    );
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (groupToEdit) {
      setName(groupToEdit.name);
      setSelectedParentGroupId(
        groupToEdit.parentGroupId ? groupToEdit.parentGroupId : "none"
      );
    } else if (resumeGroupFilter) {
      setSelectedParentGroupId(resumeGroupFilter ? resumeGroupFilter : "none");
    }
  }, [groupToEdit, resumeGroupFilter]);

  const filteredGroups = useMemo(() => {
    if (groupToEdit) {
      return groups.filter((g) => g.$id !== groupToEdit.$id);
    }
    return groups;
  }, [groupToEdit, groups]);

  return (
    <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="parentGroup"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Parent Group
        </label>
        <select
          value={selectedParentGroupId}
          id="parentGroup"
          onChange={(e) => setSelectedParentGroupId(e.target.value)}
          className="input"
        >
          <option value="none">None</option>
          {filteredGroups.map((group) => (
            <option key={group.$id} value={group.$id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Group Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name"
          id="name"
          className="bg-gray-50 border focus:ring-1 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-secondary-light focus:border-secondary-light block w-full p-2.5"
          placeholder="Group Name"
          required
        />
      </div>

      <button
        type="submit"
        className="relative w-full text-white bg-secondary-main hover:bg-secondary-dark focus:ring-4 focus:outline-none focus:ring-secondary-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-secondary-main dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        <span>Create</span>
        {isSubmitting && (
          <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-4">
            <Spinner />
          </div>
        )}
      </button>
    </form>
  );
}
