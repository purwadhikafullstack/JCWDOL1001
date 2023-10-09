import { useState } from "react";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import SkeletonTransaction from "../components/skeleton";
import ModalDetailTransaction from "../components/modal.detail.transaction"
import EmptyTransaction from "../components/empty.transaction";
import TransactionCard from "../components/transaction.card";

export default function PesananDibatalkan({ 
  transaction,
  currentPage,
  totalPage,
  setPage,
  isGetTransactionLoading,
  }) {
  const [showModal, setShowModal] = useState(false);
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

  const handleCloseModal = () => {
    setShowModal(false);
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
        halfWidth={true}
        closeModal={handleCloseModal}
        title={`Pesanan dibatalkan oleh ${selectedTransaction?.canceledBy} : ${selectedTransaction?.message}`}

      >
        <>
          <ModalDetailTransaction
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            handleShowModal={handleShowModal}
          />
          <div className="mt-4 flex justify-end">
            <Button
              isButton
              isPrimary
              title={`Tutup`}
              onClick={handleCloseModal}
            />
          </div>
        </>
      </Modal>
    </>
  );
}
