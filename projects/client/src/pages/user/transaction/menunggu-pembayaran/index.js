import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSuccessTransaction } from "../../../../store/slices/transaction/slices";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import Pagination from "../../../../components/PaginationV2";
import ModalCaraBayar from "./modal.cara.bayar";
import ModalBatalkanPesanan from "./modal.batalkan.pesanan";
import ModalDetailTransaction from "../components/modal.detail.transaction";
import EmptyTransaction from "../components/empty.transaction";
import SkeletonTransaction from "../components/skeleton";
import TransactionCard from "../components/transaction.card";

export default function MenungguPembayaran({
  transaction,
  totalPage,
  currentPage,
  setPage,
  setActiveTab,
  isGetTransactionLoading,
  isUpdateOngoingTransactionLoading 
}) {
  const dispatch = useDispatch();
  const { successUpdateOngoingTransaction } = useSelector((state) => {
    return {
      successUpdateOngoingTransaction: state.transaction?.successUpdateOngoingTransaction,
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

    if (successUpdateOngoingTransaction) {
      setActiveTab(2)
    }

    if (tab) {
      setActiveTab(tab);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

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
        currentPage={currentPage}
        handleShowModal={handleShowModal}
        setActiveTab={setActiveTab}
        setPage={setPage}
        totalPage={totalPage}
      />
    }

      <Modal
        fullWidth
        showModal={showModal.show}
        closeModal={handleCloseModal}
        title={showModal.context}
        closeButtonText={true}
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
          <>
            <ModalDetailTransaction
              selectedTransaction={selectedTransaction}
              handleCloseModal={handleCloseModal}
              handleShowModal={handleShowModal}
            />
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button isButton isPrimary title={`Kembali`} onClick={handleCloseModal}/>
              <Button isButton isDangerOutline title={`Batalkan Pesanan`} onClick={() => handleShowModal("Batalkan Pesanan", selectedTransaction.transactionId)}/>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
