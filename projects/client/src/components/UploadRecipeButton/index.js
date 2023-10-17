import React, { useState } from "react";
import { HiDocumentText } from "react-icons/hi2";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { toast } from "react-toastify";

export default function UploadRecipeButton({ user }) {
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState({show:false, context:""})
  
  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
  }

  const [isToastVisible, setIsToastVisible] = useState(false)

  const handleUnverifiedUser = ()=>{
    toast.error("Akun belum terverifikasi")
    setIsToastVisible(true)
    setTimeout(() => {
      setIsToastVisible(false)
    }, 2000)
  }

  const handleButtonUpload = () => {
    !user.uuid ? setShowModal({ show: true, context: "login" })
    : user.status ===0 ?  handleUnverifiedUser()
    : navigate("/upload-recipe")
  }
  return (
    <>
      <div className="fixed bottom-9 right-12 z-20 hidden flex-col gap-2 lg:flex">
        <Button
          isDisabled={isToastVisible}
          onClick={handleButtonUpload}
          className={`group flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-white shadow-md shadow-slate-400 delay-100 duration-300 hover:bg-teal-700 hover:delay-0 dark:shadow-none`}
        >
          <HiDocumentText className="text-2xl " />
          <span>Unggah Resep</span>
        </Button>
      </div>

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        context={showModal.context}
        title={`Login`}
      />
    </>
  );
}
