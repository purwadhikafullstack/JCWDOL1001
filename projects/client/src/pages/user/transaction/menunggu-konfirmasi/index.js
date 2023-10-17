import { useState } from "react";
import Modal from "../../../../components/Modal";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import TransactionCard from "../components/transaction.card";
import Button from "../../../../components/Button";
import ModalBatalkanPesanan from "./modal.batalkan.pesanan";
import { resetSuccessTransaction } from "../../../../store/slices/transaction/slices";
import { useDispatch } from "react-redux";

export default function MenungguKonfirmasi({
  transaction,
  totalPage,
  currentPage,
  setPage,
  setActiveTab,
  isGetTransactionLoading,
  isUpdateOngoingTransactionLoading 
}) {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState({show: false, context: null});
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleShowModal = (context, transactionId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowModal({show: true, context});
    setSelectedTransaction(transactionId)

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

  const handleCloseModal = (tab) => {
    setShowModal({ show: false, context: null });
    dispatch(resetSuccessTransaction())

    if (tab) {
      setActiveTab(tab);
    }
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
        currentPage={currentPage}
        handleShowModal={handleShowModal}
        setPage={setPage}
        totalPage={totalPage}
      />
    }

      <Modal
        showModal={showModal.show}
        fullWidth={true}
        closeModal={handleCloseModal}
        title={showModal.context}
        closeButtonText={true}
      >
        {showModal.context === "Detail Transaksi" &&
        <>
          <ModalDetailTransaction
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            handleShowModal={handleShowModal}
          />
          <div className="grid md:grid-cols-3 gap-2 mt-4">
            <Button
              isButton
              isDangerOutline
              title={`Batalkan Pesanan`}
              className={`md:col-start-2 md:row-start-1`}
              onClick={() => handleShowModal("Batalkan Pesanan", selectedTransaction.transactionId)}
            />
            <Button
              isButton
              isPrimary
              title={`Kembali`}
              className={`md:col-start-3 md:row-start-1`}
              onClick={() => handleCloseModal()}
            />
          </div>
        </>
        }

        {showModal.context === "Batalkan Pesanan" && 
          <ModalBatalkanPesanan 
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
