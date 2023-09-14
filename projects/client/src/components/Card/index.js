import React, { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import formatNumber from "../../utils/formatNumber";
import { useNavigate } from "react-router-dom";

export default function Card({ productId, productName, productPrice, productPicture, productStock, productDiscount, productCategories }) {
  const navigate = useNavigate();

  return (
    <div
      className="hover:scale-[102%] duration-300 place-self-stretch group flex cursor-pointer flex-col gap-2 aspect-[2/1] rounded-lg border p-3 text-dark shadow-lg"
      onClick={() => navigate(`/products/${productId}`)}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-primary"
      >
        <img
          src={process.env.REACT_APP_CLOUDINARY_BASE_URL + productPicture}
          alt={productName}
          className="h-full w-full object-cover duration-300 group-hover:scale-110"
        />
      </div>

      <h3 className="text-sm font-bold uppercase duration-300 hover:text-primary lg:text-base line-clamp-2" title={productName}
      >
        {productName}
      </h3>
      {/* {productDiscount ? (
        <div className="mt-auto flex items-center gap-2">
          <span className="rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
            {productDiscount}%
          </span>
          <h3 className="text-sm text-slate-400 line-through">
            Rp. {formatNumber(productPrice)}
          </h3>
        </div>
      ) : (
        <div className="mt-auto" />
      )} */}
      <h3 className="font-bold mt-auto">
        Rp.{" "}
        {productDiscount
          ? formatNumber(productDiscount * productPrice)
          : formatNumber(productPrice)}
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
