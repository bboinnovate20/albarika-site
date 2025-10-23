"use client";
import { Info } from "lucide-react";
import React from "react";
import PrimaryBtn from "./custom-ui/primary-btn";

interface CustomDialogProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CustomDialog({
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
}: CustomDialogProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60  z-[9999]">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 w-[90%] max-w-sm text-center animate-fade-in">
        <Info className="h-10  w-full mb-2.5 text-center"/>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {message}
        </h1>

        <div className="flex justify-center gap-4">
            <PrimaryBtn className="bg-red-500 text-white" onClick={onCancel}>Cancel</PrimaryBtn>
            <PrimaryBtn onClick={onConfirm}>Confirm</PrimaryBtn>
          
        </div>
      </div>
    </div>
  );
}
