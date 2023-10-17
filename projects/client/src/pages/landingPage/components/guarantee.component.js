import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function Guarantee() {
  const guaranteeItems = [
    { title: "Kualitas Terbaik", ket: "Kami hanya menyediakan produk-produk dari merek terpercaya dan memastikan kualitas setiap produk yang kami jual." },
    { title: "Pelayanan Pelanggan", ket: "Kami peduli tentang kesehatan Anda. Tim layanan pelanggan kami selalu siap membantu Anda dengan pertanyaan Anda." },
    { title: "Keamanan Transaksi", ket: "Keamanan transaksi online Anda adalah prioritas kami. Kami menggunakan teknologi terkini untuk melindungi data pribadi Anda." },
    { title: "Pengiriman Cepat", ket: "Kami memahami bahwa kesehatan adalah prioritas. Produk Anda akan sampai dengan cepat dan aman." },
  ]

  const [guaranteeScroll, setGuaranteeScroll] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const guaranteeWrapperRef = useRef(null);

  const scrollLeft = () => {
    if (guaranteeWrapperRef.current) {
      guaranteeWrapperRef.current.scrollLeft -= 350;
    }
  };


  const scrollRight = () => {
    if (guaranteeWrapperRef.current) {
      guaranteeWrapperRef.current.scrollLeft += 350;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = guaranteeWrapperRef.current.scrollLeft;

      setGuaranteeScroll(currentScroll);

      const maxScrollValue =
        guaranteeWrapperRef.current.scrollWidth -
        guaranteeWrapperRef.current.clientWidth;

      setMaxScroll(maxScrollValue);
    };

    if (guaranteeWrapperRef.current) {
      guaranteeWrapperRef.current.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (guaranteeWrapperRef.current) {
        guaranteeWrapperRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <h3 className="title text-2xl">Kenapa membeli di kami</h3>
      <div className="relative">
        <div
          className={`categories-wrapper flex ${window.screen.width <= 500 ? "flex-col" : "flex-row"} gap-8 justify-between overflow-x-auto scroll-smooth px-2 py-4`}
        >
          {guaranteeItems.map((item, index) => (
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6">
              <div className="">
                <h3 className="text-lg font-bold text-dark">
                  {item.title}
                </h3>
                <p className="mt-4 text-dark">
                  {item.ket}
                </p>
              </div>
            </div>
          ))}

         {guaranteeScroll > 0 && (
            <div
              className="scroll-button absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-dark shadow-lg duration-300 hover:bg-slate-200 lg:-left-5 lg:flex"
              onClick={scrollLeft}
            >
              <FaChevronLeft />
            </div>
          )}

          {guaranteeScroll < maxScroll && maxScroll > 0 && (
            <div
              className="scroll-button right-button absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-dark shadow-lg duration-300 hover:bg-slate-200 lg:-right-5 lg:flex"
              onClick={scrollRight}
            >
              <FaChevronRight />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
