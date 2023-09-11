import {
  HiOutlineCircleStack,
  HiOutlinePencilSquare,
  HiOutlineRectangleStack,
  HiOutlineSquare3Stack3D,
  HiOutlineTrash,
} from "react-icons/hi2";
import Button from "../../../components/Button";
import { motion } from "framer-motion";
import formatNumber from "../../../utils/formatNumber";
import { FaEllipsisVertical } from "react-icons/fa6";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function TableProducts({
  handleShowModal,
  products,
  isGetProductsLoading,
}) {
  return (
    <table className="text-gray-500 w-full text-left text-sm">
      <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
        <tr>
          <th className="p-3">#</th>
          <th className="p-3">Product Name</th>
          <th className="p-3">Price</th>
          <th className="p-3">Quantity</th>
          <th className="p-3">Unit</th>
          <th className="p-3">Image</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {isGetProductsLoading ? (
          <tr className="text-center">
            <td colSpan={7} className="p-3">
              <LoadingSpinner isLarge />
            </td>
          </tr>
        ) : products.length === 0 ? (
          <tr className="text-center">
            <td colSpan={7} className="p-3">
              No data to display
            </td>
          </tr>
        ) : (
          products?.map((product, index) => (
            <motion.tr
              initial={{
                opacity: 0,
              }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: index * 0.05 }}
              key={index}
              className="odd:bg-slate-200/70 even:bg-slate-100"
            >
              <th
                scope="row"
                className="text-gray-900 whitespace-nowrap p-3 font-medium"
              >
                {/* {index + 1 + (current_page - 1) * 10} */}
                {index + 1}
              </th>
              <td className="p-3">{product.productName}</td>
              <td className="p-3">IDR {formatNumber(product.productPrice)}</td>
              <td className="p-3">{product?.productUnits[0]?.product_detail.quantity}</td>
              <td className="p-3">{product?.productUnits[0]?.name}</td>
              <td className="p-3">
                <div className="aspect-[4/3] w-10">
                  <img
                    src={
                      process.env.REACT_APP_CLOUDINARY_BASE_URL +
                      product.productPicture
                    }
                    alt={`${product.productName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </td>

              <td className="p-3">
                <div className="flex gap-3">
                  <Button
                    isSmall
                    isPrimaryOutline
                    onClick={() =>
                      handleShowModal("Details Product", product?.productId)
                    }

                    title="Details"
                  />

                  <Button
                  isSmall
                  isDanger
                    onClick={() =>
                      handleShowModal("Delete Product", product.productId)
                    }

                  >
                      <HiOutlineTrash className="text-lg" />
                  </Button>

                  <div className="group relative -ml-1 pr-2 mt-1">
                    <Button
                      title={
                        <FaEllipsisVertical className="text-2xl text-primary" />
                      }
                    />

                    <div className="absolute right-full top-0 z-10 hidden h-fit w-40 rounded-lg bg-slate-50 p-2 shadow-md group-hover:block lg:left-full">
                      <Button
                        isBLock
                        className="px-2 hover:bg-slate-200"
                        onClick={() =>
                          handleShowModal("Edit Details", product.productId)
                        }
                      >
                        <span className="flex items-center gap-2 py-2">
                          <HiOutlinePencilSquare className="text-lg text-blue-500" />
                          Edit Details
                        </span>
                      </Button>

                      <Button
                        isBLock
                        className="px-2 hover:bg-slate-200"
                        onClick={() =>
                          handleShowModal("Edit Stock", product.productId)
                        }
                      >
                        <span className="flex items-center gap-2 py-2">
                          <HiOutlineSquare3Stack3D className="text-lg text-primary" />
                          Edit Stock
                        </span>
                      </Button>

                      <Button
                        isBLock
                        className="px-2 hover:bg-slate-200"
                        onClick={() =>
                          handleShowModal("Edit Unit", product.productId)
                        }
                      >
                        <span className="flex items-center gap-2 py-2">
                          <HiOutlineCircleStack className="text-lg text-purple-500 " />
                          Edit Unit
                        </span>
                      </Button>
                      
                    </div>
                  </div>
                </div>
              </td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  );
}
