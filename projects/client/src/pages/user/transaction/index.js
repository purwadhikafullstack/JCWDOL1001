import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionStatus } from "../../../store/slices/transaction/slices";

import Button from "../../../components/Button";
import MenungguPembayaran from "./menunggu-pembayaran";
import MenungguKonfirmasi from "./menunggu-konfirmasi";
import PembayaranDiterima from "./pembayaran-diterima";
import PesananDiproses from "./pesanan-diproses";
import PesananDikirim from "./pesanan-dikirim";
import PesananDibatalkan from "./pesanan-dibatalkan";
import PesananDiterima from "./pesanan-diterima";
import transaction from "../../../store/slices/transaction";

export default function Transaction({
  ongoingTransactions
}) {
  const dispatch = useDispatch();
  const { transactionStatus } = useSelector((state) => {
    return {
      transactionStatus: state.transaction?.transactionStatus,
    };
  });
  
    useEffect(() => {
      dispatch(getTransactionStatus());
    }, []);
  
  const [activeTab, setActiveTab] = useState(1);
  
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
            statusDesc={tabStatus.statusDesc}
            setActiveTab={setActiveTab}
          />
        );
      case 2:
        return (
          <MenungguKonfirmasi
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
            setActiveTab={setActiveTab}
          />
        );
      case 3:
        return (
          <PembayaranDiterima
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
          />
        );
      case 4:
        return (
          <PesananDiproses
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
          />
        );
      case 5:
        return (
          <PesananDikirim
          statusId={tabStatus.statusId}
          statusDesc={tabStatus.statusDesc}
          setActiveTab={setActiveTab}
          />
      );
      case 6:
        return (
          <PesananDiterima
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
          />
        );
      case 7:
        return (
          <PesananDibatalkan
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
          />
        );
      default:
        return <div>Something was wrong</div>;
    }
  }

  return (
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
      <div className="">{renderTabContent(activeTab)}</div>
    </div>
  );
}
