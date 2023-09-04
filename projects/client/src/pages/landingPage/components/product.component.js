import React from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../../components/Button"

export default function Produk({ products }) {

  const { uuid, status,   } = useSelector(state => {
		return {
			uuid : state?.auth?.uuid,
			status : state?.auth?.status,
		}
	})

  const handleCart = ({id,name}) => {
    !uuid ? alert("You must login first")
    : status === 0 ? alert("Your account is unverified, please verify first")
    : alert(`Produk ${name} berhasil ditambahkan ke keranjang!`) // dan akan sekalian add to cart produk yg diinginkan
  };

  
  return (
    <>
      {products.map((products) => (
        <div className="flex flex-col cursor-pointer gap-2 rounded-lg border p-3 text-dark shadow-lg">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-primary">
            <img
              src={products.productPicture}
              className="h-full w-full object-cover duration-300 group-hover:scale-110"
            />
          </div>

          <h3 className="text-sm font-bold uppercase duration-300 group-hover:text-primary lg:text-base">
            {products.productName}
          </h3>
          <h3 className="font-bold">
              Rp.{products.productPrice}
          </h3>
          <Button
            isButton
            isPrimaryOutline
            isBLock
            title="Keranjang"
            className="font-semibold"
            onClick={()=>{
              handleCart({
                id:products.productId,
                name:products.productName
              })}
            }
          />
        </div>
      ))}
    </>
  );
}