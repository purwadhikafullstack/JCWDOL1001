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
import NormalProductList from "./components/component.normalProduct";

export default function CustomOrder({ statusId, statusDesc }) {
  const dispatch = useDispatch();
  const { dataProduct,dataUser,message} = useSelector((state) => {
    return {
      dataProduct: state?.products?.data,
      dataUser : state?.custom?.dataUser,
      //butuh data product
      message : state?.custom?.message
    };
  });

  //berarti butuh useState buat simpan:
  // useState dalam pengerjaan list Mapping, bukan handle modal
  const [option, setOption] = useState(2)
  const optionRef = useRef(null)
  const [listAllCustomProduct, setListAllCustomProduct] = useState([])
  const [image, setImage] = useState(null)
  // untuk input product custom
  const[listAllIngredient, setListAllIngredient] = useState([])
  const [ingredientId, setIngredientId] = useState(null)
  const [titleState, setTitleState] = useState("")
  const [email, setEmail] = useState(null)
  const [ingredientName, setIngredientName] = useState(null)
  const ingredientQuantityRef = useRef(null)
  
  //useRef
  const [oldNameProduct, setOldNameProduct] = useState("")
  const [productIdState, setProductIdState] = useState("")
  //useref exclusive for custom product
  const [productNameState, setProductNameState] = useState("")
  const [productPriceState, setProductPriceState] = useState("")
  const [productQuantityState, setProductQuantityState] = useState("")
  const [productDosageState, setProductDosageState] = useState("")
  //useRef exclusive for normal product
  const [normalProductState,setNormalProductState] = useState("")
  //useref penentuan jenis produk
  const [medState,setMedState] = useState(false)
  const [userState,setUserState] = useState(false)

  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] =useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const selectedTransactionDetail = selectedTransaction?.transactionDetail;

  const handleShowAllModal = () =>{
    setShowModal(true)
    setListAllIngredient([])
    setProductIdState("")
    setProductDosageState("")
    setProductNameState("")
    setProductPriceState("")
    setProductQuantityState("")
    setOption(2)
  }

  const onChangeValue = (event, state) =>{
    const newValue = event.target.value
    if(newValue){
      state(newValue)
    }
  } 


  const handleShowModal = (productName) => {
    // munculin modal
    setTitleState(true)
    setShowModal(true);

    //cari data di listAllCustomProduct
    if (productName) {
      const selectedProduct = listAllCustomProduct.find(
        (item) => item.productName === productName
      );

      if(selectedProduct.type === 1) {
      // setSelectedTransaction(transactionData);
      setListAllIngredient(selectedProduct?.ingredients)
      setProductNameState(selectedProduct?.productName)  
      setOldNameProduct(selectedProduct?.productName)
      setProductPriceState(selectedProduct?.productPrice)
      setProductDosageState(selectedProduct?.productDosage)
      setProductQuantityState(selectedProduct?.quantity)
      setOption(1)
    }
    if(selectedProduct.type === 0){
      setOption(0)
      setProductIdState(selectedProduct?.productId)
      setProductQuantityState(selectedProduct?.quantity)
      setNormalProductState(selectedProduct?.productName)
      setOldNameProduct(selectedProduct?.productName)
    }
    }
  };

  const handleCloseModal = () => {
    setMedState(false)
    setTitleState(false)
    setProductNameState("")
    setProductIdState("")
    setProductPriceState("")
    setProductDosageState("")
    setProductQuantityState("")
    setOption(2)
    setShowModal(false);
    setShowImageModal(false)
  };

  const handleAddModal = () => {
    setTitleState(false)
    const items = listAllCustomProduct;
    if(!titleState){
    if(option === 1){
      items.push({
        // productName : productNameRef.current.value,
        productName : productNameState,
        productPrice : productPriceState,
        productDosage: productDosageState,
        quantity : productQuantityState,
        type : 1,
        ingredients : listAllIngredient
      })
    }
    if(option === 0){
      items.push({
        // productName : productNameRef.current.value,
        productId : productIdState,
        productName : productNameState,
        productPrice : productPriceState,
        quantity : productQuantityState,
        type : 0,
      })
    }
  }
  else{
    const result = listAllCustomProduct
    console.log(productNameState)
    console.log(oldNameProduct)
      for(let i =0; i < result.length ; i++){
        if(result[i].productName === oldNameProduct){
          if(option === 1){
            console.log("ini dya ",result[i].productName)
            result[i].productName = productNameState ? productNameState : result[i].productName
            result[i].productPrice = productPriceState
            result[i].productDosage= productDosageState
            result[i].quantity = productQuantityState
            result[i].ingredients = listAllIngredient
          }
          if(option === 0){
            console.log("ini dya ",result[i].productName)
            result[i].productName = productNameState ? productNameState : result[i].productName
            result[i].productPrice = productPriceState
            result[i].quantity = productQuantityState
        }
      }
    }
    
    console.log("result = ",result)
      setListAllCustomProduct(result)
  }
    setProductNameState("")
    setProductIdState("")
    setProductPriceState("")
    setProductDosageState("")
    setProductQuantityState("")
    setOption(2)
    console.log(items)
    setListAllCustomProduct(items)
    setMedState(false)
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
  const onNormalProductChange = (params) =>{
    const result = params.split(",")
    console.log(result)
    // product ID
    setProductIdState(result[0])
    setProductNameState(result[1])
    setProductPriceState(result[2])
    
}

const onUserChange = (params) =>{
  const result = params.split(",")
  setEmail(result[0])
  setImage(result[2])
  setUserState(true)
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
  setListAllCustomProduct([])
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

  useEffect(()=>{
//handleGetUser yang uda disorting boleh juga
//setiap getuser ada update, di state
  dispatch(getUser())
  },[message])

  return (
    <>
      <div className="container pt-24 pb-6 lg:ml-[calc(5rem)] lg:px-8">
        <UserList
        user={dataUser}
        onUserChange={onUserChange}
        />
      </div>
        {userState && 
        <div className="container lg:ml-[calc(5rem)] lg:px-8">
        <div>
          <span className="font-semibold">
          Preview Resep Dokter :
          </span>
        <div className="h-[300px] w-[300px] mb-8 object-center duration-300 pt-3" 
        onClick={()=>setShowImageModal(!showImageModal)}>
        <img
          src={process.env.REACT_APP_CLOUDINARY_BASE_URL + image}
          alt={"image"}
          className="h-[300px] w-[300px] object-center duration-300"
        />

        <Modal
        showModal={showImageModal}
        halfWidth={true}
        closeModal={!showImageModal}
        title={`Gambar Resep Dokter`}
        >
        <img
          src={process.env.REACT_APP_CLOUDINARY_BASE_URL + image}
          alt={"image"}
          className="h-full w-full object-center duration-300"
          />
          
      </Modal>
        </div>
        <span className="font-semibold">
                List Produk : 
            </span>
        <div className="flex flex-col gap-4 pb-24 pt-3 lg:pb-0">
        {listAllCustomProduct.map((item) => {
          // const moreItems = transactionDetail.length - 1;
          if(item.type === 1){
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
          }
          if(item.type === 0) {
            return(
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
              </div>
            </div>
            )
          }

        })}
        </div>
        
          {userState &&
        <div>
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
        }

      </div>
      </div>
      }
      <Modal
        showModal={showModal}
        halfWidth={true}
        closeModal={()=>handleCloseModal()}
        title={titleState ? `Edit Product Section` : `Add Product Section`}
      >
        {/* masukin option 2 pilihan, option dan setoptionm, tiga kondisi */}
        <span className="">
          Jenis produk apa yang ingin Anda tambahkan?
        </span>
        <select className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2 mb-4
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={optionRef} onChange={()=>{setOption(+optionRef?.current?.value)}}
            onClick={()=>setMedState(true)}
            >
          <option disabled={medState}>Pilih jenis produk : </option>
          <option selected={option === 0} value="0" >Produk Satuan</option>
          <option selected={option === 1} value="1">Obat Racik</option>
        </select>

        { option === 1 &&
        <div className="grid gap-2 md:grid-cols-2 max-h-[50vh] lg:max-h-screen overflow-y-auto">
          {/* kiri */}
          <div className="">
            <div
              className="border p-4 shadow-md"
            >
              <div className="flex items-center justify-between">
              <h3 className="title">Tambah Bahan Obat Racik</h3>
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
                    label="Jumlah Obat Racik"
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
          <div className="w-full h-fit mt-8 md:mt-0 border p-2">
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
                // ref={productNameRef}
                value={productNameState}
                onChange={(event)=>onChangeValue(event,setProductNameState)}
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
                value={productPriceState}
                type="number"
                label="Product Price"
                placeholder="e.g. 35000"
                onChange={event=>onChangeValue(event,setProductPriceState)}
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
                value={productDosageState}
                type="text"
                label="Product Dosage"
                placeholder="e.g. 3 x 1 hari"
                onChange={event=>{onChangeValue(event,setProductDosageState)}}
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
                value={productQuantityState}
                type="number"
                label="Product Quantity"
                placeholder="e.g. 3"
                onChange={event=>{onChangeValue(event,setProductQuantityState)}}
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
}
{
  option === 0 && 
  <div className="grid gap-2 max-h-[50vh] lg:max-h-screen overflow-y-auto">
    <div className="border p-4 shadow-md">
      <NormalProductList
        product={dataProduct}
        onNormalProductChange={onNormalProductChange}
        productId={productIdState}
        selected={normalProductState}
      />
      <div className="">
              <Input
                value={productQuantityState}
                type="number"
                label="Product Quantity"
                placeholder="e.g. 3"
                onChange={event=>{onChangeValue(event,setProductQuantityState)}}
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
}
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
