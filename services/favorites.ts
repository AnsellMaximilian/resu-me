import { databases } from "@/libs/appwrite";
import { Models } from "appwrite";

export interface Favorite extends Models.Document {
  resumes: string[];
}

export const getFavorites = async (userId: string) => {
  const favorite = await databases.getDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID as string,
    process.env.NEXT_PUBLIC_FAVORITE_COLLECTION_ID as string,
    userId
  );

  return favorite as Favorite;
};

export const updateFavorites = async (
  userId: string,
  data: Partial<Omit<Models.Document, keyof Models.Document>>
) => {
  const favorite = await databases.updateDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID as string,
    process.env.NEXT_PUBLIC_FAVORITE_COLLECTION_ID as string,
    userId,
    data
  );

  return favorite as Favorite;
};
