import React from "react";
import formatNumber from "../../utils/formatNumber";

export default function Item({productPrice, quantity, productPicture, productName}){
    return(
        <div className="w-full bg-slate-200 flex flex-row items-center p-4">
            <div className="col-span-1 items-center flex">
                <img 
                    src={process.env.REACT_APP_CLOUDINARY_BASE_URL+productPicture}
                    alt={productName}
                    className=" w-32 h-32 container object-contain"/>
            </div>
            <div className="justify-start flex-col flex-1">
                <h3 className="text-sm font-bold uppercase duration-300 hover:text-primary lg:text-base line-clamp-2" title={productName}>
                    {productName}
                </h3>
                <h3 className="font-bold mt-auto">
                    Rp.{" "}{productPrice}
                </h3>
                <h2 className="font-bold mt-auto">
                    Quantity. {quantity} Items
                </h2>
            </div>
            <div className="">
                <h1 className="font-bold mt-auto">
                    Rp.{" "}{formatNumber(productPrice*quantity)}
                </h1>
            </div>
        </div>
    );
}