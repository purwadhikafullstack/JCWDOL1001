import { HiOutlineTrash } from "react-icons/hi2"
import Button from "../../../components/Button"
import { motion } from "framer-motion"
import formatNumber from "../../../utils/formatNumber"
import {formatDate, formatDateValue} from "../../../utils/formatDate"

export default function TableDiscount({
  discountList,
  handleShowModal,
}) {
  return (
    <table className="text-gray-500 w-full text-left text-sm">
        <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
            <tr>
                <th className="p-3">No.</th>
                <th className="p-3">Name</th>
                <th className="p-3">Code</th>
                <th className="p-3">Description</th>
                <th className="p-3">Expired Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Is One Get One</th>
                <th className="p-3">Minimum Transaction</th>
                <th className="p-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            {discountList?.map((list, index) => (
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
                        {index + 1}
                    </th>
                    <td className="p-3">{list.discountName}</td>
                    <td className="p-3">{list.discountCode}</td>
                    <td className="p-3">{list.discountDesc}</td>
                    <td className="p-3">{list.discountExpired ? formatDate(list.discountExpired) : "-"}</td>
                    <td className="p-3">{list.isPercentage ? `${list.discountAmount}%` : `IDR ${formatNumber(list.discountAmount)}` }</td>
                    <td className="p-3">{list.oneGetOne ? "Yes" : "No" }</td>
                    <td className="p-3">{list.minimalTransaction ? `IDR ${formatNumber(list.minimalTransaction)}` : "-"}</td>
                    <td className="p-3">
                        <div className="flex gap-3">
                            <Button
                                isSmall
                                isPrimaryOutline
                                onClick={() =>
                                    handleShowModal({context:"Details Discount", id:list.discountId})
                                }
                                title="Details"
                            />

                            <Button
                                isSmall
                                isDanger
                                onClick={() =>
                                    handleShowModal({
                                        context: "Delete Discount", 
                                        name: list.discountName, 
                                        id: list.discountId
                                    })
                                }
                            >
                                <HiOutlineTrash className="text-lg" />
                            </Button>
                        </div>
                    </td>
                </motion.tr>
            ))}
        </tbody>
    </table>
  )
}
