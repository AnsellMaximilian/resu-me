import appwriteClient, { account } from "@/libs/appwrite";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [currentAccount, setCurrentAccount] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const getSession = async () => {
    try {
      setCurrentAccount(await account.get());
    } catch (error) {
      console.log(error);
      router.push("/auth/signin");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const promise = await account.deleteSession("current");
    setCurrentAccount(null);
    router.push("/auth/signin");
  };

  useEffect(() => {
    getSession();
  }, []);

  return {
    currentAccount,
    isLoading,
    logout,
  };
}
