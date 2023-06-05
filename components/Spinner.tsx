"use client";

import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Spinner({ size }: { size?: number }) {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-4">
      <AiOutlineLoading3Quarters size={size} className="animate-spin" />
    </div>
  );
}
