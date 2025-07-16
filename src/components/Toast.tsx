"use client";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  return (
    <div className={`
      fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg flex items-center gap-2 text-white font-semibold
      ${type === "success" ? "bg-green-700" : "bg-red-700"}
    `}>
      {type === "success" ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
      {message}
    </div>
  );
} 