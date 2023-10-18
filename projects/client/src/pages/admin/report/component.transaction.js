import Button from "../../../components/Button"
import Modal from "../../../components/Modal"
import Pagination from "../../../components/PaginationV2"
import { formatDate } from "../../../utils/formatDate"
import formatNumber from "../../../utils/formatNumber"

export default function TransactionList({
    transactionList,
    currentPage,
    totalPage,
    setPage,
    handleShowModal,
    handleCloseModal,
    setSelectedTransaction,
    selectedTransaction,
    showModal,
    width,
    mobileWidth
}) 
{
    return (
        <>
            <div class="my-10 mr-20 w-full shadow-md sm:rounded-lg">
                <table class="w-full max-text-sm text-center text-gray-500 " >
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" className={`px-6 py-3 ${width <= mobileWidth && "hidden"}`}>Invoice</th>
                            <th scope="col" className="px-6 py-3 ">Tanggal</th>
                            <th scope="col" className="px-6 py-3 ">Pengguna</th>
                            <th scope="col" className={`px-6 py-3 ${width <= mobileWidth && "hidden"}`}>Potongan</th>
                            <th scope="col" className={`px-6 py-3`}>Total</th>
                            <th scope="col" className="px-6 py-3 ">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionList.length ===0 ? <h3>Data Tidak Ditemukan</h3>
                            : transactionList.map((list)=>{
                                return (
                                    <tr className="items-center text-center justify-center">
                                        <th className={`p-3 ${width <= mobileWidth && "hidden"}`}>{list.invoice}</th>
                                        <td className={`p-3 ${width <= mobileWidth && "text-sm"}`}>{formatDate(list.updatedAt)}</td>
                                        <td className={`p-3 ${width <= mobileWidth && "text-sm"}`}>{list.userProfile.name}</td>
                                        <td className={`p-3 ${width <= mobileWidth && "hidden"}`}>
                                            { 
                                                list.discount_transaction ? 
                                                list.discount_transaction.discount.isPercentage ?  `${list.discount_transaction.discount.discountAmount}%`
                                                : list.discount_transaction.discount.oneGetOne ?   "Beli satu gratis satu"
                                                : `Rp ${formatNumber(list.discount_transaction.discount.discountAmount)}` 
                                                :"-"  
                                            }
                                            </td>
                                        <td className={`p-3 ${width <= mobileWidth && "text-sm"}`}>Rp. {formatNumber(list.subtotal)}</td>
                                        <td >
                                            <Button isSmall={width <= mobileWidth} isButton={width > mobileWidth} isPrimaryOutline title={`${width <= mobileWidth ? "Detail" : "Lihat Detail"}`}
                                                onClick={()=>{
                                                    setSelectedTransaction(list)
                                                    handleShowModal({context : "Detail Transaksi" })
                                                }}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="w-full">
                <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
            </div>
            <Modal
                showModal={showModal.show}
                closeModal={handleCloseModal}
                title={showModal.context}
            >
                {showModal.context === "Detail Transaksi" && (
                    <>
                        <div className="rounded-md border p-4 shadow-md my-3"> Detail Produk
                            {selectedTransaction.transactionDetail.length ===0 ? <a>Data Tidak Ditemukan</a>
                                : selectedTransaction.transactionDetail.map((detail,index)=>{
                                    return (
                                        <div className={`mb-2 flex flex-col gap-2 divide-y-2 p-0.5 overflow-hidden`} >
                                            <div key={index} className="flex items-center gap-2 pt-2 text-sm">
                                                <div className="w-full">
                                                <p>{detail.listedTransaction.productName}</p>
                                                <div className="flex justify-between">
                                                    <div className="flex gap-2">
                                                    <p>Rp. {formatNumber(detail.price)}</p>
                                                    <span>x</span>
                                                    <p>{detail.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold">
                                                    Rp. {formatNumber(detail.totalPrice)}
                                                    </p>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="pt-5">Diskon</div>
                            {!selectedTransaction.discount_transaction ? <p className="p-1.5 text-sm">Tidak Menggunakan Diskon</p>
                                : 
                                    <div className={`mb-2 flex flex-col gap-2 divide-y-2 p-0.5 overflow-hidden`} >
                                        <div className="flex  justify-between items-center gap-2 pt-2 text-sm ">
                                                <p className="break-before-all max-w-xs">{selectedTransaction.discount_transaction.discount.discountName}</p>
                                                <p className="font-semibold">
                                                {   
                                                    selectedTransaction.discount_transaction.discount.oneGetOne ?
                                                    "" :
                                                    selectedTransaction.discount_transaction.discount.isPercentage ? 
                                                    `${selectedTransaction.discount_transaction.discount.discountAmount}%` : 
                                                    `Rp. ${formatNumber(selectedTransaction.discount_transaction.discount.discountAmount)}` 
                                                }
                                                </p>
                                        </div>
                                    </div>
                            }
                        </div>
                    </>
                )}
            </Modal>
        </>
    )
}