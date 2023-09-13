import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../../components/Button"
import formatNumber from "../../../utils/formatNumber"
import Modal from "../../../components/Modal"

export default function Produk({ products }) {

  const { uuid, status, } = useSelector(state => {
		return {
			uuid : state?.auth?.uuid,
			status : state?.auth?.status,
		}
	})

  const [showModal, setShowModal] = useState({ show: false, context: "" });

  const handleCart = ({id,name}) => {
    !uuid ? setShowModal({ show: true, context: "login" })
    : status === 0 ? alert("Your account is unverified, please verify first")
    : alert(`Produk ${name} berhasil ditambahkan ke keranjang!`) // dan akan sekalian add to cart produk yg diinginkan
  }

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
  }
  
  return (
    <>
      {products.map((products) => (
        <div className="flex flex-col cursor-pointer gap-2 rounded-lg border p-3 text-dark shadow-lg">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-primary">
            <img
              src={products.productPicture}
              className="h-full w-full object-cover duration-300 group-hover:scale-110"
            />
          </div>

          <h3 className="text-sm font-bold uppercase duration-300 group-hover:text-primary lg:text-base">
            {products.productName}
          </h3>
          <h3 className="font-bold">
              Rp.{formatNumber(products.productPrice)}
          </h3>
          <Button
            isButton
            isPrimaryOutline
            isBLock
            title="Keranjang"
            className="font-semibold"
            onClick={()=>{
              handleCart({
                id:products.productId,
                name:products.productName
              })}
            }
          />
        </div>
      ))}
      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        context={showModal.context}
        title={`Login`}
      />
    </>
  );
}