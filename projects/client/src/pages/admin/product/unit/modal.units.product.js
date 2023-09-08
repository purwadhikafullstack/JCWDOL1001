import React from 'react'
import Button from '../../../../components/Button'
import { HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2'

export default function ModalUnitProduct({
  selectedProduct, 
  unitList, 
  handleShowModal,
  handleCloseModal
}) {
  const isCanAddNew = selectedProduct.productUnits.length >= 2
  
  return (
    <div className="pt-4">
      <h3 className="title mt-4">Product Units</h3>
      <Button
        isSmall
        isPrimaryOutline
        isDisabled ={isCanAddNew}
        title="Add New Unit"
        onClick={() => handleShowModal({
          context:"Add New Unit",
          productId : selectedProduct.productId,
          unitId : ""
        })}
        className="my-2"
      />
      <table className="text-gray-500 w-full text-left text-sm">
        <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
          <tr>
            <th className="p-3">No.</th>
            <th className="p-3">Unit Name</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        {selectedProduct.productUnits.map(( unit, index ) => (
          <tbody>
            <th
              scope="row"
              className="text-gray-900 whitespace-nowrap p-3 font-medium"
            >
              {index + 1}
            </th>
            <td className="p-3">{unit.name}</td>
            <td className="p-3">{unit.product_detail.quantity}</td>
            <div className="flex gap-3">
              <Button
                className="px-2 hover:bg-slate-200"
                onClick={() => handleShowModal({
                  context:"Edit Unit Details", 
                  productId : selectedProduct.productId,
                  unitId : unit.unitId
                }) }
              >
                <span className="flex items-center gap-2 py-2">
                  <HiOutlinePencilSquare className="text-lg text-blue-500" />
                </span>
                
              </Button>

              <Button
                isSmall
                isDanger
                onClick={()=>
                  handleShowModal({
                    context : "Delete Unit",
                    productId : selectedProduct.productId,
                    unitId : unit.unitId
                  })
                }
              >
                  <HiOutlineTrash className="text-lg" />
              </Button>
            
            </div>
            
          </tbody>
        ))}
      </table>
    </div>
  )
}
