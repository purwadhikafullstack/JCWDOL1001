import { HiArrowLongLeft } from "react-icons/hi2";
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
  const customerData = selectedTransaction?.user_account;

  return (
    <>
    <div className="max-h-[65vh] overflow-auto pb-4 grid md:grid-cols-2">
      <div className="">
        <div className="">
          <h3 className="subtitle">Data Pemesan</h3>
          <div className="">
            <p>{customerData.email}</p>
            <p>{customerData.userProfile?.name} ({customerData.userProfile?.phone})</p>
          </div>
        </div>

        <div className="my-4">
          <h3 className="subtitle">Alamat Pengiriman</h3>
          <div className="">
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.district}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postalCode}</p>
            <p>{shippingAddress.contactPhone} ({shippingAddress.contactName})</p>
          </div>
        </div>
      </div>

      <div className="">
        <h3 className="subtitle">Detail Pesanan</h3>
        <div
          key={selectedTransaction?.transactionId}
          className="border p-4 rounded-md h-fit shadow-md"
        >
          
          <div className="flex items-center justify-between">
            <p className="mb-4 text-sm">
              {formatDate(selectedTransaction?.createdAt)}
            </p>
            <p className="mb-4 text-sm font-semibold text-primary">
              {selectedTransaction?.createdAt}
            </p>
          </div>
          <div className={`mb-2 flex flex-col gap-1 overflow-hidden`}>
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

          <div className="flex items-center justify-between gap-2 border-t-2 pt-2">
            <div className="">
              <p className="text-sm">Total Belanja</p>
              <p className="font-bold">
                {formatNumber(selectedTransaction?.total)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="mt-4 flex gap-2">
        <Button
          isButton
          isPrimary
          isBLock
          title={`Kembali`}
          onClick={handleCloseModal}
        />

        <Button
          isButton
          isDangerOutline
          isBLock
          title={`Batalkan Transaksi`}
          onClick={() => handleShowModal("Batalkan Pesanan", selectedTransaction.transactionId)}
        />
      </div>
    </>
  );
}