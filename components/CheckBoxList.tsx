import React, { useState, useEffect, ChangeEventHandler } from "react";

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
  );
}
