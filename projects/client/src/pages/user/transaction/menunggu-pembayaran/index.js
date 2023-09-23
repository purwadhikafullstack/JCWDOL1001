import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionList, resetSuccessTransaction } from "../../../../store/slices/transaction/slices";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import PageDetailTransaction from "./page.detail.transaction";
import { HiArrowLongLeft } from "react-icons/hi2";
import ModalUnggahBuktiPembayaran from "./modal.unggah.bukti.pembayaran";
import ModalBatalkanPesanan from "./modal.batalkan.pesanan";

export default function MenungguPembayaran({
  statusId,
  statusDesc,
  setShowStatusButton,
  showHandlePageContext,
  setShowHandlePageContext,
  setActiveTab
}) {
  const dispatch = useDispatch();
  const { transaction, success, isUpdateOngoingTransactionLoading, isGetTransactionLoading } = useSelector((state) => {
    return {
      transaction: state.transaction?.transactions,
      success: state.transaction?.success,
      isGetTransactionLoading: state.transaction?.isGetTransactionLoading,
      isUpdateOngoingTransactionLoading: state.transaction?.isUpdateOngoingTransactionLoading,
    };
  });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState({show: false, context: null});


  const handleTransactionPageAction = (action, transactionId) => {
    setShowHandlePageContext({ show: true, action });
    setShowStatusButton(false);

    window.scrollTo({
      top: 0,
    });

    if (transactionId) {
      const transactionData = transaction.find(
        (item) => item.transactionId === transactionId
      );
      setSelectedTransaction(transactionData);
    }
  };

  const handleCloseTransactionPageAction = () => {
    setShowHandlePageContext({ show: false, action: "" });
    setShowStatusButton(true);
  };

  const handleShowModal = (context) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowModal({show: true, context});
  };

  const handleCloseModal = () => {
    setShowModal({show: false, context:null});
  };

  useEffect(() => {
    dispatch(getTransactionList({ statusId }));
  }, [isUpdateOngoingTransactionLoading]);

  useEffect(() => {
    if (success) {
      setShowStatusButton(true);
      setShowHandlePageContext({ show: false, action: "" });
      setActiveTab(2);

      dispatch(resetSuccessTransaction())
    }
  }, [success]);

  return (
    <>
      {!showHandlePageContext.show && (
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
                    handleTransactionPageAction(
                      "Detail Transaksi",
                      item.transactionId
                    )
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

                  <Button isButton isPrimaryOutline title="Lihat Detail" onClick={handleShowModal} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showHandlePageContext.show && (
        <>
          <Button
            isLink
            className={`text-primary`}
            title={
              <div className="flex items-center gap-2">
                <HiArrowLongLeft className="text-lg" />
                <span className="underline">Kembali ke Daftar Transaksi</span>
              </div>
            }
            onClick={handleCloseTransactionPageAction}
          />
          
            <PageDetailTransaction
              selectedTransaction={selectedTransaction}
              handleShowModal={handleShowModal}
            />

        </>
      )}

      <Modal
        fullWidth
        showModal={showModal.show}
        closeModal={handleCloseModal}
        title={showModal.context}
      >
        {showModal.context === "Unggah Bukti Pembayaran" && 
          <ModalUnggahBuktiPembayaran 
            selectedTransaction={selectedTransaction} 
            handleCloseModal={handleCloseModal} 
            isUpdateOngoingTransactionLoading={isUpdateOngoingTransactionLoading}
          />
        }

        {showModal.context === "Batalkan Pesanan" && 
          <ModalBatalkanPesanan 
            selectedTransaction={selectedTransaction} 
            handleCloseModal={handleCloseModal} 
            isUpdateOngoingTransactionLoading={isUpdateOngoingTransactionLoading}
          />
        }
      </Modal>
    </>
  );
}
