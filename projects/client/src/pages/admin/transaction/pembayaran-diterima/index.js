import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetSuccessTransaction } from "../../../../store/slices/transaction/slices";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import ModalKonfirmasi from "./modal.konfirmasi";
import TransactionCard from "../components/transaction.card";
import ModalBatalkanPesanan from "./modal.batalkan.pesanan";

export default function PembayaranDiterima({
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
        title={showModal.context === "Detail Transaksi" ? "Pembayaran Diterima" : "Konfirmasi"}
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
              isDanger
              title={`Batalkan Pesanan`}
              onClick={() => handleShowModal("Batalkan Pesanan", selectedTransaction.transactionId)}
            />

            <Button
              isButton
              isPrimary
              title={`Proses Pesanan`}
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
