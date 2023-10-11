import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetSuccessTransaction } from "../../../../store/slices/transaction/slices";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import ModalKonfirmasi from "./modal.konfirmasi";
import Pagination from "../../../../components/PaginationV2";
import TransactionCard from "../components/transaction.card";

export default function PesananDikirim({
  transaction,
  totalPage,
  currentPage,
  setPage,
  setActiveTab,
  isGetTransactionLoading,
  isUpdateOngoingTransactionLoading 
}) {
  const dispatch = useDispatch();

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
        closeButtonText={true}
        closeModal={handleCloseModal}
        title={showModal.context}
      >
        {showModal.context === "Detail Transaksi" && 
        <>
          <ModalDetailTransaction
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            handleShowModal={handleShowModal}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              isButton
              isPrimaryOutline
              title={`Kembali`}
              onClick={handleCloseModal}
            />

            <Button
              isButton
              isPrimary
              title={`Pesanan Sudah Diterima`}
              onClick={() => handleShowModal("Konfirmasi", selectedTransaction.transactionId)}
            />
          </div>
        </>
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
