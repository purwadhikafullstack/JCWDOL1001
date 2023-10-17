import React from "react";
import formatNumber from "../../utils/formatNumber";

export default function Item({productPrice, quantity, productPicture, productName}){
    return(
        <div className="w-full flex flex-row items-center py-4">
                <img 
                    src={process.env.REACT_APP_CLOUDINARY_BASE_URL+productPicture}
                    alt={productName}
                    className=" w-32 h-32 container object-contain"/>
            <div className="justify-start flex-col flex-1">
                <h3 className="text-sm font-bold duration-300 text-primary lg:text-base line-clamp-2" title={productName}>
                    {productName}
                </h3>
                <h3 className="font-bold mt-auto">
                    Rp.{" "}{formatNumber(productPrice)} x {quantity}
                </h3>
            </div>
            <div className="">
                <h1 className="font-bold mt-auto">
                    Rp.{" "}{formatNumber(productPrice * quantity)}
                </h1>
            </div>
        </div>
    );
}