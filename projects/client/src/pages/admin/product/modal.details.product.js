import React from 'react'
import getCategoryByName from '../../../utils/getCategoryByName';
import formatNumber from '../../../utils/formatNumber';

export default function ModalDetailsProduct({selectedProduct, categories}) {
  return (
    <div className="flex max-h-[75vh] flex-col overflow-auto px-2">
      <div className="aspect-[3/2] w-full rounded-lg shadow-md">
        <img
          src={
            process.env.REACT_APP_CLOUDINARY_BASE_URL +
            selectedProduct.productPicture
          }
          alt={selectedProduct.productName}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
      <div className="">
        <h3 className="title mt-4">{selectedProduct.productName}</h3>

        {selectedProduct.categoryId.map((categoryId) => (
          <p>{getCategoryByName(categoryId, categories)}</p>
        ))}
        <p className="card-price mt-2">
          IDR {formatNumber(selectedProduct.productPrice)}
        </p>
        <p className="mt-4">{selectedProduct.productDescription}</p>
      </div>
    </div>
  )
}
