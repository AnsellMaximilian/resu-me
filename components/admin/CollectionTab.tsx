import React, { Dispatch, SetStateAction } from "react";
import { FaPlus as Plus } from "react-icons/fa";

export interface TabProps {
  name: string;
  totalUnapproved: number;
  collectionId: string;
  setSelectedCollectionTab: Dispatch<SetStateAction<string | null>>;
  selectedCollectionTab: string | null;
}

export default function CollectionTab({
  totalUnapproved,
  name,
  collectionId,
  setSelectedCollectionTab,
  selectedCollectionTab,
}: TabProps) {
  const isSelected = selectedCollectionTab === collectionId;
  return (
    <div
      className={`flex--between p-4 group cursor-pointer ${
        isSelected ? "bg-secondary-lighter " : "hover:bg-primary-main"
      }`}
      onClick={() => setSelectedCollectionTab(collectionId)}
    >
      <div className="text-md font-semibold flex gap-1 items-baseline">
        <span className="group-hover:underline">{name}</span>
        <span
          className={`text-xs font-normal ${
            isSelected ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {totalUnapproved} Unapproved
        </span>
      </div>
      <button
        className="outline-btn py-1"
        // onClick={() => setIsCreateGroupDialogOpen(true)}
      >
        <Plus />
      </button>
    </div>
  );
}
