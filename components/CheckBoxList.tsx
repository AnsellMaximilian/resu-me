"use client";

import { functions } from "@/libs/appwrite";
import React, { useState, useEffect, ChangeEventHandler } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

export interface Checkbox<T> {
  key: string;
  item: T;
  checked: boolean;
}

interface CheckboxListProps<T> {
  items: Checkbox<T>[];
  renderId: (item: Checkbox<T>) => string;
  renderLabel: (item: Checkbox<T>) => string;
  handleCustomValueSubmit: (name: string) => Promise<boolean>;
  setCheckboxes: React.Dispatch<React.SetStateAction<Checkbox<T>[]>>;
}

export default function CheckBoxList<T>({
  items,
  renderId,
  renderLabel,
  handleCustomValueSubmit,
  setCheckboxes,
}: CheckboxListProps<T>) {
  // Custom values
  const [customValue, setCustomValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onCustomSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.key === "Enter" && !submitting) {
      e.preventDefault(); // Prevent form submission
      setSubmitting(true);
      if (!customValue) return;
      // Check if it already exists
      if (items.find((box) => renderLabel(box) === customValue)) {
        toast.error("That value already exists.");
        return;
      }
      setCustomValue("");

      const success = await handleCustomValueSubmit(customValue);
      setSubmitting(false);
    }
  };

  const check = (checkbox: Checkbox<T>) =>
    setCheckboxes((prev) =>
      prev.map((prevCheckbox) => {
        const newState = { ...prevCheckbox };
        if (checkbox.key === prevCheckbox.key) {
          newState.checked = !prevCheckbox.checked;
        }
        return newState;
      })
    );

  const handleOnChange: (
    checkbox: Checkbox<T>
  ) => ChangeEventHandler<HTMLInputElement> = (checkbox) => (e) =>
    check(checkbox);

  const handleClick: (
    checkbox: Checkbox<T>
  ) => React.MouseEventHandler<HTMLButtonElement> = (checkbox) => (e) =>
    check(checkbox);

  return (
    <div>
      <ul className="flex flex-wrap gap-2 mb-4">
        {items.map((checkbox) => {
          return (
            <li key={checkbox.key}>
              <label
                htmlFor={renderId(checkbox)}
                className="hidden mb-2 text-sm font-medium text-gray-900"
              >
                {renderLabel(checkbox)}
              </label>
              <input
                checked={checkbox.checked}
                onChange={handleOnChange(checkbox)}
                type="checkbox"
                name={renderLabel(checkbox)}
                id={renderId(checkbox)}
                className="hidden"
              />
              <button
                type="button"
                className={
                  (checkbox.checked
                    ? "checkbox-toggle--checked"
                    : "checkbox-toggle") + " cursor-pointer"
                }
                onClick={handleClick(checkbox)}
              >
                {renderLabel(checkbox)}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="relative">
        <input
          onChange={(e) => setCustomValue(e.target.value)}
          value={customValue}
          type="text"
          name="customValue"
          id="customValue"
          className="input rounded-full text-xs py-2"
          placeholder="Type and press enter to add custom values"
          onKeyDown={onCustomSubmit}
        />
        {submitting && <Spinner />}
      </div>
    </div>
  );
}
