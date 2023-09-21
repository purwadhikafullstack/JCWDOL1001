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

export default function Transaction({
  showHandlePageContext,
  setShowHandlePageContext,
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
  const [showStatusButton, setShowStatusButton] = useState(true);

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
            setShowStatusButton={setShowStatusButton}
            showHandlePageContext={showHandlePageContext}
            setShowHandlePageContext={setShowHandlePageContext}
          />
        );
      case 2:
        return (
          <MenungguKonfirmasi
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
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
          <PesananDibatalkan
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
          />
        );
      case 6:
        return (
          <PesananDikirim
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
          />
        );
      case 7:
        return (
          <PesananDiterima
            statusId={tabStatus.statusId}
            statusDesc={tabStatus.statusDesc}
          />
        );
      default:
        return <div>Something was wrong</div>;
    }
  }

  return (
    <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
      {showStatusButton && (
        <>
          <h3 className="title">Transaksi</h3>
          <div className="mt-2 flex w-full gap-2 overflow-auto border-b border-primary/30 pb-2">
            {transactionStatus.map((tab) => (
              <Button
                key={tab.statusId}
                isButton
                isPrimaryOutline={tab.statusId !== activeTab}
                isPrimary={tab.statusId === activeTab}
                title={tab.statusDesc}
                onClick={() => setActiveTab(tab.statusId)}
              />
            ))}
          </div>
        </>
      )}
      <div className="">{renderTabContent(activeTab)}</div>
    </div>
  );
}

