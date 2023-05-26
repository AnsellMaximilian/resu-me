import { Account, Client } from "appwrite";
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

export const account = new Account(client);

export default client;
