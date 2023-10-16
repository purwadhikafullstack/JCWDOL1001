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
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

import { getUnits } from "../../../store/slices/product/unit/slices";
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
      isLoading : state.units.isLoading,
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
    dispatch(getUnits());
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

  const handleSearch = (event) => {
    setPage(1)
    event.preventDefault();
    setSearchedProduct(searchedProductRef?.current.value)
  };

  useEffect(() => {
    dispatch(getCategory({page : categoriesPage}));
    dispatch(getUnits())
  }, [categoriesPage])

    const clearSearch = () => {
    setSearchedProduct(null)
    setPage(1)
    searchedProductRef.current.value = "";
  }

  if (!user.role) return navigate("/", "replace");

  return (
    <>
      <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
        <div className="flex items-center justify-between border-b-2 pb-2">

          <h3 className="title">Produk</h3>

          <form className="relative w-1/2 lg:w-1/3" onSubmit={(e) => {
            handleSearch(e)
          }}>
            <Input type="text" placeholder="Cari Produk..." ref={searchedProductRef}/>
            <button className="absolute top-1/2 right-0 -translate-y-1/2 p-2" type="submit"
            >
              <HiMagnifyingGlass className="text-2xl text-primary" />
            </button>

            {searchedProduct && 
              <Button
                className="absolute right-8 top-1/2 -translate-y-1/2 p-2"
                onClick={clearSearch}
              >
                <HiXMark className="text-2xl text-primary" />
              </Button>
            }
          </form>
        </div>
        
        <div className="mt-4">
          <Button
            isButton
            isPrimary
            className="lg:justify-self-start"
            title="Tambah Produk"
            onClick={() => handleShowModal({context:"Tambah Produk"})}
          />

          <div className="flex gap-4 lg:flex-row flex-col mt-2">
              <select id="searchcat" name="categoryId" value={options.categoryId} onChange={handleOptionChange} className="p-2 rounded-lg border border-slate-300 bg-slate-50">
                <option value="" disabled>Pilih Kategori</option>
                {
                  categories ?
                    categories?.map((categories, index)=>(
                      <option value={categories.categoryId}>{categories.categoryDesc}</option>
                    ))
                    :
                    <></>
                }
              </select>

              <select id="sortname" name="sortName" value={options.sortName} onChange={handleOptionChange} className="p-2 rounded-lg border border-slate-300 bg-slate-50">
                <option value="" disabled>Urutkan Nama</option>
                <option value="ASC">A - Z</option>
                <option value="DESC">Z - A</option>
              </select>

              <select id="sortprice" name="sortPrice" value={options.sortPrice} onChange={handleOptionChange} className="p-2 rounded-lg border border-slate-300 bg-slate-50">
                <option value="" disabled>Urutkan Harga</option>
                <option value="ASC">Terendah - Tertinggi</option>
                <option value="DESC">Tertinggi - Terendah</option>
              </select>

              <Button className="text-danger" onClick={()=>setOptions({sortName : "", sortPrice : "", categoryId : ""})}>
                Reset Filter
              </Button>
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
            current_page={current_page}
          />
        </div>

        <div className="mt-4 flex items-center justify-center">
          {total_page > 1 && <Pagination currentPage={current_page} totalPage={total_page} setPage={setPage}/>}
        </div>

      </div>

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        halfWidth={["Detail Produk", "Tambah Produk", "Ubah Detail"].includes(showModal.context)}
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

        {showModal.context === "Ubah Satuan" && (
          <>
            <h3 className="text-xl font-bold">| {selectedProduct.productName}</h3>
            <ModalUnitsProduct
              selectedProduct = {selectedProduct}
              handleShowModal = {handleShowModal}
            />
          </>
        )}

        {(showModal.context === "Hapus Satuan" || showModal.context === "Aktifkan Satuan") && (
          <ModalDeleteAndReactiveUnit
            messageInput = {showModal.context.toLowerCase()}
            selectedUnit={selectedUnit}
            success={unitsSuccess}
            handleShowModal = {handleShowModal}
            handleCloseModal={handleCloseModal}
            isDeleteProductLoading={isDeleteProductLoading}
          />
        )}

        {showModal.context === "Ubah Detail Satuan" && (
          <ModalInputProductUnit
            success={unitsSuccess}
            units={units}
            productData={selectedProduct}
            selectedUnit={selectedUnit}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        )}

        {showModal.context === "Tambah Satuan Baru" && (
          <ModalAddProductUnit
            success={unitsSuccess}
            units={units}
            productData={selectedProduct}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        )}

        {showModal.context === "Konversi Satuan" && (
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
