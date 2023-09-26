import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTransactionList } from "../../../../store/slices/transaction/slices";
import { formatDate } from "../../../../utils/formatDate";
import formatNumber from "../../../../utils/formatNumber";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";
import PageDetailTransaction from "./page.detail.transaction";
import { HiArrowLongLeft } from "react-icons/hi2";

export default function PesananDiterima(
  { statusId, 
    statusDesc,
    setShowStatusButton,
    showHandlePageContext,
    setShowHandlePageContext }) {

    const dispatch = useDispatch();
    const { transaction, isGetTransactionLoading } = useSelector((state) => {
      return {
        transaction: state.transaction?.transactions,
        isGetTransactionLoading: state.transaction?.isGetTransactionLoading,
      };
    });

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleTransactionPageAction = (action, transactionId) => {
      setShowHandlePageContext({ show: true, action });
      setShowStatusButton(false);
  
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
  
    const handleCloseTransactionPageAction = () => {
      setShowHandlePageContext({ show: false, action: "" });
      setShowStatusButton(true);
    };
  
    const handleShowModal = () =>{
      window.scrollTo({top:0,
      behavior:"smooth"})
      setShowModal(true)
    }
  
    const handleCloseModal = () =>{
      setShowModal(false)
    }
  
    useEffect(() => {
      dispatch(getTransactionList({ statusId }));
    }, []);
  

  return (
    <>
    {!showHandlePageContext.show &&
          <div className="flex flex-col gap-4 pt-3 pb-24 lg:pb-0">
            {transaction.map((item) => {
              const transactionDetail = item.transactionDetail;
              const moreItems = transactionDetail.length - 1;

              return (
                <div
                  key={item.transactionId}
                  className="cursor-pointer rounded-lg border p-4 shadow-md duration-300 hover:border-primary"
                >
                  <div className=""
                  onClick={() =>
                    handleTransactionPageAction(
                      "Detail Transaksi",
                      item.transactionId
                    )
                  }
                  >
                    
                  <div className="flex justify-between items-center">
                    <p className="mb-4 text-sm">
                      {formatDate(item.createdAt)}
                    </p>
                    <p className="mb-4 text-sm text-primary font-semibold">
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
                  </div>


                  <div className="mt-2 flex items-center justify-between gap-2 border-t-2 pt-2">
                    <div className="">
                      <p className="text-sm">Total Belanja</p>
                      <p className="font-bold">{formatNumber(item.total)}</p>
                    </div>

                    <p className="text-sm text-primary font-semibold">{statusDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        }

        {showHandlePageContext.show &&
          <>
            <Button
              isLink
              className={`text-primary`}
              title={
                <div className="flex items-center gap-2">
                  <HiArrowLongLeft className="text-lg" />
                  <span className="underline">Kembali ke Daftar Transaksi</span>
                </div>
              }
              onClick={handleCloseTransactionPageAction}
            />
            {showHandlePageContext.action === "Detail Transaksi" && (
              <PageDetailTransaction selectedTransaction={selectedTransaction} handleShowModal={handleShowModal}/>
            )}
          </>
        }
    </>
  )
}
