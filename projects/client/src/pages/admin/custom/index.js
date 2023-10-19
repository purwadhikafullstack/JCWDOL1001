import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatNumber from "../../../utils/formatNumber";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import IngredientList from "./components/component.ingredients";
import { BsTrashFill,BsImage } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import Input from "../../../components/Input";
import { checkIngredient } from "../../../store/slices/custom/slices";
import UserList from "./components/component.user";
import NormalProductList from "./components/component.normalProduct";
import { capitalizeEachWords } from "../../../utils/capitalizeEachWords";
import { customValidationSchema, ingredientValidationSchema, normalValidationSchema } from "../../../store/slices/custom/validation";
import { toast } from "react-toastify";

export default function CustomOrder({}) {
  const dispatch = useDispatch();
  const {dataUser} = useSelector((state) => {
    return {
      // dataProduct: state?.products?.data,
      dataUser : state?.custom?.dataUser,
      totalPage : state?.custom?.totalPage,
      currentPage : state?.custom?.currentPage,
      // message : state?.custom?.message
    };
  });

  //berarti butuh useState buat simpan:
  // useState dalam pengerjaan list Mapping, bukan handle modal
  const [option, setOption] = useState(2)
  const optionRef = useRef(null)
  const [listAllCustomProduct, setListAllCustomProduct] = useState([])
  // untuk input product custom
  const[listAllIngredient, setListAllIngredient] = useState([])
  const [ingredientId, setIngredientId] = useState(null)
  const [titleState, setTitleState] = useState("")
  const [image, setImage] = useState(null)
  const [email, setEmail] = useState(null)
  const [name,setName] = useState(null)
  const [ingredientName, setIngredientName] = useState(null)
  const ingredientQuantityRef = useRef(null)
  const [ingredientSubmit, setIngredientSubmit] = useState(false)
  const [productSubmit, setProductSubmit] = useState(false)
  
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
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] =useState(false)
  const [showConfirmModal, setShowConfirmModal] =useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)

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
      setProductPriceState(selectedProduct?.productPrice)
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
    setShowConfirmModal(false)
  };

  const handleAddModal = async () => {
    try{
    setTitleState(false)
    const items = listAllCustomProduct;
    setError("")
    //validation
    if(option === 1){
      await customValidationSchema.validate({
        ingredientList : listAllIngredient,
        productName : productNameState,
        productPrice : productPriceState,
        productDosage: productDosageState,
        productQuantity : productQuantityState,
      },{
        abortEarly : false
      })
    }
    if( option === 0){
      await normalValidationSchema.validate({
        normalProductId : +productIdState,
        normalProductName : productNameState,
        normalProductPrice : productPriceState,
        normalProductQuantity :productQuantityState
      },{
        abortEarly : false
      })
    }


    if(!titleState){
      if(option === 1){
        //await custom
      
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
        //await normal
       
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
    // console.log(productNameState)
    // console.log(oldNameProduct)
      for(let i =0; i < result.length ; i++){
        if(result[i].productName === oldNameProduct){
          if(option === 1){
            //await custom
            
            result[i].productName = productNameState 
            result[i].productPrice = productPriceState
            result[i].productDosage= productDosageState
            result[i].quantity = productQuantityState
            result[i].ingredients = listAllIngredient
          }
          if(option === 0){
            //await normal
            result[i].productId = productIdState
            result[i].productName = productNameState
            result[i].productPrice = productPriceState
            result[i].quantity = productQuantityState
        }
      }
    }
    
    // console.log("result = ",result)
      setListAllCustomProduct(result)
  }
    setProductNameState("")
    setProductIdState("")
    setProductPriceState("")
    setProductDosageState("")
    setProductQuantityState("")
    setOption(2)
    // console.log(items)
    setListAllCustomProduct(items)
    setMedState(false)
    setShowModal(false);
    setProductSubmit(true)

    setTimeout(() => {
      setProductSubmit(false)
    }, 2000);
    setError("");
}
    catch(error){
      const errors = {};
      
        error.inner.forEach((innerError) => {
          errors[innerError.path] = innerError.message;
        });
        setError(errors);
  
        toast.error("Periksa kembali kolom pengisian!");
  
        setIsToastVisible(true);
  
        setTimeout(() => {
          setIsToastVisible(false);
        }, 2000);
      }
  };

  const onDeleteIngredient = (productId) =>{
    if (productId) {
      const selectedIngredient = listAllIngredient.filter(
        (item) => item.productId !== productId
      );
      setListAllIngredient(selectedIngredient);
  }}

  const onIngredientProductChange = (params) =>{
    // console.log(params)
    params?.forEach((item,index)=>
    index === 0 ? setIngredientId(item):setIngredientName(item))
    
    
}
  const onNormalProductChange = (params) =>{
    params?.forEach((item,index)=>{
      if(index === 0){
        setProductIdState(item)
      }
      if(index === 1){
        setProductNameState(item)
      }
      if(index === 2){
        setProductPriceState(item)
      }
    }
    )
    
}

const onUserChange = (params) =>{
  params?.forEach((item,index)=>{
    if(index === 0){
      setEmail(item)
    }
    if(index === 1){
      setName(capitalizeEachWords(item))
    }
    if(index === 2){
      setImage(item)
    }
  }
  )
  setUserState(true)
}

const submitIngredient = async () =>{
  try{
    await ingredientValidationSchema.validate({
      ingredientId : ingredientId, 
      ingredientQuantity : ingredientQuantityRef?.current?.value  
    },{
      abortEarly : false
  })

    const result = [...listAllIngredient
    ,{
      productId : +ingredientId,
      productName : ingredientName,
      quantity : ingredientQuantityRef?.current?.value
    }]
    // console.log(result)
    setListAllIngredient(result)
    ingredientQuantityRef.current.value = null
    setIngredientSubmit(true)

    setTimeout(() => {
      setIngredientSubmit(false)
    }, 2000);
    setError("");
  }
  catch(error){
    const errors = {};
    
      error.inner.forEach((innerError) => {
        errors[innerError.path] = innerError.message;
      });
      setError(errors);

      toast.error("Periksa kembali kolom pengisian!");

      setIsToastVisible(true);

      setTimeout(() => {
        setIsToastVisible(false);
      }, 2000);
    }
}

const handleSubmitOrder = () =>{
  setListAllCustomProduct([])
  setShowConfirmModal(false)
  dispatch(checkIngredient({
    email : email,
    data : listAllCustomProduct
  })).then((response)=>{
    if(response){
      setUserState(false)
    }
  })
  //hapus semua data
}

  return (
    <>
      <div className="container pt-24 pb-6 lg:ml-[calc(5rem)] lg:px-8">
        {
          !userState &&          
          <UserList
          user={dataUser}
          onUserChange={onUserChange}
          />
        }
      </div>
        {userState && 
        <div className="container lg:ml-[calc(5rem)] lg:px-8">
          <div className="pb-7 flex flex-col">
          <Button className="flex flex-row justify-start items-center font-bold text-xl
          hover:text-primary
          " 
          onClick={()=>{setUserState(!userState)
          setListAllCustomProduct([])
          }} >
            <IoIosArrowBack/>
            Kembali
          </Button>
          </div>
          <span className="font-bold text-3xl text-primary">
          Pesanan Resep Dokter untuk {name}
          </span>
        <div>
          <div className="mt-4 mb-2">
            <span className="font-semibold">
            Pratinjau Resep Dokter :
            </span>
          </div>
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
          <div className="w-full flex flex-col items-center">

        <img
          src={process.env.REACT_APP_CLOUDINARY_BASE_URL + image}
          alt={"image"}
          className="h-fit w-fit object-center duration-300"
          />
          </div>
          
      </Modal>
        </div>
        <div className="flex flex-col ">
            <span className="font-semibold">
                Daftar Produk : 
            </span>
            {listAllCustomProduct.length === 0 && 
            <span className="italic font-medium text-gray-600">
              (...silahkan tambah produk...)
            </span>
            }
            </div>
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
                  Harga per Produk : Rp{formatNumber(item.productPrice)}
                </p>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Jumlah Produk : {item.quantity}
                </p>
                <p className="mb-2 text-sm font-semibold text-primary">
                  Bahan Obat Racik :
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
                  Harga per Produk : Rp{formatNumber(item.productPrice)}
                </p>
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Jumlah Produk : {item.quantity}
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
                  className={"my-5"}
                  onClick={handleShowAllModal}
                  title={`Tambah Produk`}
                />
                {listAllCustomProduct.length !== 0 &&
                <Button
                  isButton
                  // isPrimary
                  isBLock
                  // isDisabled={listAllCustomProduct.length === 0 ? true : false }
                  className={"mb-10 bg-green-500 text-white"}
                  onClick={()=>setShowConfirmModal(true)}
                  title={`Submit Order`}
                />}
                <Modal
                showModal={showConfirmModal}
                halfWidth={true}
                closeModal={()=>handleCloseModal()}
                title={`Konfirmasi Order Pesanan Dokter untuk ${name}`}
                >
                <div>
                 
                    Apakah kamu yakin ingin submit?<br/>
                    Order dari resep dokter tidak bisa dibuat ulang.
                    Periksa kembali rincian setiap produk.
                    
                </div>
                <div className="font-bold text-sm mt-5">
                 Daftar produk :
                </div>
                <div>
                  {listAllCustomProduct.map(item=>{
                    return (<p className="text-sm"> - {item?.productName}</p>)
                  })}
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
                    onClick={handleSubmitOrder}
                    />
                </div>
              </div>
                </Modal>
                </div>
        }

      </div>
      </div>
      }
      <Modal
        showModal={showModal}
        halfWidth={true}
        closeModal={()=>handleCloseModal()}
        title={titleState ? `Ubah Produk` : `Tambah Produk`}
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
        <div className="grid gap-2 md:grid-cols-2 max-h-[50vh] overflow-y-auto">
          {/* kiri */}
          <div className="">
            <div
              className="border p-4 shadow-md"
            >
             
              <div className="flex items-center justify-between">
              <h3 className="title">Tambah Bahan Obat Racik</h3>
              </div>
              <div className={`mb-2 flex flex-col gap-1`}>
                {/* isi input, quantity */}
              <div className="">
                <div onChange={() => setError({ ...error, ingredientId: false })}>
                <IngredientList
                onIngredientProductChange={onIngredientProductChange}
                isSubmit={ingredientSubmit}
                />
                </div>
                {error.ingredientId && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.ingredientId}
                    </div>
                  )}
                <div className="">
                  <Input
                    ref={ingredientQuantityRef}
                    type="number"
                    label="Jumlah Obat Racik :"
                    placeholder="Contoh : 1"
                    errorInput={error.IngredientQuantity}
                    onChange={() => setError({ ...error, ingredientQuantity: false })}
                  />
                  {error.ingredientQuantity && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.ingredientQuantity}
                    </div>
                  )}
                </div>

              </div>

              </div>

              <div className="mt-2 flex items-center justify-between gap-2 border-t-2 pt-2">
                  {/* button add ingredient */}
                  <Button
              isButton
              isPrimary
              title={`Tambahkan ke Daftar`}
              isDisabled={isToastVisible}
              onClick={() => submitIngredient()}
              />
              </div>
            </div>
            <div className="w-full flex justify-center">
            <Button
              isSmall
              isPrimary
              className="mt-6 "
              >
              <a 
              className="flex flex-row items-center py-5 gap-3 px-3"
              href={process.env.REACT_APP_CLOUDINARY_BASE_URL + image}
              target="_blank">
                <BsImage/>
                Lihat Resep Dokter
              </a>
              </Button>
              </div>
          </div>

          {/* kanan */}
          <div className="w-full h-fit mt-8 md:mt-0 border p-2">
            <h3 className="title">Rangkuman</h3>
            <div className="border-2  p-3 shadow-sm rounded-lg">
              <div className="font-bold">
                Daftar Bahan Obat Racik
              </div>
            <div className="flex flex-col gap-3" 
            onChange={() => setError({ ...error, ingredientList: false })}>
              {
                listAllIngredient.map(item =>{
                   return(
                    <div className="flex flex-row gap-2 border-b-2 relative">
                      <div className="flex flex-row gap-3">
                        <div className="w-80 h-7 overflow-hidden">
                        {item?.productName}
                        </div>
                        <div classname="w-4">
                        x {item?.quantity} 
                        </div>
                      </div>
                      <button className="p-1 rounded-sm text-sm bg-red-700 text-white duration-200
                       hover:bg-red-600 absolute top-3 -translate-y-1/2 right-8"
                      onClick={()=>onDeleteIngredient(item?.productId)}>
                      <BsTrashFill/> 
                      </button>
                    </div>
                   )
                })
              }
              {error.ingredientList && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.ingredientList}
                    </div>
                  )}
            </div>
            </div>
              {/* input 4 datanya */}
          <div className="mt-4 flex flex-col gap-y-4">
            <div className="">
              <Input
                // ref={productNameRef}
                value={productNameState}
                onChange={(event)=>{onChangeValue(event,setProductNameState)
                  setError({ ...error, productName: false })
                }}
                type="text"
                label="Nama Produk :"
                placeholder="Contoh : Paracetamol 500 mg"
                errorInput={error.productName}
              />
              {error.productName && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productName}
                </div>
              )}
            </div>

            <div className="">
              <Input
                value={productPriceState}
                type="number"
                label="Harga Produk : (Rp.)"
                placeholder="Contoh : 35000"
                onChange={event=>{onChangeValue(event,setProductPriceState)
                  setError({ ...error, productPrice: false })}
                }
                errorInput={error.productPrice}

              />
              {error.productPrice && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productPrice}
                </div>
              )}
            </div>

            <div className="">
              <Input
                value={productDosageState}
                type="text"
                label="Dosis Produk :"
                placeholder="Contoh : 3 x 1 hari"
                onChange={event=>{onChangeValue(event,setProductDosageState)
                  setError({ ...error, productDosage: false })
                }}
                errorInput={error.productDosage}      
              />
              {error.productDosage && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productDosage}
                </div>
              )}
            </div>

            <div className="">
              <Input
                value={productQuantityState}
                type="number"
                label="Jumlah Produk : (pcs)"
                placeholder="Contoh : 3"
                onChange={event=>{onChangeValue(event,setProductQuantityState)
                  setError({ ...error, productQuantity: false })}}
                errorInput={error.productQuantity}
              />
              {error.productQuantity && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.productQuantity}
                </div>
              )}
            </div>
        

            </div>

          </div>
        </div>
}
{
  option === 0 && 
  <div className="grid gap-2 max-h-[50vh] lg:max-h-screen overflow-y-auto">
    <div className="border p-4 shadow-md">
      <div onChange={() => setError({ ...error, normalProductId: false })}>
      <NormalProductList
        // product={dataProduct}
        onNormalProductChange={onNormalProductChange}
        productId={productIdState}
        productName={normalProductState}
        productPrice={productPriceState}
        isSubmit={productSubmit}
        />
                      {error.normalProductId && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.normalProductId}
                    </div>
                  )}
        </div>
      <div className="">
              <Input
                value={productQuantityState}
                type="number"
                label="Jumlah Produk : "
                placeholder="e.g. 3"
                onChange={event=>{onChangeValue(event,setProductQuantityState)
                setError({ ...error, normalProductQuantity: false })}}
                errorInput={error.normalProductQuantity}
               
              />
              {error.normalProductQuantity && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error.normalProductQuantity}
                </div>
              )}
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
              isDisabled={isToastVisible}
              onClick={() => handleAddModal()}
              />
          </div>
        </div>
      </Modal>
    </>
  )
}
