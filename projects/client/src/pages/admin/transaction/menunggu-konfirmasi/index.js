import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetSuccessTransaction } from "../../../../store/slices/transaction/slices";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import ModalBatalkanPesanan from "./modal.batalkan.pesanan";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import ModalKonfirmasi from "./modal.konfirmasi";
import ModalTolakPembayaran from "./modal.tolak.pembayaran";
import TransactionCard from "../components/transaction.card";

export default function MenungguKonfirmasi({
  transaction,
  currentPage,
  totalPage,
  setPage,
  setActiveTab,
  isGetTransactionLoading,
  isUpdateOngoingTransactionLoading,
}) {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState({show: false, context: null});
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleShowModal = (context, transactionId) => {
    setShowModal({show: true, context});
    setSelectedTransaction(transactionId)

    if (transactionId) {
      const transactionData = transaction.find(
        (item) => item.transactionId === transactionId
      );
      setSelectedTransaction(transactionData);
    }
  };

  const handleCloseModal = (tab) => {
    if (tab) {
      setActiveTab(tab);
    }
    
    setShowModal({show: false, context:null});
    
    dispatch(resetSuccessTransaction())
  };

  if (isGetTransactionLoading && !showModal.show) {
    return Array.from({length: 3}, (_, index) => (
      <SkeletonTransaction key={index}/>
    ))
  }

  return (
    <>
      {transaction.length === 0 ?
        <EmptyTransaction />  
      :
        <TransactionCard
          transaction={transaction}
          handleShowModal={handleShowModal}
          totalPage={totalPage}
          currentPage={currentPage}
          setPage={setPage}
        />
      }

      <Modal
        showModal={showModal.show}
        halfWidth={showModal?.context === "Detail Transaksi"}
        closeModal={handleCloseModal}
        title={showModal.context === "Detail Transaksi" ? "Menunggu Konfirmasi" : showModal.context}
      >
        {showModal.context === "Detail Transaksi" && 
        <>
          <ModalDetailTransaction
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            handleShowModal={handleShowModal}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
            <Button
              isButton
              isDangerOutline
              title={`Batalkan Pesanan`}
              className={`lg:col-start-3 md:row-start-1`}
              onClick={() => handleShowModal("Batalkan Pesanan", selectedTransaction.transactionId)}
            />
            <Button
              isButton
              isWarningOutline
              title={`Tolak Pembayaran`}
              className={`lg:col-start-4`}
              onClick={() => handleShowModal("Tolak Pembayaran", selectedTransaction.transactionId)}
            />
            <Button
              isButton
              isPrimary
              title={`Terima Pembayaran`}
              className={`md:col-start-3 lg:col-start-5 row-start-1 col-span-full md:col-span-1`}
              onClick={() => handleShowModal("Konfirmasi", selectedTransaction.transactionId)}
            />
          </div>
        </>
        }

        {showModal.context === "Tolak Pembayaran" && 
          <ModalTolakPembayaran 
            selectedTransaction={selectedTransaction} 
            isUpdateOngoingTransactionLoading={isUpdateOngoingTransactionLoading}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        }

        {showModal.context === "Batalkan Pesanan" && 
          <ModalBatalkanPesanan 
            selectedTransaction={selectedTransaction} 
            isUpdateOngoingTransactionLoading={isUpdateOngoingTransactionLoading}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        }

        {showModal.context === "Konfirmasi" && 
          <ModalKonfirmasi 
            selectedTransaction={selectedTransaction} 
            isUpdateOngoingTransactionLoading={isUpdateOngoingTransactionLoading}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
          />
        }

      </Modal>
    </>
  );
}
