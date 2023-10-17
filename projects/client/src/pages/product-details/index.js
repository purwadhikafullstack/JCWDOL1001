import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById, getProducts } from "../../store/slices/product/slices";
import formatNumber from "../../utils/formatNumber";
import { FaPlus, FaMinus } from "react-icons/fa";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import UploadRecipeButton from "../../components/UploadRecipeButton";
import { getCart, totalProductCart, updateCart } from "../../store/slices/cart/slices";
import LoadingProductDetail from "./loading.product.detail";
import { toast } from "react-toastify"

export default function ProductDetail({user}) {
  const dispatch = useDispatch()
  const { id } = useParams()

  const { product, products, cart, isGetProductsLoading } = useSelector((state)=>{
    return {
      product: state?.products.productDetail,
      products: state?.products.data,
      cart: state?.cart?.cart,
      isGetProductsLoading: state?.products.isGetProductsLoading,
    }
  })
  const [qty, setQty] = useState(1);
  const [stock, setStock] = useState(3);
  const [isOneGetOne,setIsOneGetOne] = useState(false)

  useEffect(()=>{

    const result = cart?.find((element) => element?.productId == id)
    if (result) {
      setStock(result?.cartList?.product_details[0]?.quantity)
      if(result?.quantity > 0 && result?.quantity <= stock){
        setQty(result?.quantity)
      }
      dispatch(totalProductCart())
    }
    
  },[cart])

  const handleQty = (type) => {
    if (type === "add") {
      if(isOneGetOne && (qty+1)*2 > stock ) throw(
        toast.error("Kuantitas melebihi stok")
      )
      setQty(qty + 1);
    }

    if (type === "reduce" && qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleQtyInput = (event) => {
    const newQty = event.target.value;
    if(isOneGetOne && (newQty)*2 > stock ) throw(
      toast.error("Kuantitas melebihi stok")
    )
    if (newQty === "" || (+newQty > 0 && +newQty <= stock)) {
      setQty(newQty === "" ? "" : +newQty);
    } else if (+newQty > 0 && +newQty >= stock) {
      setQty(+stock);
    }
  };

  const handleBlur = (event) => {
    const newQty = event.target.value;

    if (!newQty) {
      setQty(1);
    }
  };
  
  const [showModal, setShowModal] = useState({ show:false, context:"" })

  const handleCart = (productId) => {
    if (user.role) {
      try{
        dispatch(updateCart({productId: productId , quantity : String(qty)}))
        toast.success(`Produk berhasil ditambahkan ke keranjang!`);
        return
      }
      catch(err){
        toast.error("Gagal menambahkan produk ke keranjang!")
        return
      }
    }

    if (!user.role) {
      setShowModal({ show:true, context:"login" })
    }
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
  }
  
  useEffect(()=>{
    dispatch(getProductById(id)).then((response) => {
      setIsOneGetOne(response.payload.data.discountProducts[0]?.discount?.oneGetOne)
      setStock(response.payload.data.productUnits.length > 0 ? 
        response.payload.data.productUnits[0].product_detail.quantity : 0)
    }
    )

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
    setQty(1)

  },[id])

  if (isGetProductsLoading) {
    return <LoadingProductDetail />
  }

  return (
    <>
      <div className="container py-24">
        <div className="grid grid-cols-1 lg:mt-8 lg:grid-cols-5 lg:gap-8">
          <div className="col-span-2 aspect-[5/4] w-full">
            <img
              src={process.env.REACT_APP_CLOUDINARY_BASE_URL + product?.productPicture}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>

          <div className="col-span-2 flex w-full flex-col gap-2">
            <h3 className="title">{product?.productName}</h3>
              {product?.discountProducts && product?.discountProducts.length !== 0 && !product?.discountProducts[0]?.discount?.oneGetOne
          ? 
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-fit rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
                  {product?.discountProducts[0]?.discount?.isPercentage ? `${product?.discountProducts[0]?.discount?.discountAmount}%` : 
                  `Potongan Harga ${formatNumber(product?.discountProducts[0]?.discount.discountAmount)}`
                  }
                </span>
              
                <h3 className="text-sm text-slate-400 line-through">
                Rp.  {formatNumber(product?.productPrice)}
                </h3>
              </div>
              
            </div>
            
          : product?.discountProducts[0]?.discount?.oneGetOne && 

            <div className="flex flex-col max-w-md">
              <span className="w-fit rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
                Buy One Get One
              </span>
            </div>
          }

            <h3 className="text-xl lg:text-2xl font-bold text-primary">
              Rp. {formatNumber(product?.discountProducts[0]?.endingPrice > 0 ? product?.discountProducts[0]?.endingPrice : product?.productPrice)}
            </h3>
            <div className="mt-4 w-4/5">
              <h3 className="subtitle">Aturan Pakai</h3>
              <p>{product?.productDosage}</p>
            </div>
            <div className="mt-4 w-4/5">
              <h3 className="subtitle">Deskripsi</h3>
              <p>{product?.productDescription}</p>
            </div>
          </div>

          <div className="col-span-1 mt-4 flex h-fit w-full flex-col gap-4 rounded-lg border p-4 shadow-lg lg:mt-0">
            <h3 className="subtitle">Mau beli berapa?</h3>
            <div className="flex justify-center gap-2">
              <Button
                isSmall
                isSecondary
                isDisabled={qty === 1}
                title={<FaMinus className="text-white" />}
                onClick={() => handleQty("reduce")}
              />
              <Input
                type="number"
                className="text-center"
                value={qty}
                isDisabled={stock === 0}
                onChange={handleQtyInput}
                onBlur={handleBlur}
              />
              <Button
                isSmall
                isPrimary
                isDisabled={!product?.productUnits[0]?.product_detail.quantity || qty === product?.productUnits[0]?.product_detail.quantity}
                title={<FaPlus className="text-white" />}
                onClick={() => handleQty("add")}
              />
            </div>

            <div className="flex items-center justify-between">
              {stock ? 
              <h3 className="text-sm text-gray-600 ">
                Produk Tersedia: <span className="font-bold text-primary">{stock}</span>
              </h3>
              :
              <h3 className="text-sm text-danger ">
                Produk Tidak Tersedia
              </h3>
              }

            </div>
            
            <div className="flex lg:flex-col justify-between">
              <h3 className="">Subtotal</h3>
              <h3 className="text-lg font-bold text-primary">
                 Rp. {formatNumber((product?.discountProducts[0]?.endingPrice > 0 ? product?.discountProducts[0]?.endingPrice : product?.productPrice) * qty )}
              </h3>
            </div>

            <Button isBLock isButton isPrimary isDisabled={!product?.productUnits[0]?.product_detail.quantity} title="Masukkan Keranjang" onClick={()=>handleCart(product.productId)}/>
          </div>
        </div>

        <div className="mt-8 border-t-2 pt-8">
          <div className="flex items-center justify-between">
            <h3 className="title text-2xl">Produk Lainnya</h3>
            <Button
              isLink
              path="/products"
              title="Lihat Semua"
              className="text-primary font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {products
              .map((product) => (
                <Card
                  key={product.productId}
                  productId={product.productId}
                  productName={product.productName}
                  productPrice={product.productPrice}
                  productDiscount={product.discountProducts}
                  productPicture={product.productPicture}
                  productStock={product.productStock}
                  productCategories={product.productCategories}
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

      <UploadRecipeButton user={user} />
    </>
  );
} 
