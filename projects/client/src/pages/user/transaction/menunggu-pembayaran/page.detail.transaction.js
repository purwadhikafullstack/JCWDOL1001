import { HiArrowLongLeft } from "react-icons/hi2";
import Button from "../../../../components/Button";
import formatNumber from "../../../../utils/formatNumber";
import { formatDate } from "../../../../utils/formatDate";

export default function PageDetailTransaction({
  selectedTransaction,
  handleShowModal,
}) {
  const transactionDetail = selectedTransaction.transactionDetail;
  return (
    <>
      <h3 className="title mt-4">Detail Transaksi - Menunggu Pembayaran {selectedTransaction.createdAt}</h3>
      <div
        key={selectedTransaction.transactionId}
        className="mb-4 cursor-pointer rounded-lg border p-4 shadow-md duration-300 hover:border-primary"
      >
        <div className="flex justify-between items-center">
          <p className="mb-4 text-sm">
            {formatDate(selectedTransaction.createdAt)}
          </p>
          <p className="mb-4 text-sm text-primary font-semibold">
            {selectedTransaction.createdAt}
          </p>
        </div>
        <div className={`mb-2 flex flex-col gap-1 overflow-hidden`}>
          {transactionDetail.map((product, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <img
                className="w-14 border"
                src={
                  process.env.REACT_APP_CLOUDINARY_BASE_URL +
                  product.listedTransaction.productPicture
                }
                alt={product.listedTransaction.productName}
              />
              <div className="">
                <p>{product.listedTransaction.productName}</p>
                <div className="flex gap-2">
                  <p>{formatNumber(product.price)}</p>
                  <span>x</span>
                  <p>{product.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2 border-t-2 pt-2">
          <div className="">
            <p className="text-sm">Total Belanja</p>
            <p className="font-bold">
              {formatNumber(selectedTransaction.total)}
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button isButton isDangerOutline title={`Batalkan Pesanan`} onClick={() => handleShowModal("Batalkan Pesanan")}/>
            <Button isButton isPrimary title={`Unggah Bukti Pembayaran`} onClick={() => handleShowModal("Unggah Bukti Pembayaran")}/>
          </div>
        </div>
      </div>
    </>
  );
}
