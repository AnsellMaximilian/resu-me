import { Resume } from "@/components/ResumeList";
import { databases } from "@/libs/appwrite";
import { Models } from "appwrite";

export const updateResume = async (
  resumeId: string,
  data: Partial<Omit<Models.Document, keyof Models.Document>>
) => {
  const resume = await databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID as string,
    process.env.NEXT_PUBLIC_RESUME_COLLECTION_ID as string,
    resumeId,
    data
  );

  return resume as Resume;
};
