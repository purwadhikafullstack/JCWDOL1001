import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import TableProducts from "./table.products";
import ModalInputProduct from "./modal.input.product";
import { useRef } from "react";
import ModalUnitsProduct from "./unit/modal.units.product";
import ModalEditStock from "./modal.edit.stock.js";
import {
  getProducts,
  resetSuccessProduct,
} from "../../../store/slices/product/slices";
import { getCategory } from "../../../store/slices/cat/slices";
import ModalDetailsProduct from "./modal.details.product";
import ModalDeleteProduct from "./modal.delete.product";

import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { getUnits, resetUnit } from "../../../store/slices/product/unit/slices";
import ModalDeleteAndReactiveUnit from "./unit/modal.unit.delete.and.reactivate.product";
import ModalInputProductUnit from "./unit/modal.unit.edit.details";
import ModalAddProductUnit from "./unit/modal.unit.add";
import ModalMakeConvertion from "./unit/modal.unit.make.convertion";
import Pagination from "../../../components/PaginationV2";

export default function AdminProducts({user}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    success,
    products,
    categories,
    isGetProductsLoading,
    isDeleteProductLoading,
    isSubmitProductLoading,
    isSubmitStockLoading,
    errorMessage,
    current_page,
    total_page,
    units,
    unitsSuccess,
    isLoading,
    categoriesCurrentPage,
    categoriesTotalPage
  } = useSelector((state) => {
    return {
      success: state.products.success,
      products: state.products.data,
      current_page : state.products.current_page,
      total_page : state.products.total_page,

      categories: state?.cat?.category,
      categoriesCurrentPage : state?.cat?.currentPage,
      categoriesTotalPage : state?.cat?.totalPage,

      isGetProductsLoading: state.products.isGetProductsLoading,
      isDeleteProductLoading: state.products.isDeleteProductLoading,
      isSubmitProductLoading: state.products.isSubmitProductLoading,
      isSubmitStockLoading : state.products.isSubmitStockLoading,
      errorMessage: state.products.errorMessage,

      units : state?.units?.data,
      unitsSuccess : state?.units?.success,
      isLoading : state.units.isLoading, //penyebab produk ngedispatch setiap close modal
    };
  });

  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [options, setOptions] = useState({sortName : "", sortPrice : "", categoryId : ""})
  const [selectedUnit, setSelectedUnit] = useState({});
  const searchedProductRef = useRef();


  const handleShowModal = ({context, productId, stockId}) => {
    setShowModal({ show: true, context });
    
    document.body.style.overflow = "hidden";
    
    if (productId) {
      const productData = products.find((item) => item.productId === productId);
      setSelectedProduct(productData);
    }
    
    if({stockId}){
      const unitFinder = selectedProduct?.productUnits

      const unitData = unitFinder?.find( (unit) => unit.product_detail.stockId === stockId)
      
      Object.assign(selectedUnit,unitData!==undefined ? unitData : {})
    }
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
    setSelectedProduct(null);
    dispatch(resetSuccessProduct());
    dispatch(resetUnit())
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [isDeleteProductLoading, isSubmitProductLoading, isSubmitStockLoading, isLoading]);
  
  const handleOptionChange = (e) => {
    const {name , value} = e.target
    setOptions({
      ...options, [name] : value
    })
  }

  useEffect(() => {

    dispatch(
      getProducts({
      category_id : options.categoryId,
      product_name : searchedProduct,
      sort_name : options.sortName, 
      sort_price : options.sortPrice, 
      page : page,
      limit:10
      })
    );
  }, [searchedProduct, options, page, isDeleteProductLoading, isSubmitProductLoading,isSubmitStockLoading,isLoading]);

  useEffect(() => {
    dispatch(getCategory({page : categoriesPage}));
    dispatch(getUnits())
  }, [categoriesPage])


  if (!user.role) return navigate("/", "replace");

  return (
    <>
      <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
        <div className="mt-4 flex items-center justify-between border-b-2 pb-2">

          <h3 className=" text-2xl font-semibold w-1/2">Products</h3>

          <form className="relative w-1/3">
            <Input type="text" placeholder="Cari Produk..." ref={searchedProductRef}/>
            <button className="absolute top-1/2 right-0 -translate-y-1/2 p-2" type="button" onClick={()=>setSearchedProduct(searchedProductRef?.current.value)}>
              <HiMagnifyingGlass className="text-2xl text-primary" />
            </button>
          </form>
        </div>
        
        <div className="mt-4 grid lg:grid-cols-2">
          <Button
            isButton
            isPrimary
            className="lg:justify-self-start"
            title="Tambah Produk"
            onClick={() => handleShowModal({context:"Tambah Produk"})}
          />
          <div className="flex flex-1"></div>

          <div className="items-center px-2 border-l-2 border-solid border-black">
            <label htmlFor="searchcat" className="pr-2">Pilih Kategori</label>
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
            <label htmlFor="sortname" className="pr-2">Urutkan Nama</label>
            <select id="sortname" name="sortName" value={options.sortName} onChange={handleOptionChange} className="border-2 border-double">
              <option value=""></option>
              <option value="ASC">A - Z</option>
              <option value="DESC">Z - A</option>
            </select>
          </div>

          <div className="items-center px-2 border-l-2 border-solid border-black">
            <label htmlFor="sortprice" className="pr-2">Urutkan Harga</label>
            <select id="sortprice" name="sortPrice" value={options.sortPrice} onChange={handleOptionChange} className="border-2 border-double">
              <option value=""></option>
              <option value="ASC">Terendah - Tertinggi</option>
              <option value="DESC">Tertinggi - Terendah</option>

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
        <div className="mt-4 flex items-center justify-center">
          <Pagination currentPage={current_page} totalPage={total_page} setPage={setPage}/>
        </div>
      </div>

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        title={showModal.context}
        disableOutside
      >
        {(showModal.context === "Tambah Produk" ||
          showModal.context === "Ubah Detail") && (
          <ModalInputProduct
            success={success}
            categories={categories}
            categoriesCurrentPage={categoriesCurrentPage}
            categoriesTotalPage={categoriesTotalPage}
            setCategoriesPage={setCategoriesPage}
            productData={selectedProduct}
            handleCloseModal={handleCloseModal}
            isSubmitProductLoading={isSubmitProductLoading}
          />
        )}

        {showModal.context === "Detail Produk" && (
          <ModalDetailsProduct
            selectedProduct={selectedProduct}
            categories={categories}
          />
        )}

        {showModal.context === "Hapus Produk" && (
          <ModalDeleteProduct
            selectedProduct={selectedProduct}
            success={success}
            handleCloseModal={handleCloseModal}
            isDeleteProductLoading={isDeleteProductLoading}
          />
        )}

        {showModal.context === "Ubah Stok" && (
          <ModalEditStock
          success={success}
          productData={selectedProduct}
          handleCloseModal={handleCloseModal}
          isSubmitStockLoading={isSubmitStockLoading}
          errorMessage={errorMessage}
        />
        )}

        {showModal.context === "Ubah Unit" && (
          <>
            <h3 className="text-xl font-bold">| {selectedProduct.productName}</h3>
            <ModalUnitsProduct
              selectedProduct = {selectedProduct}
              handleShowModal = {handleShowModal}
            />
          </>
        )}

        {(showModal.context === "Delete Unit" || showModal.context === "Reactivate Unit") && (
          <ModalDeleteAndReactiveUnit
            messageInput = {showModal.context.toLowerCase()}
            selectedUnit={selectedUnit}
            success={unitsSuccess}
            handleShowModal = {handleShowModal}
            handleCloseModal={handleCloseModal}
            isDeleteProductLoading={isDeleteProductLoading}
          />
        )}

        {showModal.context === "Edit Unit Details" && (
          <ModalInputProductUnit
            success={unitsSuccess}
            units={units}
            productData={selectedProduct}
            selectedUnit={selectedUnit}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        )}

        {showModal.context === "Add New Unit" && (
          <ModalAddProductUnit
            success={unitsSuccess}
            units={units}
            productData={selectedProduct}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        )}

        {showModal.context === "Make Convertion" && (
          <ModalMakeConvertion
            success={unitsSuccess}
            productData={selectedProduct}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        )}
      </Modal>
    </>
  );
}
