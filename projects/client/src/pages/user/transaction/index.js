import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionList, getTransactionStatus } from "../../../store/slices/transaction/slices";
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown,FaSortAmountUp } from "react-icons/fa"

import Button from "../../../components/Button";
import MenungguPembayaran from "./menunggu-pembayaran";
import MenungguKonfirmasi from "./menunggu-konfirmasi";
import PembayaranDiterima from "./pembayaran-diterima";
import PesananDiproses from "./pesanan-diproses";
import PesananDikirim from "./pesanan-dikirim";
import PesananDibatalkan from "./pesanan-dibatalkan";
import PesananDiterima from "./pesanan-diterima";
import transaction from "../../../store/slices/transaction";
import Modal from "../../../components/Modal";

export default function Transaction({
  ongoingTransactions
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

  const { transactionStatus } = useSelector((state) => {
    return {
      transactionStatus: state.transaction?.transactionStatus,
    };
  });

  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  const [activeTab, setActiveTab] = useState(1);
  const [showModal, setShowModal] = useState(false)
  const [sortingDate,setSortingDate] = useState("")

  const handleShowModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const onButtonSortDate = (type="")=>{
    setSortingDate(type)
  }

  const onButtonFilter = () => {
    dispatch(
        getTransactionList({
            statusId : activeTab,
            startFrom : startDateRef.current.value,
            endFrom : endDateRef.current.value,
            sortDate: sortingDate,
        })
    )
  }
  
    useEffect(() => {
      dispatch(getTransactionStatus());
    }, []);
  
  const statusDesc = transactionStatus?.find(status => status.statusId === activeTab)
  
  function renderTabContent(tabId) {
    const tabStatus = transactionStatus.find((status) => status.statusId === tabId);
    
    if (!tabStatus) {
      return <div>Something was wrong</div>;
    }

    switch (tabId) {
      case 1:
        return (
          <MenungguPembayaran
            statusId={tabStatus.statusId}
            setActiveTab={setActiveTab}
          />
        );
      case 2:
        return (
          <MenungguKonfirmasi
            statusId={tabStatus.statusId}
          />
        );
      case 3:
        return (
          <PembayaranDiterima
            statusId={tabStatus.statusId}
          />
        );
      case 4:
        return (
          <PesananDiproses
            statusId={tabStatus.statusId}
          />
        );
      case 5:
        return (
          <PesananDikirim
          statusId={tabStatus.statusId}
          setActiveTab={setActiveTab}
          />
      );
      case 6:
        return (
          <PesananDiterima
            statusId={tabStatus.statusId}
          />
        );
      case 7:
        return (
          <PesananDibatalkan
            statusId={tabStatus.statusId}
          />
        );
      default:
        return <div>Something was wrong</div>;
    }
  }

  return (
    <>
      <div className="">
        <h3 className="title">Transaksi</h3>
        <div className="mt-2 flex w-full gap-2 overflow-auto border-b border-primary/30 pb-2">
          {transactionStatus.map((tab) => {
            const ongoingStatus = ongoingTransactions?.transactions?.find(item => item.statusId === tab.statusId);
            return(
              <Button
              key={tab.statusId}
              isButton
              isPrimaryOutline={tab.statusId !== activeTab}
              isPrimary={tab.statusId === activeTab}
              className={`relative`}
              onClick={() => setActiveTab(tab.statusId)}
              >
              {tab.statusDesc}
              
              {ongoingStatus?.total > 0 &&
                <span className="absolute text-white right-[2px] h-4 w-4 bg-danger top-[1px] flex rounded-full items-center justify-center text-xs">
                  {ongoingStatus?.total}
                </span>
              }
            </Button>
              )
          })}
        </div>
        <div className="">
          <div className="flex justify-between mt-4">
            <h3 className="subtitle">{statusDesc?.statusDesc}</h3>
              <Button isButton isPrimaryOutline title={`Atur Tanggal`} onClick={handleShowModal}/>

          </div>

          {renderTabContent(activeTab)}
          </div>
      </div>

      <Modal
        showModal={showModal}
        closeModal={handleCloseModal}
        fullWidth
        title={`Atur Tanggal`}
        />
    </>
  );
}
