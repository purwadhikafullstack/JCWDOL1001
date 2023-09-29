import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionList } from "../../../../store/slices/transaction/slices";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import ModalDetailTransaction from "./modal.detail.transaction";
import EmptyTransaction from "../component.empty.transaction";
import SkeletonTransaction from "../component.skeleton";
import Pagination from "../../../../components/PaginationV2";

export default function MenungguKonfirmasi({
  statusId,
}) {
  const dispatch = useDispatch();
  const { transaction, isGetTransactionLoading, totalPage, currentPage } = useSelector((state) => {
    return {
      transaction: state.transaction?.transactions,
      isGetTransactionLoading: state.transaction?.isGetTransactionLoading,
      totalPage: state.transaction?.totalPage,
      currentPage: state.transaction?.currentPage,
    };
  });

  const [showModal, setShowModal] = useState({show: false, context: null});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [page, setPage] = useState(1)

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

  useEffect(() => {
    dispatch(getTransactionList({ statusId, page }));
  }, [page]);

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
    <>
      <div className="flex flex-col gap-4 pb-24 pt-3 lg:pb-0">
        {transaction.map((item) => {
          const transactionDetail = item.transactionDetail;
          const moreItems = transactionDetail.length - 1;

          return (
            <div
              key={item.transactionId}
              className="cursor-pointer rounded-lg border p-4 shadow-md duration-300 hover:border-primary"
              onClick={() => handleShowModal("Detail Transaksi - Menunggu Konfirmasi", item.transactionId)}
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

              <div className="mt-2 flex items-center justify-between gap-2 border-t-2 pt-2">
                <div className="">
                  <p className="text-sm">Total Belanja</p>
                  <p className="font-bold">{formatNumber(item.total)}</p>
                </div>

                <Button 
                  isButton
                  isPrimary
                  title="Lihat Detail Transaksi"
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalPage > 1 &&
        <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
      }
    </>
    }

      <Modal
        showModal={showModal.show}
        fullWidth={true}
        closeModal={handleCloseModal}
        title={showModal.context}
        closeButtonText={true}
      >
        {showModal.show &&
          <ModalDetailTransaction
            selectedTransaction={selectedTransaction}
            handleCloseModal={handleCloseModal}
            handleShowModal={handleShowModal}
          />
        }
      </Modal>
    </>
  );
}
