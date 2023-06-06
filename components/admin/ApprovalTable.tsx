"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { FaPlus as Plus } from "react-icons/fa";
import { BsCheckLg as Check } from "react-icons/bs";
import Spinner from "../Spinner";

export interface ApprovalTableProps<T> {
  name: string;
  collectionId: string;
  selectedCollectionTab: string | null;
  items: T[];
  renderId: (item: T) => string;
  renderName: (item: T) => string;
  renderApproval: (item: T) => boolean;
  onApprove: (
    collectionId: string,
    documentId: string,
    value: boolean
  ) => Promise<boolean>;
}

export default function ApprovalTable<T>({
  name,
  collectionId,
  selectedCollectionTab,
  items,
  renderId,
  renderApproval,
  renderName,
  onApprove,
}: ApprovalTableProps<T>) {
  const [isApprovalLoading, setIsApprovalLoading] = useState<string | false>(
    false
  );
  if (selectedCollectionTab !== collectionId) return null;
  return (
    <div className="bg-white p-4 shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{name}</h2>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Approved
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              return (
                <tr
                  key={renderId(item)}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {renderId(item)}
                  </th>
                  <td className="px-6 py-4">{renderName(item)}</td>
                  <td className="px-6 py-4">
                    {renderApproval(item) ? (
                      <button
                        onClick={async () => {
                          setIsApprovalLoading(renderId(item));
                          await onApprove(collectionId, renderId(item), false);
                          setIsApprovalLoading(false);
                        }}
                        className="btn p-0 w-8 h-8 border-2 border-gray-200 rounded-full flex--center bg-green-500 hover:bg-green-800 focus:ring-green-200 text-white"
                      >
                        {isApprovalLoading === renderId(item) ? (
                          <Spinner center />
                        ) : (
                          <Check />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          setIsApprovalLoading(renderId(item));

                          await onApprove(collectionId, renderId(item), true);
                          setIsApprovalLoading(false);
                        }}
                        className="btn p-0 w-8 h-8 border-2 border-gray-200 rounded-full bg-primary-main hover:bg-primary-dark flex--center"
                      >
                        {isApprovalLoading === renderId(item) ? (
                          <Spinner center />
                        ) : null}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
