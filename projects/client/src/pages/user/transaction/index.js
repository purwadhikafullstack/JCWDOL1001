import Button from "../../../components/Button";

export default function Transaction() {
  const tabs = [
    { title : "Menunggu Pembayaran" },
    { title : "Menunggu Konfirmasi" },
    { title : "Pembayaran Diterima" },
    { title : "Pesanan Diproses" },
    { title : "Pesanan Dikirim" },
    { title : "Pesanan Dibatalkan" },
    { title : "Pesanan Diterima" }
  ]

  return (
    <div>
      <h3 className="title">Transaksi</h3>
      <div className="flex gap-2">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            title={tab.title}
          />
        ))}
      </div>
    </div>
  )
}
