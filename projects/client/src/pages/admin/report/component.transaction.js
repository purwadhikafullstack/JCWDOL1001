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
    showModal
}) 
{
    return (
        <>
            <div class="my-10 mr-20 w-full shadow-md sm:rounded-lg">
                <table class="w-full max-text-sm text-center text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3 ">Invoice</th>
                            <th scope="col" className="px-6 py-3 ">Tanggal</th>
                            <th scope="col" className="px-6 py-3 ">Pengguna</th>
                            <th scope="col" className="px-6 py-3 ">Potongan</th>
                            <th scope="col" className="px-6 py-3 ">Total</th>
                            <th scope="col" className="px-6 py-3 ">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionList.length ===0 ? <h3>Data Tidak Ditemukan</h3>
                            : transactionList.map((list)=>{
                                return (
                                    <tr className="items-center text-center">
                                        <th className="p-3 ">{list.invoice}</th>
                                        <td className="p-3 ">{formatDate(list.updatedAt)}</td>
                                        <td className="p-3 ">{list.userProfile.name}</td>
                                        <td className="p-3">
                                            { 
                                                list.discount_transaction ? 
                                                list.discount_transaction.discount.isPercentage ?  `${list.discount_transaction.discount.discountAmount}%`
                                                : list.discount_transaction.discount.oneGetOne ?   "Beli satu gratis satu"
                                                : `Rp ${formatNumber(list.discount_transaction.discount.discountAmount)}` 
                                                :"-"  
                                            }
                                            </td>
                                        <td className="p-3 ">IDR {formatNumber(list.subtotal)}</td>
                                        <Button isButton isPrimary title="Lihat Detail" 
                                            onClick={()=>{
                                                setSelectedTransaction(list)
                                                handleShowModal({context : "Detail Transaksi" })
                                            }}
                                        />
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
                        <a className="text-lg underline underline-offset-4">Detail Produk</a>
                        <table class="w-full max-text-sm text-left text-gray-500 mb-5">
                            <thead class="text-sm text-center text-gray-700 uppercase bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="p-3 text-left">Nama Produk</th>
                                    <th scope="col" className="p-3 ">Kuantitas</th>
                                    <th scope="col" className="p-3 ">@</th>
                                    <th scope="col" className="p-3 text-right">Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedTransaction.transactionDetail.length ===0 ? <a>Data Tidak Ditemukan</a>
                                    : selectedTransaction.transactionDetail.map((detail)=>{
                                        return (
                                            <tr  className="items-center text-left">
                                                <td className="p-3 ">{detail.listedTransaction.productName}</td>
                                                <td className="p-3 text-center ">{detail.quantity}</td>
                                                <td className="p-3 text-right">{formatNumber(detail.price)}</td>
                                                <td className="p-3 text-right">IDR {formatNumber(detail.totalPrice)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <a className="text-lg underline underline-offset-4">Detail Diskon</a>
                        <table class="w-full max-text-sm text-left text-gray-500">
                            <thead class="text-sm  text-gray-700 uppercase bg-gray-50 ">
                                <tr>
                                    <th className="p-3">Nama Diskon</th>
                                    <th className="p-3">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!selectedTransaction.discount_transaction ? <a>Data Tidak Ditemukan</a>
                                    : 
                                        <tr  className="items-center text-left">
                                            <td className="p-3">{selectedTransaction.discount_transaction.discount.discountName}</td>
                                            <td className="p-3">{selectedTransaction.discount_transaction.discount.isPercentage ? `${selectedTransaction.discount_transaction.discount.discountAmount}%` : `Rp ${formatNumber(selectedTransaction.discount_transaction.discount.discountAmount)}` }</td>
                                        </tr>
                                    
                                }
                            </tbody>
                        </table>
                    </>
                )}
            </Modal>
        </>
    )
}