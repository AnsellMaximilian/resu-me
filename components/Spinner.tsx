"use client";

import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Spinner({
  size,
  center = false,
}: {
  size?: number;
  center?: boolean;
}) {
  return (
    <div
      className={`${
        center ? "" : "absolute inset-y-0 right-0 pr-4"
      } flex items-center justify-center`}
    >
      <AiOutlineLoading3Quarters size={size} className="animate-spin" />
    </div>
  );
}
