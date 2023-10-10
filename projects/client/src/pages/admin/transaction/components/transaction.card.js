import { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import Pagination from "../../../../components/PaginationV2";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";

export default function TransactionCard({
  transaction,
  handleShowModal,
  currentPage,
  totalPage,
  setPage,
  setActiveTab,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-24 pt-3 lg:pb-0">
      {transaction.map((item) => {
        const transactionDetail = item.transactionDetail;
        const moreItems = transactionDetail.length - 1;
        const expiredTime = new Date(item.expired).getTime();

        return (
          <div
            key={item.transactionId}
            className="cursor-pointer rounded-lg border p-4 shadow-md duration-300 hover:border-primary"
            onClick={() =>
              handleShowModal("Detail Transaksi", item.transactionId)
            }
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm">
                <p>Diperbarui Pada</p>
                <p className="font-semibold">
                  {formatDate(item.updatedAt)}
                </p>
              </div>

              <div className="text-sm text-right">
                <p>Invoice</p>
                <p className="font-semibold text-primary">
                  {item.invoice}
                </p>
              </div>
            </div>
            <div className={`mb-2 flex flex-col gap-1 overflow-hidden`}>
              {transactionDetail
                .map((product, index) => (
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
                ))
                .slice(0, 1)}
            </div>

            {transactionDetail.length > 1 && (
              <Button
                isButton
                isBLock
                className={`text-primary font-semibold border border-primary/20`}
                title={`+${moreItems} Barang Lagi`}
              />
            )}

            <div className="mt-2 flex items-center justify-between gap-2  pt-3">
              {item.statusId === 7 ? (
                <div className="">
                  <p className="text-sm">
                    Dibatalkan oleh{" "}
                    <span className="font-semibold">{item.canceledBy}</span>
                  </p>
                  <p className="text-sm">
                    Alasan pembatalan:{" "}
                    <span className="font-semibold">{item.message}</span>
                  </p>
                </div>
              ) : (
                <div className="">
                  <p className="text-sm">Total Pembayaran</p>
                  <p className="font-bold">{formatNumber(item.total)}</p>
                </div>
              )}

              {item.statusId === 1 ? (
                currentTime < expiredTime ? (
                  <Button
                    isButton
                    isPrimary
                    title="Lihat Detail Transaksi"
                    onClick={() =>
                      handleShowModal(
                        "Lihat Detail Transaksi",
                        item.transactionId
                      )
                    }
                  />
                ) : (
                  <div className="flex flex-col">
                    <Button
                      isButton
                      isDanger
                      isDisabled
                      title="Transaksi Dibatalkan"
                    />
                    {currentTime > expiredTime && (
                      <span className="mt-1 text-xs text-danger">
                        Cek pada menu{" "}
                        <span
                          className="cursor-pointer underline"
                          onClick={() => setActiveTab(7)}
                        >
                          Pesanan Dibatalkan
                        </span>
                      </span>
                    )}
                  </div>
                )
              ) : (
                <Button
                  isButton
                  isPrimary
                  title="Lihat Detail Transaksi"
                  onClick={() =>
                    handleShowModal(
                      "Lihat Detail Transaksi",
                      item.transactionId
                    )
                  }
                />
              )}
            </div>
          </div>
        );
      })}
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          setPage={setPage}
        />
      )}
    </div>
  );
}
