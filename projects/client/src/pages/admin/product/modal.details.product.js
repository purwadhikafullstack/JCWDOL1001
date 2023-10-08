import React from 'react'
import formatNumber from '../../../utils/formatNumber';

export default function ModalDetailsProduct({selectedProduct, categories}) {
  return (
    <div className="grid max-h-[75vh] md:grid-cols-2 overflow-auto px-2 gap-4">
      <div className="">
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
          <div className="flex flex-wrap gap-2">
            {selectedProduct.productCategories.map((category) => (
              <span className="text-sm border border-primary text-primary p-1 rounded-lg select-none">{category.categoryDesc}</span>
            ))}
          </div>
          <p className="card-price mt-2">
            IDR {formatNumber(selectedProduct.productPrice)}
          </p>
          <p className="mt-4">{selectedProduct.productDescription}</p>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-2xl font-bold">Produk Unit</h3>
        <table className="text-gray-500 w-full text-left text-sm">
          <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
            <tr>
              <th className="p-3">Nama Unit</th>
              <th className="p-3">Kuantitas</th>
            </tr>
          </thead>
          {selectedProduct.productUnits.map((unit) => (
            <tbody>
              <td className="p-3">{unit.name}</td>
              <td className="p-3">{unit.product_detail.quantity}</td>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  )
}
