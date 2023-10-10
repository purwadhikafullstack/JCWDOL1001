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

      { context==="produkDiskon" ?
        products.filter((product,index)=>product.discountProducts.length !== 0 && !product.discountProducts[0].discount.oneGetOne && index<=5).map((product) => (
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
        : context === "bogo" ?
          products.filter((product,index)=>product.discountProducts[0]?.discount.oneGetOne && index <=2).map((product) => (
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
        products.filter((product, index)=>product.discountProducts.length === 0).map((product) => (
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