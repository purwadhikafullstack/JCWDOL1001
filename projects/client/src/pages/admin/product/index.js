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
import { HiPlus } from "react-icons/hi";
export default function AdminProducts({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShowModal = (context, productId) => {
    setShowModal({ show: true, context });

    if (productId) {
      const productData = products.find((item) => item.productId === productId);
      setSelectedProduct(productData);
    }
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
    setSelectedCategories([]);
    setSelectedProduct(null);
    dispatch(resetSuccessProduct());
  };

  useEffect(() => {
    dispatch(
      getProducts({
        page: 1,
        id_cat: "",
        product_name: "",
        sort_price: "",
        sort_name: "",
        limit:10
      })
    );
  }, [isDeleteProductLoading, isSubmitProductLoading]);

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  if (!user.role) return navigate("/", "replace");

  return (
    <>
      <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
        <form className="relative lg:w-1/3" onSubmit={() => window.alert("ok")}>
          <Input type="text" placeholder="Search" />
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
            type="submit"
          >
            <HiMagnifyingGlass className="text-2xl text-primary" />
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between border-b-2 pb-2">
          <h3 className=" w-1/2 text-2xl font-semibold">Products</h3>
        </div>
        
        <div className="mt-4 grid lg:grid-cols-2">
          <Button
            isButton
            isPrimary
            className="lg:justify-self-start"
            title="Add Product"
            onClick={() => handleShowModal("Add Product")}
          />

          <div className="mt-4 flex gap-4 lg:mt-0 lg:justify-self-end">
            <select
              className="bg-slate-50 border-primary block rounded-lg border p-2.5 text-sm outline-primary focus:border-primary focus:ring-primary w-1/2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                  className="p-2"
                >
                  {category.categoryDesc}
                </option>
              ))}
            </select>

            <select
              className="bg-slate-50 border-primary block rounded-lg border p-2.5 text-sm outline-primary focus:border-primary focus:ring-primary w-1/2"
            >
              <option value="">Filter: None</option>
              {categories.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                  className="p-2"
                >
                  {category.categoryDesc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative mt-4 shadow-md">
          <TableProducts
            products={products}
            handleShowModal={handleShowModal}
            isGetProductsLoading={isGetProductsLoading}
            isSubmitProductLoading={isSubmitProductLoading}
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
