import React, { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import formatNumber from "../../utils/formatNumber";
import { useNavigate } from "react-router-dom";

export default function Card({ productId, productName, productPrice, productPicture, productStock, productDiscount, productCategories }) {
  const navigate = useNavigate();

  return (
    <div
      className="hover:scale-[102%] hover:border-primary duration-300 place-self-stretch group flex cursor-pointer flex-col gap-2 aspect-[2/1] rounded-lg border p-3 text-dark shadow-lg"
      onClick={() => navigate(`/products/${productId}`)}
    >
      <div className="aspect-square w-full overflow-hidden rounded-md"
      >
        <img
          src={process.env.REACT_APP_CLOUDINARY_BASE_URL + productPicture}
          alt={productName}
          className="h-full w-full object-cover duration-300"
        />
      </div>

      <h3 className="text-sm font-bold uppercase duration-300 hover:text-primary lg:text-base line-clamp-2" title={productName}
      >
        {productName}
      </h3>
      <h3 className="font-bold mt-auto">
        {productDiscount && productDiscount.length !== 0 && !productDiscount[0]?.discount?.oneGetOne
          ? 
            <div className="flex flex-col max-w-md">
              <span className="w-fit rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
              {productDiscount[0].discount?.isPercentage ? `${productDiscount[0].discount.discountAmount}%` : 
                  `Potongan Harga ${formatNumber(productDiscount[0]?.discount?.discountAmount)}`
                  }
              </span>

              
              <>
                <h3 className="text-sm text-slate-400 line-through">
                Rp.  {formatNumber(productPrice)}
                </h3>
                Rp. {formatNumber(productDiscount[0]?.endingPrice)}
              </>
            </div>
            
          : productDiscount[0]?.discount.oneGetOne ?
            <div className="flex flex-col max-w-md">
              <span className="w-fit rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
                Beli Satu Gratis Satu
              </span>
              Rp.  {formatNumber(productPrice)}
            </div>
          : `Rp.${formatNumber(productPrice)}`}
      </h3>

      <p className="text-xs line-clamp-1 text-slate-500">
      {productCategories && productCategories.map((category,index)=>(
        <>
          {category.categoryDesc}{index !== productCategories.length - 1 &&<span>,&nbsp;</span>}
        </>
      ))}
        </p>
      {/* <Button
        isButton
        isPrimaryOutline
        isBLock
        title="Keranjang"
        className="font-semibold"
        onClick={onClick}
      /> */}
    </div>
  );
}
