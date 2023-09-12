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
import { getUnits, resetUnit } from "../../../store/slices/product/unit/slices";
import ModalDeleteAndReactiveUnit from "./unit/modal.unit.delete.and.reactivate.product";
import ModalInputProductUnit from "./unit/modal.unit.edit.details";
import ModalAddProductUnit from "./unit/modal.unit.add";
import ModalMakeConvertion from "./unit/modal.unit.make.convertion";
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
  } = useSelector((state) => {
    return {
      success: state.products.success,
      products: state.products.data,
      categories: state?.cat?.category,
      isGetProductsLoading: state.products.isGetProductsLoading,
      isDeleteProductLoading: state.products.isDeleteProductLoading,
      isSubmitProductLoading: state.products.isSubmitProductLoading,
      isSubmitStockLoading : state.products.isSubmitStockLoading,
      errorMessage: state.products.errorMessage,
      current_page : state.products.current_page,
      total_page : state.products.total_page,
      units : state?.units?.data,
      unitsSuccess : state?.units?.success,
      isLoading : state.units.isLoading,
    };
  });

  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchedProduct, setSearchedProduct] = useState(null);
  const searchedProductRef = useRef();
  const [page, setPage] = useState(current_page);
  const [options, setOptions] = useState({sortName : "", sortPrice : "", categoryId : ""})
  const [selectedUnit, setSelectedUnit] = useState({});


  const handleShowModal = ({context, productId, stockId}) => {
    setShowModal({ show: true, context });
    document.body.style.overflow = "hidden";
    
    if (productId) {
      const productData = products.find((item) => item.productId === productId);
      setSelectedProduct(productData);
    }
    
    if({stockId}){
      const unitFinder = selectedProduct.productUnits

      const unitData = unitFinder.find( (unit) => unit.product_detail.stockId === stockId)
      
      Object.assign(selectedUnit,unitData!==undefined ? unitData : {})
    }
   
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
    setSelectedCategories([]);
    setSelectedProduct(null);
    dispatch(resetSuccessProduct());
    dispatch(resetUnit())
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

//     dispatch(
//       getProducts({
//         page: 1,
//         id_cat: "",
//         product_name: "",
//         sort_price: "",
//         sort_name: "",
//       })
//     );
//   }, [isDeleteProductLoading, isSubmitProductLoading]);

    dispatch(getProducts({category_id : options.categoryId,
      product_name : searchedProduct,
      sort_name : options.sortName, 
      sort_price : options.sortPrice, 
      page : page}));
  }, [searchedProduct, options, page, isDeleteProductLoading, isSubmitProductLoading,isSubmitStockLoading,isLoading]);

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getUnits())
  }, [])


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

          <h3 className=" text-2xl font-semibold w-1/2">Products</h3>

          <form className="relative w-1/3">
            <Input type="text" placeholder="Search" ref={searchedProductRef}/>
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
            title="Add Product"
            onClick={() => handleShowModal({context:"Add Product"})}
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

//           <div className="mt-4 flex gap-4 lg:mt-0 lg:justify-self-end">
//             <select
//               className="bg-slate-50 border-primary block rounded-lg border p-2.5 text-sm outline-primary focus:border-primary focus:ring-primary w-1/2"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option
//                   key={category.categoryId}
//                   value={category.categoryId}
//                   className="p-2"
//                 >
//                   {category.categoryDesc}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="bg-slate-50 border-primary block rounded-lg border p-2.5 text-sm outline-primary focus:border-primary focus:ring-primary w-1/2"
//             >
//               <option value="">Filter: None</option>
//               {categories.map((category) => (
//                 <option
//                   key={category.categoryId}
//                   value={category.categoryId}
//                   className="p-2"
//                 >
//                   {category.categoryDesc}
//                 </option>
//               ))}

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
            isSubmitProductLoading={isSubmitProductLoading}
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
          <ModalEditStock
          success={success}
          productData={selectedProduct}
          handleCloseModal={handleCloseModal}
          isSubmitStockLoading={isSubmitStockLoading}
          errorMessage={errorMessage}
        />
        )}

        {showModal.context === "Edit Unit" && (
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
