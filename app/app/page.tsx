"use client";

import client, { account } from "@/libs/appwrite";
import { Account, Models } from "appwrite";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
import ResumeList from "@/components/ResumeList";
import { ToastContainer } from "react-toastify";

export default function AppPage() {
  return (
    <div className="p-4">
      <ResumeList />
      <ToastContainer />
    </div>
  );
}
