import React, { useState, useEffect } from "react";

interface Checkbox<T> {
  key: string;
  item: T;
  checked: boolean;
}

interface CheckboxListProps<T> {
  items: T[];
  renderKey: (item: T) => string;
  renderId: (item: T) => string;
  renderLabel: (item: T) => string;
}

export default function CheckBoxList<T>({
  items,
  renderKey,
  renderId,
  renderLabel,
}: CheckboxListProps<T>) {
  const [checkboxes, setCheckboxes] = useState<Checkbox<T>[]>([]);

  useEffect(() => {
    (async () => {
      const checkboxes: Checkbox<T>[] = items.map((item) => {
        return { checked: false, item } as Checkbox<T>;
      });

      setCheckboxes(checkboxes);
    })();
  }, [items]);

  return (
    <ul className="flex flex-wrap gap-2">
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
              onChange={(e) =>
                setCheckboxes((prev) =>
                  prev.map((prevCheckbox) => {
                    const newState = { ...prevCheckbox };
                    if (checkbox.key === prevCheckbox.key) {
                      newState.checked = !prevCheckbox.checked;
                    }
                    return newState;
                  })
                )
              }
              type="checkbox"
              name={renderLabel(checkbox.item)}
              id={renderId(checkbox.item)}
              className="hidden"
            />
            <div
              className={
                (checkbox.checked
                  ? "checkbox-toggle--checked"
                  : "checkbox-toggle") + " cursor-pointer"
              }
            >
              {renderLabel(checkbox.item)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
