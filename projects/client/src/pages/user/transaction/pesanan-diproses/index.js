import { useState } from "react";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import Pagination from "../../../../components/PaginationV2";
import TransactionCard from "../components/transaction.card";

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
            <div className="mt-4 justify-center flex gap-2">
              <Button
                isButton
                isPrimary
                title={`Kembali`}
                onClick={handleCloseModal}
              />
            </div>
          </>
        }
      </Modal>
    </>
  );
}
