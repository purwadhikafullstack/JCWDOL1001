import React from "react";
import Button from "../../components/Button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h3 className="title">Oops!</h3>
      <p className="mb-2">Halaman yang kamu tuju tidak ditemukan</p>
      <Button
        isButton
        isPrimary
        isLink
        title="Kembali"
        path="/"
      />
    </div>
  );
}
