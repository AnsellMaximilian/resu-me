"use client";

import { functions } from "@/libs/appwrite";
import React, { useState, useEffect, ChangeEventHandler } from "react";
import { toast } from "react-toastify";

export interface Checkbox<T> {
  key: string;
  item: T;
  checked: boolean;
}

interface CheckboxListProps<T> {
  items: T[];
  renderKey: (item: T) => string;
  renderId: (item: T) => string;
  renderLabel: (item: T) => string;
  handleCustomValueSubmit: (name: string) => Promise<Checkbox<T>>;
}

export default function CheckBoxList<T>({
  items,
  renderKey,
  renderId,
  renderLabel,
  handleCustomValueSubmit,
}: CheckboxListProps<T>) {
  const [checkboxes, setCheckboxes] = useState<Checkbox<T>[]>([]);

  // Custom values
  const [customValue, setCustomValue] = useState("");

  const onCustomSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (!customValue) return;
      // Check if it already exists
      if (checkboxes.find((box) => renderLabel(box.item) === customValue)) {
        toast.error("That value already exists.");
        return;
      }
      setCustomValue("");

      const newItem = await handleCustomValueSubmit(customValue);

      setCheckboxes((prev) => [...prev, newItem]);
    }
  };

  useEffect(() => {
    (async () => {
      const checkboxes: Checkbox<T>[] = items.map((item) => {
        return { checked: false, item, key: renderKey(item) } as Checkbox<T>;
      });

      setCheckboxes(checkboxes);
    })();
  }, [items, renderKey]);

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
        {checkboxes.map((checkbox) => {
          return (
            <li key={renderKey(checkbox.item)}>
              <label
                htmlFor={renderId(checkbox.item)}
                className="hidden mb-2 text-sm font-medium text-gray-900"
              >
                {renderLabel(checkbox.item)}
              </label>
              <input
                checked={checkbox.checked}
                onChange={handleOnChange(checkbox)}
                type="checkbox"
                name={renderLabel(checkbox.item)}
                id={renderId(checkbox.item)}
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
                {renderLabel(checkbox.item)}
              </button>
            </li>
          );
        })}
      </ul>
      <div>
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
      </div>
    </div>
  );
}
