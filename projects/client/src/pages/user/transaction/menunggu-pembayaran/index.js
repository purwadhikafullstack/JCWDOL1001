import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionList,
  resetSuccessTransaction,
} from "../../../../store/slices/transaction/slices";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import { HiArrowLongLeft } from "react-icons/hi2";
import ModalCaraBayar from "./modal.cara.bayar";
import ModalBatalkanPesanan from "./modal.batalkan.pesanan";
import ModalDetailTransaction from "./modal.detail.transaction";
import EmptyTransaction from "../component.empty.transaction";
import SkeletonTransaction from "../component.skeleton";

export default function MenungguPembayaran({
  statusId,
  statusDesc,
  setActiveTab,
}) {
  const dispatch = useDispatch();
  const {
    transaction,
    successUpdateOngoingTransaction,
    isUpdateOngoingTransactionLoading,
    isGetTransactionLoading,
  } = useSelector((state) => {
    return {
      transaction: state.transaction?.transactions,
      successUpdateOngoingTransaction: state.transaction?.successUpdateOngoingTransaction,
      isGetTransactionLoading: state.transaction?.isGetTransactionLoading,
      isUpdateOngoingTransactionLoading:
        state.transaction?.isUpdateOngoingTransactionLoading,
    };
  });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, context: null });

  const handleShowModal = (context, transactionId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowModal({ show: true, context });
    setSelectedTransaction(transactionId);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (transactionId) {
      const transactionData = transaction.find(
        (item) => item.transactionId === transactionId
      );
      setSelectedTransaction(transactionData);
    }
  };

  const handleCloseModal = (tab) => {
    setShowModal({ show: false, context: null });
    dispatch(resetSuccessTransaction())

    if (tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(getTransactionList({ statusId }));
  }, [isUpdateOngoingTransactionLoading]);

  if (isGetTransactionLoading && !showModal.show) {
    return Array.from({length: 3}, (_, index) => (
      <SkeletonTransaction key={index}/>
    ))
  }

  return transaction.length === 0 ? (
    <EmptyTransaction />
  ) : (
    <>
      <div className="flex flex-col gap-4 pb-24 pt-3 lg:pb-0">
        {transaction.map((item) => {
          const transactionDetail = item.transactionDetail;
          const moreItems = transactionDetail.length - 1;

          return (
            <div
              key={item.transactionId}
              className="cursor-pointer rounded-lg border p-4 shadow-md duration-300 hover:border-primary"
            >
              <div
                className=""
                onClick={() =>
                  handleShowModal("Detail Transaksi", item.transactionId)
                }
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
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 border-t-2 pt-2">
                <div className="">
                  <p className="text-sm">Total Belanja</p>
                  <p className="font-bold">{formatNumber(item.total)}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    isButton
                    isPrimary
                    title="Cara Bayar"
                    onClick={() =>
                      handleShowModal("Pembayaran", item.transactionId)
                    }
                  />

                  <Button
                    isButton
                    isPrimaryOutline
                    title="Lihat Detail Transaksi"
                    onClick={() =>
                      handleShowModal(
                        "Detail Transaksi",
                        item.transactionId
                      )
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        fullWidth
        showModal={showModal.show}
        closeModal={handleCloseModal}
        title={showModal.context}
        showCloseButton={false}
      >
        {showModal.context === "Pembayaran" && (
          <ModalCaraBayar
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            isUpdateOngoingTransactionLoading={
              isUpdateOngoingTransactionLoading
            }
          />
        )}

        {showModal.context === "Batalkan Pesanan" && (
          <ModalBatalkanPesanan
            selectedTransaction={selectedTransaction}
            isUpdateOngoingTransactionLoading={
              isUpdateOngoingTransactionLoading
            }
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        )}

        {showModal.context === "Detail Transaksi" && (
          <ModalDetailTransaction
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            handleShowModal={handleShowModal}
          />
        )}
      </Modal>
    </>
  );
}
