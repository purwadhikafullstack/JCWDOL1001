import React, { useEffect, useRef, useState } from "react";
import formatNumber from "../../../utils/formatNumber";
import Button from "../../../components/Button";
import { AnimatePresence, motion } from "framer-motion";
import { BsCart2, BsDashLg, BsPlusLg,BsTrashFill } from "react-icons/bs";
import Input from "../../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getCart, totalProductCart, updateCart,deleteCart } from "../../../store/slices/cart/slices";
import { getProducts } from "../../../store/slices/product/slices";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {cart,products} = useSelector(state=>{
    return{
      cart : state?.cart?.cart,
      products : state?.products.data,
    }
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let status = []
  const selectedProduct = cart.map((item,index) => {
    status.push(false)
    return item.productId
  });

  const cartItems = products.filter((product) =>
    selectedProduct.includes(product.productId)
  );

  const [selectedItems, setSelectedItems] = useState([]);
  const [allSelected, setAllSelected] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(status);

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

  const handleQty = (type,qty,productId) => {
    if (type === "add") {
      // console.log(qty + 1);
      dispatch(updateCart({productId : productId, quantity : String(qty + 1)}))

    }

    if (type === "reduce" && qty > 1) {
      // console.log(qty - 1);
      dispatch(updateCart({productId : productId, quantity : String(qty - 1)}))
    }
  };

  const handleQtyInput = (event,productId,productStock) => {
    event.preventDefault()
    const newQty = event?.target?.value;
    if (newQty === "" || (+newQty > 0 && +newQty <= productStock )) {
      if(+newQty !== 0){
        dispatch(updateCart({productId : productId, quantity : String(+newQty)}))
      }
      else{
        dispatch(updateCart({productId : productId, quantity : String(1)}))
      }
    }
    if((+newQty > productStock)){
      dispatch(updateCart({productId : productId, quantity : String(productStock)}))
    }
  };

  const handleDeleteStock = (productId) => {
        dispatch(deleteCart({productId : productId}))
  };

  const handleBlur = (event) => {
    const newQty = event.target.value;

    if (newQty === "") {
      console.log(1)
      setQty(1);
    }
  };

  useEffect(() => {
  dispatch(getCart())
  dispatch(totalProductCart())
  dispatch(
    getProducts({
      page: 1,
      id_cat: "",
      product_name: "",
      sort_price: "",
      sort_name: "",
      limit: 12,
    })
  )
  },[])

  useEffect(() => {
    dispatch(getCart())
    dispatch(totalProductCart())
    },[cart])

  const checkOut = () => {
    navigate("/checkout")
  }
  return (
    <div className="container relative py-24">
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
                  src={item?.productPicture}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex w-full flex-col lg:flex-row">
                <div className="">
                  <h3 className="text-teal-600">{item?.productName}</h3>
                  <div className="items-center gap-2">
                    {item.discount > 0 && (
                      <div className="mt-auto flex items-center gap-2">
                        <span className="rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
                          {item?.discount}%
                        </span>
                        <h3 className="text-sm text-slate-400 line-through">
                          Rp. {formatNumber(item?.productPrice)}
                        </h3>
                      </div>
                    )}
                    <h3 className="font-bold">
                      Rp.{" "}
                      {formatNumber((
                        // (100 - item?.discount) *
                        1 * item?.productPrice)
                        //  / 100
                         )}
                    </h3>
                  </div>
                </div>

                <div className="h-full w-1/2 lg:ml-auto lg:w-1/4 flex flex-row">
                  <div className="flex h-full justify-center gap-2">
                    <Button
                      isSmall
                      isSecondary
                      title={<BsDashLg className="text-white" />}
                      onClick={() => handleQty("reduce",cart.find((cartItem) => cartItem?.productId === item?.productId)
                      ?.quantity, item?.productId)}
                    />
                    <Input
                      type="numberSecondVariant"
                      className="h-full text-center w-full"
                      value={
                        cart.find((cartItem) => cartItem?.productId === item?.productId)
                          ?.quantity
                      }
                      onChange={event =>{handleQtyInput(event,item?.productId,
                        cart.find((cartItem) => cartItem?.productId === item?.productId)
                        ?.cartList?.product_details[0]?.quantity)}}
                      onBlur={handleBlur}
                    />
                    <Button
                      isSmall
                      isPrimary
                      title={<BsPlusLg className="text-white" />}
                      onClick={() => handleQty("add", cart.find((cartItem) => cartItem?.productId === item?.productId)
                      ?.quantity,  item?.productId)}
                    />

              </div>
                </div>
              </div>

              <div className="h-full flex flex-row items-start
              lg:items-center justify-center ">
                <button className="lg:mb-3 p-2 rounded-md text-gray-700
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
          ))}
        </div>
        <div className="fixed bottom-20 left-0 col-span-1 h-fit w-full rounded-lg border bg-slate-50 p-4 shadow-lg lg:static">
          <h3 className="title ">Ringkasan Belanja</h3>

          <div className="hidden lg:block">
            {selectedItems.map((item) => {
              const cartItem = cart.find(
                (cartItem) => cartItem?.productId === item?.productId
              );
              const price = (
                // (100 - item?.discount) * 
              item?.productPrice) 
              // / 100;
              const totalItemPrice = cartItem?.quantity * price;

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
            <p className="text-lg">Total</p>
            <p>
              Rp.{" "}
              {formatNumber(
                selectedItems
                  ?.map((item) => {
                    const cartItem = cart.find(
                      (cartItem) => cartItem?.productId === item?.productId
                    );
                    const discountPrice =
                      (
                        // (100 - item?.discount) *
                         item?.productPrice) 
                      // / 100;
                    return cartItem?.quantity * discountPrice;
                  })
                  .reduce((total, price) => total + price, 0)
              )}
            </p>
          </div>

          <div className="mt-4">
            <Button
              isBLock
              isButton
              isPrimary
              title="Check Out"
              isDisabled={selectedItems?.length === 0}
              onClick={checkOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
