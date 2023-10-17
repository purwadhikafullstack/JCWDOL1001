import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import formatNumber from "../../../utils/formatNumber";
import Button from "../../../components/Button";
import { AnimatePresence, motion } from "framer-motion";
import { BsCart2, BsDashLg, BsPlusLg,BsTrashFill } from "react-icons/bs";
import Input from "../../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getCart, totalProductCart, updateCart,deleteCart,inCheckOut } from "../../../store/slices/cart/slices";
import { getProducts } from "../../../store/slices/product/slices";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { toast } from "react-toastify";
import AssetCart from "../../../assets/asset-cart.png";

export default function Cart({ user }) {
  const {cart,products,isUpdateLoading,statusUser} = useSelector(state=>{

    return{
      cart : state?.cart?.cart,
      products : state?.products.data,
      isUpdateLoading : state?.cart?.isUpdateLoading,
      statusUser : state?.auth?.status
    }
  })
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let status = []
  let quantityList = []
  const selectedProduct = cart?.map((item,index) => {
    status.push(false)
    quantityList.push({productId : item?.productId, quantity : item?.quantity})
    return item.cartList?.productName
  });
  
  const [selectedQuantity, setSelectedQuantity] = useState(quantityList)
  
  
  const cartItems = products.filter((product,index) =>{
    return selectedProduct.includes(product.productName)
  }
  );
  
  const [selectedItems, setSelectedItems] = useState([]);

  const [allSelected, setAllSelected] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [trigger, setTrigger] = useState(true);

  const toggleSelectItem = (itemId, index) => {
    if(selectedStatus[index]){
      const selectedItem = cartItems.find((item) => item.productId === itemId);
      setSelectedItems([...selectedItems, selectedItem]);
    }
    else{
      setSelectedItems(selectedItems.filter((item) => item.productId !== itemId));
    }
  };

  const [qty, setQty] = useState(1);

  const handleAllSelector = (allStatus) => {
    const status = []
    for(let i = 0; i < cartItems.length; i++){
      status.push(allSelected)
    }
    setSelectedStatus(status)
    if(allStatus){
      setSelectedItems(cartItems);
    }
    else{
      setSelectedItems([]);
    }
  }

  const handleQty = (type,qty,productId,isOneGetOne,productStock) => {
    if (type === "add") {
      // console.log(qty + 1);
      if(isOneGetOne && (qty+1)*2 > productStock ) throw(
        toast.error("Kuantitas melebihi stok")
      )
      dispatch(updateCart({productId : productId, quantity : String(qty + 1)}))
      changeQty((+qty+1),productId)
      setTrigger(!trigger)
    }

    if (type === "reduce" && qty > 1) {
      // console.log(qty - 1);
      dispatch(updateCart({productId : productId, quantity : String(qty - 1)}))
      changeQty((+qty-1),productId)
      setTrigger(!trigger)
    }
  };

  function changeQty(value,productId){
    setSelectedQuantity(selectedQuantity.map(item=>{
      if(item?.productId === productId){
        return {productId : item?.productId ,quantity : String(value)}
      }
      else
      {return {productId : item?.productId ,quantity : item?.quantity}}
    }))
  }

  const handleQtyInput = (event,productId,productStock,isOneGetOne) => {
    event.preventDefault()
    const newQty = event?.target?.value;
    if (!newQty) {
      changeQty(1,productId)
    }
    if(isOneGetOne && newQty*2 > productStock ) throw(
      toast.error("Kuantitas melebihi stok")
    )
    if (newQty === "" || (+newQty > 0 && +newQty <= productStock )) {
      if(+newQty !== 0){

        changeQty(+newQty,productId)
      }
      else{

        changeQty(1,productId)
      }
    }
    if((+newQty > productStock)){

      changeQty(productStock,productId)

    }
  };

  const handleBlur = (event,productId,productStock,isOneGetOne) => {
    event.preventDefault()
    let newQty = event?.target?.value;
    if (!newQty) {
      dispatch(updateCart({productId : productId, quantity : String(1)}))
    }
    if(isOneGetOne && newQty*2 > productStock ) throw(
      toast.error("Kuantitas melebihi stok")
    )
    if (newQty === "" || (+newQty > 0 && +newQty <= productStock )) {
      if(+newQty !== 0){

        dispatch(updateCart({productId : productId, quantity : String(+newQty)}))
        setTrigger(!trigger)
      }
      else{
        // newQty = 1
        dispatch(updateCart({productId : productId, quantity : String(1)}))
        setTrigger(!trigger)
      }
    }
    if((+newQty > productStock)){

      dispatch(updateCart({productId : productId, quantity : String(productStock)}))
      setTrigger(!trigger)
    }
  };

  const handleDeleteStock = (productId) => {
        dispatch(deleteCart({productId : productId}))
        setSelectedItems(selectedItems.filter(
          (cartItem) => cartItem?.productId !== productId
        ))
        // selectedItems = a
        console.log(selectedItems)
        setTrigger(!trigger)
  };

  useEffect(() => {
    const quantityList = []
    dispatch(getCart())
    .then(response=>response?.payload?.data.map((item) => {
      quantityList.push({productId : item?.productId, quantity : item?.quantity})
    })).finally(()=>setSelectedQuantity(quantityList))
    dispatch(totalProductCart())
    dispatch(
      getProducts({
        page: 1,
        id_cat: "",
        product_name: "",
        sort_price: "",
        sort_name: "",
        limit: 1000,
      })
    )

    if(!statusUser){

      navigate("/")

    }
  },[])

  useEffect(()=>{
    console.log("select",selectedQuantity)
  },[selectedQuantity])

  
  const [error, setError] = useState("")
  const [isToastVisible, setIsToastVisible] = useState(false)
  
  const checkOut = () => {
      dispatch(inCheckOut({data : selectedItems})).then(()=>navigate("/checkout","replace")).catch((error)=>{
        const errors = {}
        
        error.inner.forEach((innerError) => {
          errors[innerError.path] = innerError.message;
        })
      
        setError(errors)
      
        toast.error("Check your input field!")

        setIsToastVisible(true)

        setTimeout(() => {
          setIsToastVisible(false)
        }, 2000)
      })
  }
  return (
    <div className="container relative py-24">
      {
        (cartItems.length === 0 && statusUser) && 
                  <div className="flex flex-col items-center ">
        <div className="w-80">
                  <img src={AssetCart} alt="" />
                </div>
        <h3 className="title mt-9">Keranjang kamu kosong</h3>
        <p className="mb-2">Kamu yakin udah pesen?</p>
        </div>
      }
      { (cartItems.length !== 0  && statusUser)&&
      <>
      <h3 className="title">Keranjang</h3>
      <div className=" mt-3 gap-3 flex flex-row items-center">
        <input
          className="h-5 w-5"
          type="checkbox"
          checked={!allSelected}
          onChange={()=>{
            setAllSelected(!allSelected);
            handleAllSelector(allSelected)
          }}
        />
        <span className="">
          Pilih Semua
        </span>
      </div>
      <div className="grid grid-cols-1 gap-20 pb-32 lg:grid-cols-3 lg:pb-0">
        <div className="col-span-2 flex flex-col">
          {cartItems.map((item,index) => (
            <div className="flex items-center gap-4 border-b-2 py-8">
               <input
                className="h-5 w-5"
                type="checkbox"
                checked={selectedStatus[index]}
                onChange={() =>{
                  status = selectedStatus
                  status[index] = !status[index]
                  setSelectedStatus(status)
                  toggleSelectItem(item.productId,index)
                }}
              />

              <div className="aspect-square h-20">
                <img
                  src={process.env.REACT_APP_CLOUDINARY_BASE_URL + item?.productPicture}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex w-full flex-col lg:flex-row">
                <div className="">
                  <h3 className="text-teal-600">{item?.productName}</h3>
                  <div className="items-center gap-2">
                    {item.discountProducts?.length !== 0 && item.discountProducts[0]?.discount?.oneGetOne === false ?
                    <div>
                      <div className="mt-auto flex items-center gap-2">
                        <span className="rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
                         {item?.discountProducts[0]?.discount?.isPercentage ?
                         <div>{item?.discountProducts[0]?.discount?.discountAmount}% </div> :
                         <div>Rp. {formatNumber(item?.discountProducts[0]?.discount?.discountAmount)} off</div>       
                        }
                        </span>
                        <h3 className="text-sm text-slate-400 line-through">
                          Rp. {formatNumber(item?.productPrice)}
                        </h3>
                      </div>

                      <h3 className="font-bold">
                      Rp.{" "}
                      {formatNumber((
                        // (100 - item?.discount) *
                        item?.discountProducts[0]?.endingPrice)
                        //  / 100
                         )}
                      </h3>
                    </div>
                    : item.discountProducts?.length !== 0 && item.discountProducts[0]?.discount?.oneGetOne === true ?
                    <div>
                      <div className="mt-auto flex items-center gap-2">
                        <span className="w-fit rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
                          Beli Satu Gratis Satu
                        </span>
                      </div>

                      <h3 className="font-bold">
                        Rp.{" "}
                        {formatNumber((
                          // (100 - item?.discount) *
                          1 * item?.productPrice)
                          //  / 100
                          )}
                      </h3>
                    </div>
                    :
                    <h3 className="font-bold">
                      Rp.{" "}
                      {formatNumber((
                        // (100 - item?.discount) *
                        1 * item?.productPrice)
                        //  / 100
                         )}
                    </h3>
}
                    
                </div>
                </div>
          
                <div className="h-full w-full lg:ml-auto lg:w-2/5 flex flex-col lg:border-l-2 lg:pl-14">
                <h3 className="text-gray-600 text-sm">Stock : {cart.find((cartItem) => cartItem?.productId === item?.productId)
                        ?.cartList?.product_details[0]?.quantity}
                  </h3>
                  <div className="flex flex-row h-full justify-center gap-2">
                    <Button
                      isSmall
                      isSecondary
                      title={ isUpdateLoading ? <LoadingSpinner isSuperSmall/> : <BsDashLg className="text-white mx-[1px]" />}
                      onClick={() => handleQty("reduce",cart.find((cartItem) => cartItem?.productId === item?.productId)
                      ?.quantity, item?.productId)}
                      isDisabled={isUpdateLoading}
                    />
                    <Input
                      type="numberSecondVariant"
                      className="h-full text-center w-full"
                      value={
                        selectedQuantity.find((cartItem) => cartItem?.productId === item?.productId)
                          ?.quantity
                      }
                      onChange={event =>{handleQtyInput(event,item?.productId,
                        cart.find((cartItem) => cartItem?.productId === item?.productId)
                        ?.cartList?.product_details[0]?.quantity, item?.discountProducts[0]?.discount?.oneGetOne)} } 

                      onBlur={event =>{
                        handleBlur(event,item?.productId,
                        cart.find((cartItem) => cartItem?.productId === item?.productId)
                        ?.cartList?.product_details[0]?.quantity, item?.discountProducts[0]?.discount?.oneGetOne)
                        }
                        }
                      isDisabled={isUpdateLoading}
                    
                    />
                    <Button
                      isSmall
                      isPrimary
                      title={isUpdateLoading ? <LoadingSpinner isSuperSmall/> : <BsPlusLg className="text-white mx-[1px]" />}
                      onClick={() => handleQty("add", cart.find((cartItem) => cartItem?.productId === item?.productId)
                      ?.quantity,  item?.productId,item?.discountProducts[0]?.discount?.oneGetOne,cart.find((cartItem) => cartItem?.productId === item?.productId)
                        ?.cartList?.product_details[0]?.quantity)}
                      isDisabled={isUpdateLoading}
                    />
                <div className="h-full flex flex-row items-start
                justify-center">
                <button className=" p-[10px] rounded-md text-gray-700
                  duration-200
                hover:bg-red-600 hover:text-white text-lg"
                onClick={()=>{
                  handleDeleteStock(item?.productId)
                }}
                >
                    <BsTrashFill/>
                </button>
              </div>
              </div>

                </div>
              </div>


            </div>
          ))}
        </div>
        <div className="fixed bottom-20 left-0 col-span-1 h-fit w-full rounded-lg border bg-slate-50 p-4 shadow-lg lg:static">
          <h3 className="title ">Ringkasan Belanja</h3>

          <div className="hidden lg:block">
            {selectedItems.map((item) => {
              const cartItem = cart.find(
                (cartItem) => cartItem?.productId === item?.productId
              );
              const price = ( item?.discountProducts[0]?.endingPrice ?
                item?.discountProducts[0]?.endingPrice :
                item?.productPrice) 
              // / 100;
              const totalItemPrice = cartItem?.quantity * price;
                // if(totalItemPrice === NaN){
                
                // }
              return (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{
                    opacity: 0,
                  }}
                  className="mt-4 border-b-2"
                >
                  <p className="font-semibold text-teal-600">{item.productName}</p>
                  <div className="flex justify-between">
                    <p className="text-gray-500">
                      {cartItem?.quantity} x  Rp. {formatNumber(price)}
                    </p>

                    <p className="text-gray-500">
                      Rp. {formatNumber(totalItemPrice)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between font-bold">
            <p className="subtitle">Total Belanja</p>
            <p className="subtitle">
              Rp.{" "}
              {formatNumber(
                selectedItems
                  ?.map((item) => {
                    const cartItem = cart.find(
                      (cartItem) => cartItem?.productId === item?.productId
                    );
                    const discountPrice =
                      ( item?.discountProducts[0]?.endingPrice ?
                        item?.discountProducts[0]?.endingPrice :
                        item?.productPrice) 
                      // / 100;
                    return cartItem?.quantity * discountPrice;
                  })
                  .reduce((total, price) => total + price, 0))}
            </p>
          </div>

          <div className="mt-4">
            <Button
              isBLock
              isButton
              isPrimary={user?.status !== 0}
              isSecondary={user?.status === 0}
              title="Check Out"
              isDisabled={selectedItems?.length === 0 || isToastVisible || user?.status === 0}
              onClick={checkOut}
            />
            {user?.status === 0 &&
              <p className="text-xs text-danger text-center mt-1">Silahkan lakukan <span className="underline cursor-pointer" onClick={() => navigate("/user/profile")}>verifikasi</span></p>
            }
          </div>
        </div>
      </div>
      </>
}
    </div>
  );
}
