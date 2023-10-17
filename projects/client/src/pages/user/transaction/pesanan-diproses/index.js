import { useState } from "react";
import Modal from "../../../../components/Modal";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import TransactionCard from "../components/transaction.card";
import Button from "../../../../components/Button";

export default function PesananDiproses({
  transaction,
  isGetTransactionLoading, 
  totalPage,
  currentPage,
  setPage
}) {
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

  const handleCloseModal = () => {
    setShowModal({show: false, context:null});
  };

  if (isGetTransactionLoading && !showModal.show) {
    return Array.from({length: 3}, (_, index) => (
      <SkeletonTransaction key={index}/>
    ))
  }

  return transaction.length === 0 ? (
    <EmptyTransaction />  
  ) : (
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
        {showModal.show &&
          <>
            <ModalDetailTransaction
              selectedTransaction={selectedTransaction}
              handleCloseModal={handleCloseModal}
              handleShowModal={handleShowModal}
            />
            <div className="grid md:grid-cols-3 gap-2 mt-4">
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
      </Modal>
    </>
  );
}
