import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOngoingTransactions, getTransactionList, getTransactionStatus } from "../../../store/slices/transaction/slices";
import { toast } from "react-toastify"

import Button from "../../../components/Button";
import MenungguPembayaran from "./menunggu-pembayaran";
import MenungguKonfirmasi from "./menunggu-konfirmasi";
import PembayaranDiterima from "./pembayaran-diterima";
import PesananDiproses from "./pesanan-diproses";
import PesananDikirim from "./pesanan-dikirim";
import PesananDibatalkan from "./pesanan-dibatalkan";
import PesananDiterima from "./pesanan-diterima";
import { setDateValidationSchema } from "../../../store/slices/transaction/validation";
import { HiMinus, HiOutlineTrash, HiXMark } from "react-icons/hi2";

export default function Transaction({
  ongoingTransactions
}) {
  const dispatch = useDispatch();

    const { transaction, isGetTransactionLoading, totalPage, transactionStatus, isUpdateOngoingTransactionLoading } = useSelector((state) => {
    return {
      transaction: state.transaction?.transactions,
      totalPage: state.transaction?.totalPage,
      transactionStatus: state.transaction?.transactionStatus,
      isGetTransactionLoading: state.transaction?.isGetTransactionLoading,
      isUpdateOngoingTransactionLoading: state.transaction?.isUpdateOngoingTransactionLoading,
    };
  });

  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  
  // false = DESC, true = ASC
  const [sortDate, setSortDate] = useState(false)

  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState(1);
  const [isStartDateChanged, setIsStartDateChanged] = useState(false)
  const [isEndDateChanged, setIsEndDateChanged] = useState(false)
  const [showClearButton, setShowClearButton] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)

  const handleSetDate = async () => {
    try {
      if (!showClearButton) {
        await setDateValidationSchema.validate({
          startDate: startDateRef.current?.value, 
          endDate: endDateRef.current?.value, 
        })
        setShowClearButton(true);
        setPage(1)
  
        dispatch(
          getTransactionList({
            statusId : activeTab,
            startFrom : startDateRef.current?.value,
            endFrom : endDateRef.current?.value,
            sortDate : sortDate ? "ASC" : "DESC"
          })
        )
      }

      if (showClearButton) {
        startDateRef.current.value = "";
        endDateRef.current.value = "";

        setSortDate(false)
        setShowClearButton(false)
        setPage(1)

        dispatch(getTransactionList({
            statusId : activeTab,
            startFrom : startDateRef.current.value,
            endFrom : endDateRef.current.value,
            sortDate : sortDate ? "ASC" : "DESC"
        }))
      }
    } catch (error) {
      toast.error("Tanggal akhir tidak boleh kurang dari tanggal awal")
      setIsToastVisible(true);

      setTimeout(() => {
        setIsToastVisible(false);
      }, 2000);
    }
  }

  useEffect(() => {
    startDateRef.current.value = "";
    endDateRef.current.value = "";

    setShowClearButton(false)

    dispatch(getTransactionList({ 
      statusId : activeTab,
      startFrom : startDateRef.current?.value,
      endFrom : endDateRef.current?.value,
      page,
      sortDate : sortDate ? "ASC" : "DESC"
    }));
  }, [page, activeTab, sortDate]);
  
  useEffect(() => {
    dispatch(getTransactionStatus());
  }, []);
  
  useEffect(()=>{
    setPage(1)
    dispatch(getOngoingTransactions())
  }, [activeTab, sortDate])

  useEffect(()=>{
    setSortDate(false)
  }, [activeTab])

  const tabContent = [
    { tabId: 1, component: MenungguPembayaran },
    { tabId: 2, component: MenungguKonfirmasi },
    { tabId: 3, component: PembayaranDiterima },
    { tabId: 4, component: PesananDiproses },
    { tabId: 5, component: PesananDikirim },
    { tabId: 6, component: PesananDiterima },
    { tabId: 7, component: PesananDibatalkan },
  ]

  const RenderTabContent = tabContent.find(content => content.tabId === activeTab)?.component
  const statusDesc = transactionStatus?.find(status => status.statusId === activeTab)?.statusDesc


  return (
    <>
      <div  className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
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

        <div>
          <div className="flex flex-col justify-between mt-4">
            <h3 className="subtitle">{statusDesc}</h3>

            <div className="flex flex-col md:flex-row md:justify-between gap-2">
              <div className="flex gap-2 items-center">
                <input
                  disabled={showClearButton}
                  name="start" 
                  type="date" 
                  ref={startDateRef}
                  onChange={() => setIsStartDateChanged(true)}
                  className={`border outline-primary bg-slate-50 text-sm rounded-lg block p-1.5 ${startDateRef.current?.value ? "border-primary" : "border-slate-300"}`}
                />

              <HiMinus/>

                <input
                  disabled={showClearButton}
                  name="end"
                  type="date" 
                  ref={endDateRef}
                  onChange={() => setIsEndDateChanged(true)}
                  className={`border outline-primary bg-slate-50 text-sm rounded-lg block p-1.5 ${endDateRef.current?.value ? "border-primary" : "border-slate-300"}`}
                />

                <div className="group relative">
                  <Button
                    isButton
                    isPrimary={!showClearButton}
                    isDangerOutline={showClearButton}
                    onClick={handleSetDate}
                    title={showClearButton ? "Hapus" : "Atur Tanggal"}
                    isDisabled={!isStartDateChanged || !isEndDateChanged || isToastVisible}
                  />
                </div>
              </div>

              {transaction.length > 0 &&
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">Urutkan Tanggal</span>
                  <Button 
                    isButton
                    isPrimary
                    className={`relative`}
                    title={sortDate ? "Terlama" : "Terbaru"}
                    onClick={() => setSortDate(prevState => !prevState)}
                    />
                </div>
              }
            </div>
          </div>

          <RenderTabContent
            transaction={transaction}
            currentPage={page}
            totalPage={totalPage}
            setPage={setPage}
            setActiveTab={setActiveTab}
            isGetTransactionLoading={isGetTransactionLoading}
            isUpdateOngoingTransactionLoading={isUpdateOngoingTransactionLoading}
          />

          </div>
      </div>
    </>
  );
}
