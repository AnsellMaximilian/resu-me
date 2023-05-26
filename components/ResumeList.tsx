"use client";
import Link from "next/link";
import { FaPlus as Plus } from "react-icons/fa";

export default function ResumeList() {
  return (
    <section>
      <header className="flex justify-between items-end">
        <div className="head-text">Resumes</div>
        <Link
          href="/app/resumes/upload"
          className="flex items-center justify-between gap-2 outline-btn"
        >
          <span>Upload</span> <Plus />
        </Link>
      </header>
    </section>
  );
}
