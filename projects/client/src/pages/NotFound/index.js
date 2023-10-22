import React from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function NotFound({ user }) {
  const navigate = useNavigate()
  if (user?.role === 1) {
    navigate("/admin/products")
  } else {
    navigate("/")
  }
  
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
