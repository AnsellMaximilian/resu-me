import { Group } from "@/components/GroupList";
import { Resume } from "@/components/ResumeList";
import { databases } from "@/libs/appwrite";
import { Models } from "appwrite";

export const updateGroup = async (
  groupId: string,
  data: Partial<Omit<Models.Document, keyof Models.Document>>
) => {
  const group = await databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID as string,
    process.env.NEXT_PUBLIC_GROUP_COLLECTION_ID as string,
    groupId,
    data
  );

  return group as Group;
};
