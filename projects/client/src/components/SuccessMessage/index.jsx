import React from "react";
import { HiCheckCircle } from "react-icons/hi2";
import Button from "../Button";

export default function SuccessMessage({ message, handleCloseModal }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <HiCheckCircle className=" rounded-full bg-slate-100 text-6xl text-primary" />
      <p className="modal-text my-4">{message}</p>
      <Button isButton isPrimary onClick={handleCloseModal} title="Close"/>
    </div>
  );
}
