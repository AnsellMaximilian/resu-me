"use client";

import client, { account } from "@/libs/appwrite";
import { Account, Models } from "appwrite";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
import ResumeList from "@/components/ResumeList";
import { ToastContainer } from "react-toastify";

export default function AppPage() {
  const [titleSearch, setTitleSearch] = useState("");
  return (
    <div className="p-4">
      <div className="mb-4">
        <div>
          <input
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            type="search"
            name="search-title"
            id="search-title"
            className="input rounded-full"
            placeholder="Search for resume title"
          />
        </div>
      </div>
      <ResumeList />
      <ToastContainer />
    </div>
  );
}
