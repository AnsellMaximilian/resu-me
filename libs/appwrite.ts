import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  Storage,
  Teams,
} from "appwrite";
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const teams = new Teams(client);

export default client;
