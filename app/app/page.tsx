"use client";
import { useRouter } from "next/navigation";
import client from "@/libs/appwrite";
import { Account, Models } from "appwrite";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";

const AppPage = async () => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] =
    useState<Models.User<Models.Preferences> | null>(null);
  useEffect(() => {
    const account = new Account(client);
    const promise = account.get();
    promise
      .then((account) => setCurrentAccount(account))
      .catch((error) => {
        router.push("/auth/signin");
      });
  }, [router]);
  return (
    <div>
      {currentAccount && (
        <div>
          <AppHeader currentAccount={currentAccount} />
        </div>
      )}
    </div>
  );
};

export default AppPage;
