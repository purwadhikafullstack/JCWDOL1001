export default function Guarantee() {
  const guaranteeItems = [
    { title: "100 % Obat Asli", ket: "Semua produk yang kami jual dijamin asli & kualitas terbaik untuk anda." },
    { title: "Dijamin Hemat", ket: "Kami menjamin akan mengembalikan uang dari selisih perbedaan harga." },
    { title: "Gratis Ongkir", ket: "Tak perlu antre, Kami kirim ke alamat Anda bebas biaya ongkos kirim!" },
  ]
  return (
    <div className="flex flex-col h-full w-full items-center gap-10 overflow-hidden rounded-lg bg-white p-10 shadow-lg">
      <h3 className="title text-2xl">Kenapa membeli di kami</h3>
      <div className="flex flex-row gap-10">
        {guaranteeItems.map((item, index) => (
          <div className="flex h-full w-full items-center gap-10 overflow-hidden rounded-lg bg-slate-200/70 p-10 shadow-lg">
            <div className="">
              <h3 className="text-lg font-bold text-dark">
                {item.title}
              </h3>
              <p className="mt-1 text-dark">
                {item.ket}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
