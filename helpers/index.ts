import { Group, OrganizedGroup } from "@/components/GroupList";

export function organizeGroups(
  groups: Group[],
  parentId?: string
): OrganizedGroup[] {
  const organizedGroups: OrganizedGroup[] = [];

  // Find all groups with the specified parentId
  const filteredGroups = groups.filter((group) =>
    parentId ? group.parentGroupId === parentId : !group.parentGroupId
  );

  // Iterate over each filtered group and organize its subgroups recursively
  for (const group of filteredGroups) {
    const organizedGroup: OrganizedGroup = {
      group,
      subgroups: organizeGroups(groups, group.$id), // Recursively organize subgroups
    };

    organizedGroups.push(organizedGroup);
  }

  return organizedGroups;
}

export function getAllGroupIds(group: OrganizedGroup): string[] {
  const ids: string[] = [];

  ids.push(group.group.$id);
  for (const sub of group.subgroups) {
    ids.push(...getAllGroupIds(sub));
  }

  return ids;
}

export function getGroupParents(group: Group, groups: Group[]) {
  const parents: Group[] = [];
  for (const g of groups) {
    if (g.$id === group.parentGroupId) {
      parents.push(g, ...getGroupParents(g, groups));
    }
  }
  return parents;
}
