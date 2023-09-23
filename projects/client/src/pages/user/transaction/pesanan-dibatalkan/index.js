import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionList } from "../../../../store/slices/transaction/slices";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";

export default function PesananDibatalkan({ statusId, statusDesc }) {
  const dispatch = useDispatch();
  const { transaction, isGetTransactionLoading } = useSelector((state) => {
    return {
      transaction: state.transaction?.transactions,
      isGetTransactionLoading: state.transaction?.isGetTransactionLoading,
    };
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const selectedTransactionDetail = selectedTransaction?.transactionDetail;

  const handleShowModal = (transactionId) => {
    setShowModal(true);

    if (transactionId) {
      const transactionData = transaction.find(
        (item) => item.transactionId === transactionId
      );
      setSelectedTransaction(transactionData);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    dispatch(getTransactionList({ statusId }));
    console.log(selectedTransaction);
  }, [selectedTransaction]);

  return (
    <>
      <div className="flex flex-col gap-4 pb-24 pt-3 lg:pb-0">
        {transaction.map((item) => {
          const transactionDetail = item.transactionDetail;
          const moreItems = transactionDetail.length - 1;

          return (
            <div
              key={item.transactionId}
              className="cursor-pointer rounded-lg border p-4 shadow-md duration-300 hover:border-primary"
              onClick={() => handleShowModal(item.transactionId)}
            >
              <div className="flex items-center justify-between">
                <p className="mb-4 text-sm">{formatDate(item.createdAt)}</p>
                <p className="mb-4 text-sm font-semibold text-primary">
                  {item.createdAt}
                </p>
              </div>
              <div className={`mb-2 flex flex-col gap-1 overflow-hidden`}>
                {transactionDetail
                  .map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
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
                  isPrimaryOutline
                  isBLock
                  title={`+${moreItems} Barang Lagi`}
                />
              )}

              <div className="mt-2 flex items-center justify-between gap-2 border-t-2 pt-2">
                <div className="">
                  <p className="text-sm">Total Belanja</p>
                  <p className="font-bold">{formatNumber(item.total)}</p>
                </div>

                <p className="text-sm text-primary font-semibold">{statusDesc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        showModal={showModal}
        fullWidth={true}
        closeModal={()=>handleCloseModal()}
        title={`Detail Transaksi - Pesanan Dibatalkan ${selectedTransaction?.createdAt}`}
      >
        <div className="grid gap-2 lg:gap-8 lg:grid-cols-2 max-h-[50vh] p-2 lg:max-h-[65vh] overflow-y-auto">
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
              {selectedTransactionDetail?.map((product, index) => (
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

          <div className="w-full h-fit mt-8 md:mt-0">
            <h3 className="title">Bukti Pembayaran</h3>
            <img className="w-full h-full" src={process.env.REACT_APP_CLOUDINARY_BASE_URL + selectedTransaction?.paymentProof} alt="" />
          </div>

        </div>
        <div className="mt-4 flex gap-2">
          <Button
            isButton
            isPrimaryOutline
            isBLock
            title={`Kembali`}
            onClick={() => handleCloseModal()}
          />

          <Button
            isButton
            isDangerOutline
            isBLock
            title={`Batalkan Pesanan`}
            onClick={() => handleCloseModal()}
          />
        </div>
      </Modal>
    </>
  );
}
