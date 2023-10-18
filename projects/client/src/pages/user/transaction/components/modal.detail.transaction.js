import Countdown from "../../../../components/Countdown";
import formatNumber from "../../../../utils/formatNumber";
import { formatDate } from "../../../../utils/formatDate";

export default function ModalDetailTransaction({
  selectedTransaction,
  countdown,
}) {
  const transactionDetail = selectedTransaction?.transactionDetail;
  const shippingAddress = selectedTransaction?.user_address;

  return (
      <div className="grid gap-2 lg:gap-8 lg:grid-cols-2 max-h-[80vh] pr-1 lg:max-h-[90vh] overflow-y-auto mt-2">
        <div className="left-container">
          {countdown &&
            <div className="mb-4 p-2 border flex justify-center border-warning rounded-lg font-semibold text-xl w-1/2">
              <Countdown expired={selectedTransaction.expired}/>
            </div>
          }
          <div className="">
            <h3 className="subtitle">Data Pemesan</h3>
            <div className="">
              <p>{selectedTransaction?.user_account?.email}</p>
              <p>{selectedTransaction?.userProfile?.name} ({selectedTransaction?.userProfile?.phone})</p>
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

          <h3 className="subtitle">Bukti Pembayaran</h3>
          <div className="">
            {selectedTransaction?.paymentProof ? 
              <img className="w-full h-full" src={process.env.REACT_APP_CLOUDINARY_BASE_URL + selectedTransaction?.paymentProof} alt="" />
            :
            <p>Belum ada bukti pembayaran</p>
            }
          </div>

        </div>

        <div className="right-container w-full h-fit mt-8 md:mt-0">
          <h3 className="subtitle">Detail Pesanan</h3>
          <div
            key={selectedTransaction?.transactionId}
            className="border p-4 rounded-md h-fit shadow-md"
          >
            
            <div className="flex items-center justify-between mb-4">
            <div className="text-sm">
              <p>Tanggal Pembelian</p>
              <p className="font-semibold">
                {formatDate(selectedTransaction?.createdAt)}
              </p>
            </div>
            <div className="text-sm text-right">
              <p>Invoice</p>
              <p className="font-semibold text-primary">
                {selectedTransaction?.invoice}
              </p>
            </div>
          </div>
            <div
            className={`mb-2 flex flex-col gap-2 divide-y-2 overflow-hidden`}
          >
            {transactionDetail?.map((product, index) => (
              <div key={index} className="flex items-center gap-2 pt-2 text-sm">
                <img
                  className="w-14 border"
                  src={
                    process.env.REACT_APP_CLOUDINARY_BASE_URL +
                    product.listedTransaction.productPicture
                  }
                  alt={product.listedTransaction.productName}
                />
                <div className="w-full">
                  <div className="flex justify-between">
                    <p>{product.listedTransaction.productName}</p>
                    {product.buyOneGetOne &&
                      <p className="text-danger font-semibold">Beli 1 Gratis 1</p>
                    }
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <p>Rp. {formatNumber(product.price)}</p>
                      <span>x</span>
                      <p>{product.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      Rp. {formatNumber(product.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between">
                <p className="text-sm">Total Belanja</p>
                <p className="font-bold">
                  Rp. {formatNumber(selectedTransaction?.subtotal)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Ongkos Kirim</p>
                <p className="font-bold">
                  Rp. {formatNumber(selectedTransaction?.transport)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Discount</p>
                <p className="font-bold">
                  - ( Rp. {formatNumber(+selectedTransaction?.discount)})
                </p>
              </div>
              <div className="flex justify-between border-t border-primary pt-2">
                <p className="text-sm font-semibold">Total Pembayaran</p>
                <p className="font-bold">
                  Rp. {formatNumber(selectedTransaction?.total)}
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
  );
}
