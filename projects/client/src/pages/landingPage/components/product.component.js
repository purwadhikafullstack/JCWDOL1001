import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../../components/Button"
import formatNumber from "../../../utils/formatNumber"
import Modal from "../../../components/Modal"
import Card from "../../../components/Card"

export default function Produk({ products, context }) {

  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
  }
  
  return (
    <>    

      { context==="produkPromo" ?
          products?.slice(0,6).map((product) => (
            <Card
              key={product.productId}
              productId={product.productId}
              productName={product.productName}
              productPrice={product.productPrice}
              productDiscount={product.discountProducts}
              productPicture={product.productPicture}
              productStock={product.productStock}
              productCategories={product.productCategories}
            />
          ))
        :
        products?.filter((product)=>product.discountProducts.length === 0 ).slice(0,6).map((product) => (
          <Card
            key={product.productId}
            productId={product.productId}
            productName={product.productName}
            productPrice={product.productPrice}
            productDiscount={[]}
            productPicture={product.productPicture}
            productStock={product.productStock}
            productCategories={product.productCategories}
          />
        ))
      }
      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        context={showModal.context}
        title={`Login`}
      />
    </>
  );
}