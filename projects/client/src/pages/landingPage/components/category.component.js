import { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Categories({ categories }) {
  const categoryWrapperRef = useRef(null);

  const navigate = useNavigate()

  const [categoryScroll, setCategoryScroll] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const scrollLeft = () => {
    if (categoryWrapperRef.current) {
      categoryWrapperRef.current.scrollLeft -= 350;
    }
  };


  const scrollRight = () => {
    if (categoryWrapperRef.current) {
      categoryWrapperRef.current.scrollLeft += 350;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = categoryWrapperRef.current.scrollLeft;

      setCategoryScroll(currentScroll);

      const maxScrollValue =
        categoryWrapperRef.current.scrollWidth -
        categoryWrapperRef.current.clientWidth;

      setMaxScroll(maxScrollValue);
    };

    if (categoryWrapperRef.current) {
      categoryWrapperRef.current.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (categoryWrapperRef.current) {
        categoryWrapperRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  return (
    <>
      <h3 className="title">Kategori</h3>
      <div className="relative">
        <div
          className="categories-wrapper flex gap-4 overflow-x-auto scroll-smooth px-2 py-4"
        >
          {categories.map((category) => (
            <Button
              onClick={()=>{navigate("/products",{ state: { categorySelected: category }})}}
              key={category.id}
              className="flex w-48 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6"
            >
              <div className="h-8 w-8 md:h-10 md:w-10">
                <img src={process.env.CLOUDINARY_BASE_URL+ categories.categoryPicture} alt="" />
              </div>
              <p className="text-sm font-bold text-dark md:text-base">
                {category.categoryDesc}
              </p>
            </Button>
          ))}

          {categoryScroll > 0 && (
            <div
              className="scroll-button absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-slate-50 text-dark shadow-lg duration-300 hover:bg-slate-200 lg:-left-5 lg:flex"
              onClick={scrollLeft}
            >
              <FaChevronLeft />
            </div>
          )}

          {categoryScroll < maxScroll && maxScroll > 0 && (
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
