import appwriteClient, { account, teams } from "@/libs/appwrite";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type UserObject = Models.User<Models.Preferences> & {
  isAdmin: boolean;
};

export default function useAuth() {
  const [currentAccount, setCurrentAccount] = useState<UserObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const getSession = async () => {
    try {
      const acc = await account.get();
      const userObject: UserObject = {
        ...acc,
        isAdmin: false,
      };

      try {
        // only members have access to the endpoint
        const adminTeam = await teams.get(
          process.env.NEXT_PUBLIC_ADMIN_TEAM_ID as string
        );
        userObject.isAdmin = true;
      } catch (error) {
        userObject.isAdmin = false;
      }

      setCurrentAccount(userObject);
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
