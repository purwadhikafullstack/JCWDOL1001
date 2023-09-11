import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import TableProducts from "./table.products";
import ModalInputProduct from "./modal.input.product";
import { useRef } from "react";
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
    current_page,
    total_page
  } = useSelector((state) => {
    return {
      success: state.products.success,
      products: state.products.data,
      categories: state?.cat?.category,
      isGetProductsLoading: state.products.isGetProductsLoading,
      isDeleteProductLoading: state.products.isDeleteProductLoading,
      isSubmitProductLoading: state.products.isSubmitProductLoading,
      errorMessage: state.products.errorMessage,
      current_page : state.products.current_page,
      total_page : state.products.total_page
    };
  });

  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchedProduct, setSearchedProduct] = useState(null);
  const searchedProductRef = useRef();
  const [page, setPage] = useState(current_page);
  const [options, setOptions] = useState({sortName : "", sortPrice : "", categoryId : ""})

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

  const handleOptionChange = (e) => {
    const {name , value} = e.target
    setOptions({
      ...options, [name] : value
    })
  }

  const handlePreviousPage = () => {
    if(page > 1){
      setPage(page-1);
    }
  }

  const handleNextPage = () => {
    if(page < total_page){
      setPage(page+1);
    }
  }

  useEffect(() => {
    dispatch(getProducts({category_id : options.categoryId,
      product_name : searchedProduct,
      sort_name : options.sortName, 
      sort_price : options.sortPrice, 
      page : page}));
  }, [searchedProduct, options, page, isDeleteProductLoading, isSubmitProductLoading]);

  useEffect(()=>{
    dispatch(getCategory());
  }, [])

  if(!user.role)return navigate("/","replace")

  return (
    <>
      <div className="container py-24 lg:px-8 lg:ml-[calc(5rem)]">
        <div className="mt-4 flex items-center justify-between border-b-2 pb-2">
          <h3 className=" text-2xl font-semibold w-1/2">Products</h3>

          <form className="relative w-1/3">
            <Input type="text" placeholder="Search" ref={searchedProductRef}/>
            <button className="absolute top-1/2 right-0 -translate-y-1/2 p-2" type="button" onClick={()=>setSearchedProduct(searchedProductRef?.current.value)}>
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
          <div className="flex flex-1"></div>

          <div className="items-center px-2 border-l-2 border-solid border-black">
            <label htmlFor="searchcat" className="pr-2">Search Category</label>
            <select id="searchcat" name="categoryId" value={options.categoryId} onChange={handleOptionChange} className="border-2 border-double">
              <option value=""></option>
              {
                categories ?
                  categories?.map((categories, index)=>(
                    <option value={categories.categoryId}>{categories.categoryDesc}</option>
                  ))
                  :
                  <></>
              }
            </select>
          </div>

          <div className="items-center px-2 border-l-2 border-solid border-black">
            <label htmlFor="sortname" className="pr-2">Sort Name</label>
            <select id="sortname" name="sortName" value={options.sortName} onChange={handleOptionChange} className="border-2 border-double">
              <option value=""></option>
              <option value="ASC">A to Z</option>
              <option value="DESC">Z to A</option>
            </select>
          </div>

          <div className="items-center px-2 border-l-2 border-solid border-black">
            <label htmlFor="sortprice" className="pr-2">Sort Price</label>
            <select id="sortprice" name="sortPrice" value={options.sortPrice} onChange={handleOptionChange} className="border-2 border-double">
              <option value=""></option>
              <option value="ASC">Lowest to highest</option>
              <option value="DESC">Highest to Lowest</option>
            </select>
          </div>
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
        <div className="mt-4 flex items-center justify-center text-center text-green-900 text-lg">
          {page!==1 && <button className="px-4 mx-4 bg-gray-200 hover:bg-slate-400 rounded-xl" onClick={handlePreviousPage} disabled={page===1}> Prev </button>}
          <h1>current page : {current_page}</h1>
          {page!==total_page && <button className="px-4 mx-4 bg-gray-200 hover:bg-slate-400 rounded-xl" onClick={handleNextPage} disabled={page===total_page}> Next </button>}
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
