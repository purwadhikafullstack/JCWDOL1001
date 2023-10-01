import Button from "../../../../components/Button";
import formatNumber from "../../../../utils/formatNumber";
import { formatDate } from "../../../../utils/formatDate";

export default function ModalDetailTransaction({
  selectedTransaction,
  handleShowModal,
  handleCloseModal
}) {
  const transactionDetail = selectedTransaction?.transactionDetail;
  const shippingAddress = selectedTransaction?.user_address;
  return (
    <>
      <div
        key={selectedTransaction.transactionId}
        className="mb-4 rounded-lg border p-4 shadow-md duration-300"
      >
        <div className="flex justify-between items-center">
          <p className="mb-4 text-sm">
            {formatDate(selectedTransaction.createdAt)}
          </p>
          <p className="mb-4 text-sm text-primary font-semibold">
            {selectedTransaction.createdAt}
          </p>
        </div>

        <div className="">
          <h3 className="subtitle">Alamat Pengiriman</h3>
          <div className="">
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.district}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postalCode}</p>
            <p>{shippingAddress.contactPhone} ({shippingAddress.contactName})</p>
            <p></p>
          </div>
        </div>

        <h3 className="subtitle mt-4">Detail Pesanan</h3>
        <div className={`my-2 flex flex-col gap-1 overflow-auto max-h-[40vh]`}>
          {transactionDetail?.map((product, index) => (
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

          <div className="grid grid-cols-2 gap-2">
            <Button isButton isPrimary title={`Kembali`} onClick={handleCloseModal}/>
            <Button isButton isDangerOutline title={`Batalkan Pesanan`} onClick={() => handleShowModal("Batalkan Pesanan", selectedTransaction.transactionId)}/>
          </div>
        </div>
      </div>
    </>
  );
}
