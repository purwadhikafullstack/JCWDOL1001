import { HiOutlineTrash } from "react-icons/hi2"
import Button from "../../../components/Button"
import { motion } from "framer-motion"
import formatNumber from "../../../utils/formatNumber"
import {formatDate} from "../../../utils/formatDate"

export default function TableDiscount({
  discountList,
  handleShowModal,
  currentPage,
  limit
}) {
    const width = window.screen.width
    const mobileWidth = 414
  return (
    <table className="text-gray-500 w-full text-left text-sm">
        <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
            <tr>
                <th className={`p-3 ${width <= mobileWidth && "hidden"}`}>No.</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Kode</th>
                <th className={`p-3 ${width <= mobileWidth && "hidden"}`}>Deskripsi</th>
                <th className={`p-3 ${width <= mobileWidth && "hidden"}`}>Tanggal Berakhir</th>
                <th className={`p-3 ${width <= mobileWidth && "hidden"}`}>Jumlah</th>
                <th className={`p-3 ${width <= mobileWidth && "hidden"}`}>Beli Satu Gratis Satu</th>
                <th className={`p-3 ${width <= mobileWidth && "hidden"}`}>Minimal Transaksi</th>
                <th className="p-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            {discountList.length ===0 ? <h3>Data Tidak Ditemukan</h3>
            : discountList?.map((list, index) => (
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
                        className={`text-gray-900 whitespace-nowrap p-3 font-medium ${width <= mobileWidth && "hidden"}`}
                    >
                        {index + 1 + ((currentPage - 1) * limit)}
                    </th>
                    <td className="p-3 break-before-all max-w-xs">{list?.discountName}</td>
                    <td className="p-3 break-before-all max-w-xs">{list.discountCode ? list.discountCode.toUpperCase() :"-" }</td>
                    <td className={`p-3 break-before-all max-w-xs ${width <= mobileWidth && "hidden"}`}>{list.discountDesc}</td>
                    <td className={`p-3 ${width <= mobileWidth && "hidden"}`}>{list.discountExpired ? formatDate(list.discountExpired) : "-"}</td>
                    <td className={`p-3 ${width <= mobileWidth && "hidden"}`}>{list.isPercentage ? `${list.discountAmount}%` : list.discountAmount ===0 ? "-" : `Rp ${formatNumber(list.discountAmount)}` }</td>
                    <td className={`p-3 ${width <= mobileWidth && "hidden"}`}>{list.oneGetOne ? "Ya" : "Tidak" }</td>
                    <td className={`p-3 ${width <= mobileWidth && "hidden"}`}>{list.minimalTransaction ? `Rp. ${formatNumber(list.minimalTransaction)}` : "-"}</td>
                    <td className="p-3">
                        <div className="flex gap-3">
                            <Button
                                isSmall
                                isPrimaryOutline
                                onClick={() =>
                                    handleShowModal({context:"Detail Diskon", id:list.discountId})
                                }
                                title="Details"
                            />

                            <Button
                                isSmall
                                isDanger
                                onClick={() =>
                                    handleShowModal({
                                        context: "Hapus Diskon", 
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
