import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById, getProducts } from "../../../store/slices/product/slices";
import formatNumber from "../../../utils/formatNumber";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Footer from "../../../components/Footer";
import Card from "../../../components/Card";
import Modal from "../../../components/Modal";
import UploadRecipeButton from "../../../components/UploadRecipeButton";
import { getCart, totalProductCart, updateCart } from "../../../store/slices/cart/slices";

export default function ProductDetail({user}) {
  const dispatch = useDispatch()
  const { id } = useParams()

  const { product, products,cart } = useSelector((state)=>{
    return {
      product: state?.products.productDetail,
      products: state?.products.data,
      cart: state?.cart?.cart
    }
  })
  const [qty, setQty] = useState(1);
  const [stock, setStock] = useState(1);

  useEffect(()=>{
    const result = cart?.filter((element) => element?.productId == id)
    setStock(result[0]?.cartList?.product_details[0]?.quantity)
    if(result[0]?.quantity > 0 && result[0]?.quantity <= stock){
      setQty(result[0]?.quantity)
    }
    dispatch(totalProductCart())
  },[cart])

  const handleQty = (type) => {
    if (type === "add") {
      setQty(qty + 1);
    }

    if (type === "reduce" && qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleQtyInput = (event) => {
    event.preventDefault()
    const newQty = event.target.value;

    if (newQty === "" || +newQty > 0 && +newQty <= stock) {
      setQty(newQty === "" ? "" : +newQty);
    }
    if(+newQty === "" || +newQty === 0) {
      setQty(1);
    }
  };

  const handleBlur = (event) => {
    const newQty = event.target.value;

    if (+newQty === "") {
      setQty(1);
    }
  };
  
  const [showModal, setShowModal] = useState({show:false, context:""})

  const handleCart = (productId) => {
    if (user.role) {
      try{
        dispatch(updateCart({productId: productId , quantity : String(qty)}))
        alert(`Produk ${productId} berhasil ditambahkan ke keranjang!`);
        return
      }
      catch(err){
        alert("error dalam cart update!")
        return
      }
      //harus diubah ke toastify
    }

    if (!user.role) {
      setShowModal({show:true, context:"login"})
    }
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
  }
  
  useEffect(()=>{
    dispatch(getProductById(id))
    dispatch(
      getProducts({
        page: 1,
        id_cat: "",
        product_name: "",
        sort_price: "",
        sort_name: "",
      })
    );
    dispatch(getCart())
  },[id])


  return (
    <>
      <div className="container py-24">
        {/* <div className="flex gap-2 text-dark">
          <Button
            isLink
            path="/products"
            title="Produk"
            className="font-semibold text-primary"
          />
          <span className="select-none">/</span>
          <span className="select-none">{product?.productName}</span>
        </div> */}

        <div className="grid grid-cols-1 lg:mt-8 lg:grid-cols-5 lg:gap-8">
          <div className="col-span-2 aspect-[5/4] w-full">
            <img
              src={product?.productPicture}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>

          <div className="col-span-2 flex w-full flex-col gap-4">
            <h3 className="title">{product?.productName}</h3>
            {product?.discount ? (
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
                  {product?.discount}%
                </span>
                <h3 className="text-sm text-slate-400 line-through">
                  Rp. {formatNumber(product?.productPrice)}
                </h3>
              </div>
            ) : (
              <div className="" />
            )}
            <h3 className="text-2xl font-bold text-primary">
              Rp.{" "}
              {product?.discount
              //bisa letakin product.endingPrice disini
                ? formatNumber(product?.discount * product?.productPrice)
                : formatNumber(product?.productPrice)}
            </h3>

            <div className="hidden lg:block">
              <h3 className="title">Detail</h3>
              <p>{product?.productDescription}</p>
            </div>
          </div>

          <div className="col-span-1 mt-4 flex h-fit w-full flex-col gap-4 rounded-lg border p-4 shadow-lg lg:mt-0">
            <h3 className="title">Mau beli berapa?</h3>
            <div className="flex justify-center gap-2">
              <Button
                isSmall
                isSecondary
                title={<BsDashLg className="text-white" />}
                onClick={() => handleQty("reduce")}
              />
              <Input
                type="numberSecondVariant"
                className="text-center"
                value={qty}
                onChange={handleQtyInput}
                onBlur={handleBlur}
              />
              <Button
                isSmall
                isPrimary
                title={<BsPlusLg className="text-white" />}
                onClick={() => handleQty("add")}
              />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="">Subtotal</h3>
              <h3 className="text-lg font-bold text-primary">
                Rp.{" "}
                {product?.discount
                  ? formatNumber(
                    //bisa letakin ending price disini
                      product?.discount * product?.productPrice * qty)
                  : formatNumber(product?.productPrice * qty)}
              </h3>
            </div>

            <Button isBLock isButton isPrimary title="Masukkan Keranjang" onClick={()=>handleCart(product.productId)}/>
          </div>
        </div>

        <div className="mt-8 lg:hidden">
          <h3 className="title">Detail</h3>
          <p>{product?.productDescription}</p>
        </div>

        <div className="mt-8 border-t-2 pt-8">
          <div className="flex items-center justify-between">
            <h3 className="title text-2xl">Produk Lainnya</h3>
            <Button
              isLink
              path="/products"
              title="Lihat Semua"
              className="see-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products
              .map((product) => (
                <Card
                  key={product?.productId}
                  productId={product?.productId}
                  productName={product?.productName}
                  productPrice={product?.productPrice}
                  productDiscount={product?.discount}
                  productPicture={product?.productPicture}
                  productStock={product?.stock}
                />
              ))
              .slice(0, 6)}
          </div>
        </div>
      </div>
      <Footer/>

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        context={showModal.context}
        title={`Login`}
      />

      <UploadRecipeButton />
    </>
  );
} 
