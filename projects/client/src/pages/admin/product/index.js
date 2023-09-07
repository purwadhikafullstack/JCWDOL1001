import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import TableProducts from "./table.products";
import ModalInputProduct from "./modal.input.product";
import {
  deleteProduct,
  getProducts,
  resetSuccessProduct,
} from "../../../store/slices/product/slices";
import { getCategory } from "../../../store/slices/cat/slices";
import ModalDetailsProduct from "./modal.details.product";
import ModalDeleteProduct from "./modal.delete.product";

import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import { HiMagnifyingGlass } from "react-icons/hi2";
export default function AdminProducts({user}) {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {
    success,
    products,
    categories,
    isGetProductsLoading,
    isDeleteProductLoading,
    isSubmitProductLoading,
    errorMessage,
  } = useSelector((state) => {
    return {
      success: state.products.success,
      products: state.products.data,
      categories: state?.cat?.category,
      isGetProductsLoading: state.products.isGetProductsLoading,
      isDeleteProductLoading: state.products.isDeleteProductLoading,
      isSubmitProductLoading: state.products.isSubmitProductLoading,
      errorMessage: state.products.errorMessage,
    };
  });

  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShowModal = (context, productId) => {
    setShowModal({ show: true, context });
    document.body.style.overflow = "hidden";

    if (productId) {
      const productData = products.find((item) => item.productId === productId);
      setSelectedProduct(productData);
    }
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
    setShowCategoryModal(false);
    setSelectedCategories([]);
    setSelectedProduct(null);
    dispatch(resetSuccessProduct());
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [isDeleteProductLoading, isSubmitProductLoading]);

  useEffect(()=>{
    dispatch(getCategory());
  }, [])

  if(!user.role)return navigate("/","replace")

  return (
    <>
      <div className="container py-24 lg:px-8 lg:ml-[calc(5rem)]">
        <div className="mt-4 flex items-center justify-between border-b-2 pb-2">
          <h3 className=" text-2xl font-semibold w-1/2">Products</h3>

          <form className="relative w-1/3" onSubmit={()=>window.alert("ok")}>
            <Input type="text" placeholder="Search"/>
            <button className="absolute top-1/2 right-0 -translate-y-1/2 p-2" type="submit">
              <HiMagnifyingGlass className="text-2xl text-primary" />
            </button>
          </form>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            isButton
            isPrimary
            title="Add Product"
            onClick={() => handleShowModal("Add Product")}
          />

          <div className="">Dropdown For Filter</div>
        </div>

        <div className="relative mt-4 shadow-md">
          <TableProducts
            products={products}
            handleShowModal={handleShowModal}
            isGetProductsLoading={isGetProductsLoading}
            isDeleteProductLoading={isDeleteProductLoading}
            setSelectedProduct={setSelectedProduct}
          />

        </div>
      </div>

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        title={showModal.context}
        disableOutside
      >
        {(showModal.context === "Add Product" ||
          showModal.context === "Edit Details") && (
          <ModalInputProduct
            success={success}
            categories={categories}
            productData={selectedProduct}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            showCategoryModal={showCategoryModal}
            setShowCategoryModal={setShowCategoryModal}
            handleCloseModal={handleCloseModal}
            isSubmitProductLoading={isSubmitProductLoading}
            errorMessage={errorMessage}
          />
        )}

        {showModal.context === "Details Product" && (
          <ModalDetailsProduct
            selectedProduct={selectedProduct}
            categories={categories}
          />
        )}

        {showModal.context === "Delete Product" && (
          <ModalDeleteProduct
            selectedProduct={selectedProduct}
            success={success}
            handleCloseModal={handleCloseModal}
            isDeleteProductLoading={isDeleteProductLoading}
          />
        )}

        {showModal.context === "Edit Stock" && (
          <h3>{selectedProduct.productName}</h3>
          // NOTE: CREATE COMPONENT MODAL FOR EDIT STOCK ex: modal.edit.stock.js
        )}

        {showModal.context === "Edit Unit" && (
          <h3>{selectedProduct.productName}</h3>
          // NOTE: CREATE COMPONENT MODAL FOR EDIT UNIT ex: modal.edit.unit.js
        )}
      </Modal>
    </>
  );
}
