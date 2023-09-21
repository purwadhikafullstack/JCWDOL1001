  import Button from "../../../components/Button";
  import MenungguPembayaran from "./menunggu-pembayaran"
  import MenungguKonfirmasi from "./menunggu-konfirmasi"
  import PembayaranDiterima from "./pembayaran-diterima"
  import PesananDiproses from "./pesanan-diproses"
  import PesananDikirim from "./pesanan-dikirim"
  import PesananDibatalkan from "./pesanan-dibatalkan"
  import PesananDiterima from "./pesanan-diterima"
import { useState } from "react";

  export default function Transaction() {
    const tabs = [
      { 
        title : "Menunggu Pembayaran",
        tabKey : "menungguPembayaran" 
      },
      { 
        title : "Menunggu Konfirmasi",
        tabKey : "menungguKonfirmasi" 
      },
      { 
        title : "Pembayaran Diterima",
        tabKey : "pembayaranDiterima" 
      },
      { 
        title : "Pesanan Diproses",
        tabKey : "pesananDiproses" 
      },
      { 
        title : "Pesanan Dikirim",
        tabKey : "pesananDikirim" 
      },
      { 
        title : "Pesanan Dibatalkan",
        tabKey : "pesananDibatalkan" 
      },
      { 
        title : "Pesanan Diterima",
        tabKey : "pesananDiterima" 
      },
    ]

    const [activeTab, setActiveTab] = useState("menungguPembayaran");

    function renderTabContent(tab) {
      const tabContent = {
        menungguPembayaran : <MenungguPembayaran />,
        menungguKonfirmasi : <MenungguKonfirmasi />,
        pembayaranDiterima : <PembayaranDiterima />,
        pesananDiproses : <PesananDiproses />,
        pesananDikirim : <PesananDikirim />,
        pesananDibatalkan : <PesananDibatalkan />,
        pesananDiterima : <PesananDiterima />
      };

      if (tab in tabContent) {
        return tabContent[tab];
      } else {
        return <div>Something was wrong</div>;
      }
    }

    return (
      <div>
        <h3 className="title">Transaksi</h3>
        <div className="flex gap-2 mt-2 w-full overflow-auto border-b pb-2 border-primary/30">
          {tabs.map((tab, index) => (
            <Button
              isButton
              isPrimaryOutline
              key={index}
              title={tab.title}
              onClick={() => setActiveTab(tab.tabKey)}
            />
          ))}
        </div>
        <div className="mt-2">
            {renderTabContent(activeTab)}
        </div>
      </div>
    )
  }
