import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetSuccessTransaction } from "../../../../store/slices/transaction/slices";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import ModalBatalkanPesanan from "./modal.batalkan.pesanan";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import TransactionCard from "../components/transaction.card";

export default function MenungguPembayaran({
  transaction,
  currentPage,
  totalPage,
  setPage,
  setActiveTab,
  isGetTransactionLoading,
  isUpdateOngoingTransactionLoading,
}) {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState({show: false, context: null});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const expiredTime = new Date(selectedTransaction?.expired).getTime();

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
        setActiveTab={setActiveTab}
      />
    }

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        title={showModal.context === "Detail Transaksi" ? "Menunggu Pembayaran" : "Konfirmasi"}
        halfWidth={showModal?.context === "Detail Transaksi"}
      >
        {showModal.context === "Detail Transaksi" && 
          <>
          <ModalDetailTransaction
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            handleShowModal={handleShowModal}
            countdown
          />
          {currentTime < expiredTime &&
            <div className="grid lg:grid-cols-3 mt-4">
              <Button
                isButton
                isDanger
                title={`Batalkan Transaksi`}
                className={`lg:col-start-3`}
                onClick={() => handleShowModal("Batalkan Pesanan", selectedTransaction.transactionId)}
              />
            </div>
          }
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
