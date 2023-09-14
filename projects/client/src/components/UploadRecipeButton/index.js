import React from "react";
import { HiDocumentText } from "react-icons/hi2";
import Button from "../Button";

export default function UploadRecipeButton() {
  return (
    <div className="fixed bottom-9 right-12 z-20 hidden flex-col gap-2 lg:flex">
      <Button
        isLink
        path="/upload-recipe"
        className={`group flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-white shadow-md shadow-slate-400 delay-100 duration-300 hover:bg-teal-700 hover:delay-0 dark:shadow-none`}
      >
        <HiDocumentText className="text-2xl " />
        <span>Unggah Resep</span>
      </Button>
    </div>
  );
}
