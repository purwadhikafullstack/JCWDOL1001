import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionList } from "../../../store/slices/transaction/slices";
import { formatDate } from "../../../utils/formatDate";
import formatNumber from "../../../utils/formatNumber";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import IngredientList from "./components/component.ingredients";
import { BsTrashFill } from "react-icons/bs";
import Input from "../../../components/Input";
import { getProducts } from "../../../store/slices/product/slices";
import { checkIngredient, getUser } from "../../../store/slices/custom/slices";
import UserList from "./components/component.user";

export default function CustomOrder({ statusId, statusDesc }) {
  const dispatch = useDispatch();
  const { dataProduct,dataUser} = useSelector((state) => {
    return {
      dataProduct: state?.products?.data,
      dataUser : state?.custom?.dataUser
      //butuh data product
    };
  });

  //berarti butuh useState buat simpan:
  // useState dalam pengerjaan list Mapping, bukan handle modal
  const [listAllProduct, setListAllProduct] = useState([])
  const [listAllCustomProduct, setListAllCustomProduct] = useState([])
  // const [listAllNormalProduct, setListAllNormalProduct] = useState([])

  // untuk input product custom
  const[listAllIngredient, setListAllIngredient] = useState([])
  const [ingredientId, setIngredientId] = useState(null)
  const [email, setEmail] = useState(null)
  const [ingredientName, setIngredientName] = useState(null)
  const ingredientQuantityRef = useRef(null)
  const [ListInputProduct, setListInputProduct] = useState([])
  
  //useRef
  const productNameRef = useRef(null)
  const productPriceRef = useRef(null)
  const productQuantityRef = useRef(null)
  const productDosageRef = useRef(null)

  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const selectedTransactionDetail = selectedTransaction?.transactionDetail;

  const handleShowAllModal = () =>{
    setShowModal(true)
    setListAllIngredient([])
    productNameRef.current.value = ""
    productPriceRef.current.value = ""
    productDosageRef.current.value = ""
    productQuantityRef.current.value = ""
  }

  const handleShowModal = (productName) => {
    // munculin modal
    setShowModal(true);

    //cari data di listAllCustomProduct
    if (productName) {
      const selectedProduct = listAllCustomProduct.find(
        (item) => item.productName === productName
      );
      // setSelectedTransaction(transactionData);
      setListAllIngredient(selectedProduct?.ingredients)
      productNameRef.current.value = selectedProduct?.productName
      productPriceRef.current.value = selectedProduct?.productPrice
      productDosageRef.current.value = selectedProduct?.productDosage
      productQuantityRef.current.value = selectedProduct?.quantity
      }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleAddModal = () => {
    const items = listAllCustomProduct;
    items.push({
      productName : productNameRef.current.value,
      productPrice : productPriceRef.current.value,
      productDosage: productDosageRef.current.value,
      quantity : productQuantityRef.current.value,
      ingredients : listAllIngredient
    })
    console.log(items)
    setListAllCustomProduct(items)

    setShowModal(false);
  };

  const onDeleteIngredient = (productId) =>{
    if (productId) {
      const selectedIngredient = listAllIngredient.filter(
        (item) => item.productId !== productId
      );
      setListAllIngredient(selectedIngredient);
  }}

  const onIngredientProductChange = (params) =>{
    const result = params.split(",")
    // product ID
    setIngredientId(result[0])
    // productName
    setIngredientName(result[1]);
}

const onUserChange = (params) =>{
  const result = params.split(",")
  // email
  setEmail(result[0])
  // productName
  // setIngredientName(result[1]);
}

const submitIngredient = () =>{
  const result = [...listAllIngredient
  ,{
    productId : ingredientId,
    productName : ingredientName,
    quantity : ingredientQuantityRef?.current?.value
  }]
  console.log(result)
  setListAllIngredient(result)
}

const handleSubmitOrder = () =>{

  dispatch(checkIngredient({
    email : email,
    data : listAllCustomProduct
  }))
  //hapus semua data
}
  useEffect(() => {
    dispatch(getProducts({
      category_id : "",
      product_name : "",
      sort_name : "", 
      sort_price : "", 
      page : 1,
      limit: 12
    }));
    dispatch(getUser())
  }, []);

  return (
    <>
      <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
        <UserList
        user={dataUser}
        onUserChange={onUserChange}
        />
        <div className="flex flex-col gap-4 pb-24 pt-3 lg:pb-0">
        {listAllCustomProduct.map((item) => {
          // const moreItems = transactionDetail.length - 1;

          return (
            <div
              // key={item}
              className="cursor-pointer rounded-lg border p-4 shadow-md duration-300 hover:border-primary"
              onClick={() => handleShowModal(item.productName)}
            >
              <div className="flex flex-col items-start">
                <p className="mb-4 text-sm font-semibold text-primary">
                  {item.productName}
                </p>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Price : {item.productPrice}
                </p>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Quantity : {item.quantity}
                </p>
                <p className="mb-2 text-sm font-semibold text-primary">
                  Ingredients :
                </p>
              </div>
              <div className={`mb-2 flex flex-col gap-1 overflow-hidden`}>
                {item?.ingredients
                  .map((product, index) => (
                    <div
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="">
                        <div className="flex flex-row gap-2">
                        <p>{product?.productName}</p>
                          <span>x</span>
                          <p>{product?.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))
                  }
              </div>

              {/* {transactionDetail.length > 1 && (
                <Button
                  isButton
                  isPrimaryOutline
                  isBLock
                  title={`+${moreItems} Barang Lagi`}
                />
              )} */}

              {/* <div className="mt-2 flex items-center justify-between gap-2 border-t-2 pt-2">
                <div className="">
                  <p className="text-sm">Total Belanja</p>
                  <p className="font-bold">{formatNumber(item.total)}</p>
                </div>

                <p className="text-sm text-primary font-semibold">{statusDesc}</p>
              </div> */}

            </div>
          );
        })}
        </div>
        <Button
                  isButton
                  isPrimary
                  isBLock
                  className={"mt-2"}
                  onClick={handleShowAllModal}
                  title={`Add New Product`}
                />
                        <Button
                  isButton
                  // isPrimary
                  isBLock
                  className={"mt-5 bg-green-500 text-white"}
                  onClick={handleSubmitOrder}
                  title={`Submit Order`}
                />
      </div>
      <Modal
        showModal={showModal}
        halfWidth={true}
        closeModal={()=>handleCloseModal()}
        title={`Add Product Section`}
      >
        <div className="grid gap-2 md:grid-cols-2 max-h-[50vh] lg:max-h-screen overflow-y-auto">
          {/* kiri */}
          <div className="">
            <div
              className="border p-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span>
                  Add Ingredient
                </span>
              </div>
              <div className={`mb-2 flex flex-col gap-1 overflow-hidden`}>
                {/* isi input, quantity */}
              <div className="">

                <IngredientList
                onIngredientProductChange={onIngredientProductChange}
                // onIngredientUnitChange={onIngredientUnitChange}
                product={dataProduct}
                
                />
                <div className="">
                  <Input
                    ref={ingredientQuantityRef}
                    type="number"
                    label="Ingredient Quantity"
                    placeholder="e.g. 1"
                    // errorInput={error.IngredientQtyRef}
                    // onChange={() => setError({ ...error, ingredientQtyRef: false })}
                  />
                  {/* {error.ingredientQtyRef && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.ingredientQtyRef}
                    </div>
                  )} */}
                </div>

              </div>

      </div>

              <div className="mt-2 flex items-center justify-between gap-2 border-t-2 pt-2">
                  {/* button add ingredient */}
                  <Button
              isButton
              isPrimary
              title={`Add Ingredient`}
              onClick={() => submitIngredient()}
              />
              </div>
            </div>
          </div>

          {/* kanan */}
          <div className="w-full h-fit mt-8 md:mt-0">
            <h3 className="title">Summary</h3>
              <div>
                Ingredients
              </div>
            <div className="flex flex-col gap-3">
              {/* ingredients list 
                  mapping array of ingredients
              */}
              {
                listAllIngredient.map(item =>{
                   return(
                    <div className="flex flex-row gap-2">
                      <span>
                      {item?.productName}
                      </span>
                      <span>
                      {item?.quantity}
                      </span>
                      <button className="p-2 bg-red-700 text-white duration-200 hover:bg-red-600"
                      onClick={()=>onDeleteIngredient(item?.productId)}>
                      <BsTrashFill/> 
                      </button>
                    </div>
                   )
                })
              }

            </div>

              {/* input 4 datanya */}
          <div className="mt-4 flex flex-col gap-y-4">
            <div className="">
              <Input
                ref={productNameRef}
                type="text"
                label="Product Name"
                placeholder="e.g. Paracetamol 500 mg"
                // errorInput={error.productName}
                // onChange={() => setError({ ...error, productName: false })}
              />
              {/* {error.productName && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productName}
                </div>
              )} */}
            </div>

            <div className="">
              <Input
                ref={productPriceRef}
                type="number"
                label="Product Price"
                placeholder="e.g. 35000"
                // errorInput={error.productPrice}
                // onChange={() => setError({ ...error, productPrice: false })}
              />
              {/* {error.productPrice && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productPrice}
                </div>
              )} */}
            </div>

            <div className="">
              <Input
                ref={productDosageRef}
                type="text"
                label="Product Dosage"
                placeholder="e.g. 3 x 1 hari"
                // errorInput={error.productDosage}
                // onChange={() => setError({ ...error, productDosage: false })}
              />
              {/* {error.productDosage && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productDosage}
                </div>
              )} */}
            </div>

            <div className="">
              <Input
                ref={productQuantityRef}
                type="number"
                label="Product Quantity"
                placeholder="e.g. 3"
                // errorInput={error.productPrice}
                // onChange={() => setError({ ...error, productPrice: false })}
              />
              {/* {error.productPrice && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productPrice}
                </div>
              )} */}
            </div>


            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <Button
            isButton
            isPrimaryOutline
            title={`Tutup`}
            onClick={() => handleCloseModal()}
          />
          <div className="flex gap-2">
            <Button
              isButton
              isPrimary
              title={`Confirm`}
              onClick={() => handleAddModal()}
              />
          </div>
        </div>
      </Modal>
    </>
  )
}
