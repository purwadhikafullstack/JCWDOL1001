import React from 'react'
import Button from '../Button';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

export default function Pagination({ currentPage, totalPage, setPage }) {
  const handlePageClick = (type) => {
    if (type === "prev") {
      setPage(prevState => prevState - 1)
    }
    if (type === "next") {
      setPage(prevState => prevState + 1)
    }
  };

  const pagesToShow = 4;
  const suffixPrefix = Math.floor(pagesToShow / 2);

  let startPage = currentPage - suffixPrefix;
  let endPage = currentPage + suffixPrefix;

  startPage = Math.max(1, startPage);
  endPage = Math.min(totalPage, endPage);

  return (
    <div className="col-span-full mt-10 flex select-none items-center justify-center gap-6 font-semibold">
      <Button
        className={`flex items-center  ${
          +currentPage === 1
            ? "cursor-auto text-slate-400"
            : "text-dark hover:text-primary"
        }`}
        onClick={() => handlePageClick("prev")}
        isDisabled={+currentPage === 1}
      >
        <HiChevronLeft className=" text-xl " /> Prev
      </Button>

      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <Button
          key={startPage + index}
          className={`flex items-center ${
            currentPage === startPage + index
              ? "cursor-auto text-slate-400 underline"
              : "text-dark hover:text-primary"
          }`}
          onClick={() => setPage(startPage + index)}
          isDisabled={currentPage === startPage + index}
        >
          {startPage + index}
        </Button>
      ))}

      <Button
        className={`flex items-center  ${
          +currentPage === totalPage
            ? "cursor-auto text-slate-400"
            : "text-dark hover:text-primary"
        }`}
        onClick={() => handlePageClick("next")}
        isDisabled={+currentPage === totalPage}
      >
        Next <HiChevronRight className="text-xl " />
      </Button>
    </div>
  )
}
