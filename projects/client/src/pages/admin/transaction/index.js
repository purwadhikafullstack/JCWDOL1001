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
import { HiMagnifyingGlass, HiMinus, HiXMark } from "react-icons/hi2";
import Input from "../../../components/Input";
import { useParams } from "react-router-dom";

export default function Transaction({
  ongoingTransactions
}) {
  const dispatch = useDispatch();
  const { tab } = useParams()

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
  const searchedInvoiceRef = useRef(null)
  
  // false = DESC, true = ASC
  const [sortDate, setSortDate] = useState(null)

  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState(1);
  const [isStartDateChanged, setIsStartDateChanged] = useState(false)
  const [isEndDateChanged, setIsEndDateChanged] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const [searchedInvoice, setSearchedInvoice] = useState(null)

  const handleSortDate = async (type) =>{
    try {
      if (type === "start") setIsStartDateChanged(true)
      if (type === "end") setIsEndDateChanged(true)
      
      if(isStartDateChanged || isEndDateChanged) {
        await setDateValidationSchema.validate({
          startDate: startDateRef.current?.value ? startDateRef.current?.value : null, 
          endDate: endDateRef.current?.value ? endDateRef.current?.value : null, 
        }, {abortEarly : false})
        
        setSortDate(false)
        dispatch(getTransactionList({
            statusId : activeTab,
            startFrom : startDateRef.current.value,
            endFrom : endDateRef.current.value,
            sortDate : sortDate ? "ASC" : "DESC",
            invoice: searchedInvoice
        }))
  
        setPage(1)
  
      }
    } catch (error) {
      if(error.inner.length > 1) {
        toast.error("Tanggal awal dan tanggal akhir harus diisi")
      } else {
        error.inner.forEach((innerError) => {
          toast.error(innerError.message);
        });
      }

      setIsToastVisible(true);

      setTimeout(() => {
        setIsToastVisible(false);
      }, 2000);
    }
  }

  const clearSearch = () => {
    setSearchedInvoice(null)
    setPage(1)
    searchedInvoiceRef.current.value = "";
  }

  const resetFilter = () => {
    setSortDate(null)
    setPage(1)
    setIsStartDateChanged(false)
    setIsEndDateChanged(false)
    setSearchedInvoice(null)
    startDateRef.current.value = "";
    endDateRef.current.value = "";
    searchedInvoiceRef.current.value = "";
  }

  useEffect(() => {
    dispatch(getTransactionList({ 
      statusId : activeTab,
      startFrom : startDateRef.current?.value,
      endFrom : endDateRef.current?.value,
      page,
      sortDate : sortDate ? "ASC" : "DESC",
      invoice: searchedInvoice
    }));

    if(!searchedInvoice && searchedInvoiceRef?.current) searchedInvoiceRef.current.value = "";

  }, [page, activeTab, sortDate, searchedInvoice]);
  
  useEffect(() => {
    dispatch(getTransactionStatus());
  }, []);
  
  useEffect(()=>{
    setPage(1)
  }, [sortDate, searchedInvoice])
  
  useEffect(()=>{
    if (startDateRef.current && endDateRef.current) {  
      startDateRef.current.value = "";
      endDateRef.current.value = "";
    }
    searchedInvoiceRef.current.value = ""
    dispatch(getOngoingTransactions())
    setSortDate(false)
    setIsStartDateChanged(false)
    setIsEndDateChanged(false)
  }, [activeTab])

  useEffect(()=> setActiveTab(+tab), [tab])

  useEffect(() => {
    setTimeout(() => {
      const statusList = document.querySelector(".transaction-status");
      statusList.scrollTo({ left: activeTab === 1 ? 0 : (activeTab-1) * 180, behavior:"smooth" });
    }, 50);
  }, [activeTab]);

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

  return (
    <>
      <div  className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
        <h3 className="title">Transaksi</h3>
        <div className="transaction-status mt-2 flex w-full gap-2 overflow-auto border-b border-primary/30 pb-2">
          {transactionStatus.map((tab) => {
            const ongoingStatus = ongoingTransactions?.transactions?.find(item => item.statusId === tab.statusId);
            return(
              <Button
              key={tab.statusId}
              isLink
              path={`/admin/transaction/${tab.statusId}`}
              isPrimaryOutline={tab.statusId !== activeTab}
              isPrimary={tab.statusId === activeTab}
              className={`relative px-4 py-3 text-sm rounded-lg whitespace-nowrap`}
              >
              {tab.statusDesc}
              
              {ongoingStatus?.total > 0 &&
                <span className="absolute text-white right-0 h-4 w-4 bg-danger top-0 flex rounded-full items-center justify-center text-xs">
                  {ongoingStatus?.total}
                </span>
              }
            </Button>
              )
          })}
        </div>

        <div>
          <div className="flex flex-col justify-between border-b py-2 border-primary/30">
            <div className="flex flex-col md:flex-row md:justify-between gap-2">
              <>
                <form className="relative w-full md:w-1/3" onSubmit={(e) => {
                    e.preventDefault()
                    setSearchedInvoice(searchedInvoiceRef?.current.value)
                  }}
                >
                  <Input type="text" placeholder="Cari nomor invoice disini" ref={searchedInvoiceRef} isDisabled={transaction.length === 0}/>
                  <Button
                      className="absolute top-1/2 right-0 -translate-y-1/2 p-2" 
                      type="submit" 
                  >
                    <HiMagnifyingGlass className="text-2xl text-primary" />
                  </Button>

                  {searchedInvoice && 
                    <Button
                      className="absolute right-8 top-1/2 -translate-y-1/2 p-2"
                      onClick={clearSearch}
                    >
                      <HiXMark className="text-2xl text-primary" />
                    </Button>
                  } 
                </form>

                <div className="flex gap-2 items-center">
                  <input
                    disabled={isToastVisible}
                    name="start" 
                    type="date" 
                    ref={startDateRef}
                    onChange={() => handleSortDate("start")}
                    className={`border outline-primary bg-slate-50 text-sm rounded-lg block p-1.5 ${startDateRef.current?.value ? "border-primary" : "border-slate-300"}`}
                  />

                <HiMinus/>

                  <input
                    disabled={isToastVisible}
                    name="end"
                    type="date" 
                    ref={endDateRef}
                    onChange={() => handleSortDate("end")}
                    className={`border outline-primary bg-slate-50 text-sm rounded-lg block p-1.5 ${endDateRef.current?.value ? "border-primary" : "border-slate-300"}`}
                  />

                  <Button 
                    isButton
                    isPrimary
                    isDisabled={transaction.length === 0}
                    className={`relative`}
                    title={sortDate ? "Terlama" : "Terbaru"}
                    onClick={() => setSortDate(prevState => !prevState)}
                    />
                </div>

                <Button 
                  className={`text-danger font-semibold text-sm w-fit self-center py-2`}
                  title={"Reset Filter"}
                  onClick={resetFilter}
                  />
              </>
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
