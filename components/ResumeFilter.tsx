import { Popover } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import CheckBoxList, { Checkbox } from "./CheckBoxList";
import { Skill, Role, Industry } from "@/app/app/resumes/upload/page";
import { functions } from "@/libs/appwrite";
import { AiFillCaretDown as Down } from "react-icons/ai";

export type FilterFunction = (
  skillCheckboxes: Checkbox<Skill>[],
  roleCheckboxes: Checkbox<Role>[],
  industryCheckboxes: Checkbox<Industry>[],
  titleFilter: string
) => void;

interface FilterComponentProps {
  skills: Skill[];
  industries: Industry[];
  roles: Role[];
  onFilter: FilterFunction;
}

export default function ResumeFilter({
  skills,
  industries,
  roles,
  onFilter,
}: FilterComponentProps) {
  const [titleSearch, setTitleSearch] = useState("");
  const [skillCheckboxes, setSkillCheckboxes] = useState<Checkbox<Skill>[]>([]);
  const [industryCheckboxes, setIndustryCheckboxes] = useState<
    Checkbox<Industry>[]
  >([]);
  const [roleCheckboxes, setRoleCheckboxes] = useState<Checkbox<Role>[]>([]);

  const resetFilters = () => {
    setTitleSearch("");
    setSkillCheckboxes((prev) =>
      prev.map((box) => ({ ...box, checked: false }))
    );
    setIndustryCheckboxes((prev) =>
      prev.map((box) => ({ ...box, checked: false }))
    );
    setRoleCheckboxes((prev) =>
      prev.map((box) => ({ ...box, checked: false }))
    );
  };

  useEffect(() => {
    const skillCheckboxes: Checkbox<Skill>[] = skills.map((skill) => ({
      key: skill.$id,
      item: skill,
      checked: false,
    }));

    setSkillCheckboxes(skillCheckboxes);

    const industryCheckboxes: Checkbox<Industry>[] = industries.map(
      (industry) => ({
        key: industry.$id,
        item: industry,
        checked: false,
      })
    );

    setIndustryCheckboxes(industryCheckboxes);

    const roleCheckboxes: Checkbox<Role>[] = roles.map((industry) => ({
      key: industry.$id,
      item: industry,
      checked: false,
    }));

    setRoleCheckboxes(roleCheckboxes);
  }, [industries, roles, skills]);

  const skillsFilterCount = skillCheckboxes.filter((box) => box.checked).length;
  const rolesFilterCount = roleCheckboxes.filter((box) => box.checked).length;
  const industriesFilterCount = industryCheckboxes.filter(
    (box) => box.checked
  ).length;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onFilter(skillCheckboxes, roleCheckboxes, industryCheckboxes, titleSearch);
  };

  return (
    <form
      className="flex gap-4 items-center flex-wrap sm:flex-nowrap"
      onSubmit={handleSubmit}
    >
      <input
        value={titleSearch}
        onChange={(e) => setTitleSearch(e.target.value)}
        type="search"
        name="search-title"
        id="search-title"
        className="input rounded-full py-2"
        placeholder="Search for resume title"
      />
      <Popover className="relative w-full sm:w-auto">
        <Popover.Button
          className={`${
            skillsFilterCount > 0 ? "filter-input--active" : "filter-input"
          } flex gap-2 items-center w-full sm:w-auto justify-between`}
        >
          <span>Skills</span>
          {skillsFilterCount > 0 && (
            <span className="filter__amount">{skillsFilterCount}</span>
          )}
          <Down />
        </Popover.Button>

        <Popover.Panel className="absolute z-10 right-0 p-2 popover">
          <CheckBoxList
            items={skillCheckboxes}
            renderId={(checkbox) => checkbox.item.name + checkbox.item.$id}
            renderLabel={(checkbox) => checkbox.item.name}
            handleCustomValueSubmit={async (customValue) => {
              try {
                const skillResponse = await functions.createExecution(
                  process.env
                    .NEXT_PUBLIC_FUNCTION_ID_SUBMIT_CUSTOM_SKILL as string,
                  JSON.stringify({ name: customValue })
                );
                const skill = JSON.parse(skillResponse.response) as Skill;
                const skillCheckbox: Checkbox<Skill> = {
                  key: skill.$id,
                  item: skill,
                  checked: false,
                };
                setSkillCheckboxes((prev) => [...prev, skillCheckbox]);
                return true;
              } catch (error) {
                return false;
              }
            }}
            setCheckboxes={setSkillCheckboxes}
          />
        </Popover.Panel>
      </Popover>

      <Popover className="relative w-full sm:w-auto">
        <Popover.Button
          className={`${
            rolesFilterCount > 0 ? "filter-input--active" : "filter-input"
          } flex gap-2 items-center w-full sm:w-auto justify-between`}
        >
          <span>Roles</span>
          {rolesFilterCount > 0 && (
            <span className="filter__amount">{rolesFilterCount}</span>
          )}
          <Down />
        </Popover.Button>

        <Popover.Panel className="absolute z-10 right-0 p-2 popover">
          <CheckBoxList
            items={roleCheckboxes}
            renderId={(checkbox) => checkbox.item.name + checkbox.item.$id}
            renderLabel={(checkbox) => checkbox.item.name}
            handleCustomValueSubmit={async (customValue) => {
              try {
                const roleResponse = await functions.createExecution(
                  process.env
                    .NEXT_PUBLIC_FUNCTION_ID_SUBMIT_CUSTOM_ROLE as string,
                  JSON.stringify({ name: customValue })
                );
                const role = JSON.parse(roleResponse.response) as Role;
                const roleCheckbox: Checkbox<Role> = {
                  key: role.$id,
                  item: role,
                  checked: false,
                };
                setRoleCheckboxes((prev) => [...prev, roleCheckbox]);
                return true;
              } catch (error) {
                return false;
              }
            }}
            setCheckboxes={setRoleCheckboxes}
          />
        </Popover.Panel>
      </Popover>

      <Popover className="relative w-full sm:w-auto">
        <Popover.Button
          className={`${
            industriesFilterCount > 0 ? "filter-input--active" : "filter-input"
          } flex gap-2 items-center w-full sm:w-auto justify-between`}
        >
          <span>Industries</span>
          {industriesFilterCount > 0 && (
            <span className="filter__amount">{industriesFilterCount}</span>
          )}
          <Down />
        </Popover.Button>

        <Popover.Panel className="absolute z-10 right-0 p-2 popover">
          <CheckBoxList
            items={industryCheckboxes}
            renderId={(checkbox) => checkbox.item.name + checkbox.item.$id}
            renderLabel={(checkbox) => checkbox.item.name}
            handleCustomValueSubmit={async (customValue) => {
              try {
                const industryResponse = await functions.createExecution(
                  process.env
                    .NEXT_PUBLIC_FUNCTION_ID_SUBMIT_CUSTOM_INDUSTRY as string,
                  JSON.stringify({ name: customValue })
                );
                const industry = JSON.parse(
                  industryResponse.response
                ) as Industry;
                const industryCheckbox: Checkbox<Industry> = {
                  key: industry.$id,
                  item: industry,
                  checked: false,
                };
                setIndustryCheckboxes((prev) => [...prev, industryCheckbox]);
                return true;
              } catch (error) {
                return false;
              }
            }}
            setCheckboxes={setIndustryCheckboxes}
          />
        </Popover.Panel>
      </Popover>
      <button className="primary-btn w-full sm:w-auto">Filter</button>
    </form>
  );
}
