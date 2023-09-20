import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/slices/product/slices";
import { getCategory } from "../../store/slices/cat/slices";
import { useEffect, useRef, useState } from "react";
import { HiMagnifyingGlass, HiOutlineFunnel, HiXMark } from "react-icons/hi2";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";

import Button from "../../components/Button";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import SkeletonCard from "../../components/SkeletonCard";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import UploadRecipeButton from "../../components/UploadRecipeButton";
import "./index.css";
import FilterDropdownMenu from "./filter.dropdown.menu";
import { totalProductCart } from "../../store/slices/cart/slices";

export default function Products({ user }) {
  const dispatch = useDispatch();

  const {
    products,
    categories,
    total_page,
    current_page,
    isGetProductsLoading,
  } = useSelector((state) => {
    return {
      products: state.products.data,
      categories: state.cat.category,
      total_page: state.products.total_page,
      current_page: state.products.current_page,
      isGetProductsLoading: state.products.isGetProductsLoading,
    };
  });

  const searchRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const [sort, setSort] = useState({ sortBy: "", type: "" });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null)
  const [filterType, setFilterType] = useState(null)

  const handleCart = (productId) => {
    if (user.role) {
      alert(`Produk ${productId} berhasil ditambahkan ke keranjang!`);
    }

    if (!user.role) {
      setShowModal({ show: true, context: "login" });
    }
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchRef.current?.value)
    setSelectedCategory(null)
  };

  const handlePageClick = (type) => {
    if (type === "prev") {
      setPage(prevState => prevState - 1)
    }
    if (type === "next") {
      setPage(prevState => prevState + 1)
    }
  };

  const handleSort = (sortBy, type) => {
    setSort({sortBy, type})
  };

  useEffect(() => {
    dispatch(getCategory({ page: 1 }));
    dispatch(totalProductCart())
  }, []);

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    dispatch(
      getProducts({
        page: page,
        category_id: selectedCategory ? selectedCategory?.categoryId : "",
        product_name: search,
        sort_price: sort.sortBy === "price" ? sort.type : "",
        sort_name: sort.sortBy === "name" ? sort.type : "",
        limit: 12,
      })
    );

  }, [selectedCategory, search, sort, page ]);

  // --------------------- PAGINATION SECTION -----------------------
  const pagesToShow = 4;
  const pagesBeforeAndAfter = Math.floor(pagesToShow / 2);

  let startPage = current_page - pagesBeforeAndAfter;
  let endPage = current_page + pagesBeforeAndAfter;

  startPage = Math.max(1, startPage);
  endPage = Math.min(total_page, endPage);
  
  return (
    <>
      <div className="container py-24">
        <div className="col-span-1 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="col-span-1 h-fit w-full border-b pb-4 lg:block lg:rounded-lg lg:border lg:p-6 lg:shadow-lg ">
            <h3 className="title">Kategori</h3>
            <div className="categories-wrapper mt-4 flex flex-nowrap gap-8 overflow-auto lg:flex-col lg:items-start lg:justify-start lg:gap-4">
              <Button
                isLink
                className={`product-category ${!selectedCategory && "active"}`}
                onClick={() => {
                  setSelectedCategory(null);
                  setSearch(null)
                  setPage(1)
                  searchRef.current.value = ""
                }}
              >
                Semua Produk
              </Button>
              {categories.map((category) => (
                <Button
                  isLink
                  className={`product-category ${
                    selectedCategory?.categoryDesc === category.categoryDesc &&
                    "active"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearch(null)
                    setPage(1)
                    searchRef.current.value = ""
                  }}
                >
                  {category.categoryDesc}
                </Button>
              ))}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <form
              className="relative lg:w-1/3"
              onSubmit={(e) => {
                handleSearch(e);
              }}
            >
              <Input
                ref={searchRef}
                type="text"
                placeholder="Cari kebutuhanmu disini"
              />
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                type="submit"
              >
                <HiMagnifyingGlass className="text-2xl text-primary" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-4">
              <h3 className="title mt-4">
                {searchRef.current?.value
                  ? `Hasil Pencarian: ${searchRef.current?.value}`
                  : selectedCategory
                  ? selectedCategory.categoryDesc
                  : "Semua Produk"}
              </h3>

              <div className="group relative w-1/2 md:w-1/3 lg:w-1/5">
                <Button
                  isButton
                  isBLock
                  isPrimaryOutline
                  className="flex items-center justify-between"
                >
                  {filterType ?
                    <span className="capitalize">{filterType}</span>
                    :
                    <span>Filter</span>
                  }
                  <HiOutlineFunnel className="text-lg" />
                </Button>

                <FilterDropdownMenu handleSort={handleSort} setFilterType={setFilterType}/>
                
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {isGetProductsLoading ? (
                Array.from({ length: 8 }, (_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : products.length === 0 ? (
                <div className="col-span-full py-24 text-center">
                  <h3 className="text-dark text-xl font-semibold ">
                    Oops. Produk belum tersedia
                  </h3>
                  <p className="text-slate-600">
                    Coba temukan produk yang lain
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <Card
                    key={product.productId}
                    productId={product.productId}
                    productName={product.productName}
                    productPrice={product.productPrice}
                    productDiscount={product.productDiscount}
                    productPicture={product.productPicture}
                    productStock={product.productStock}
                    onClick={() => handleCart(product.productId)}
                    productCategories={product.productCategories}
                  />
                ))
              )}
            </div>

            {total_page > 1 &&
              <div className="col-span-full mt-10 flex select-none items-center justify-center gap-6 font-semibold">
                <Button
                  className={`flex items-center  ${
                    +current_page === 1
                      ? "cursor-auto text-slate-400"
                      : "text-dark hover:text-primary"
                  }`}
                  onClick={() => handlePageClick("prev")}
                  isDisabled={+current_page === 1}
                >
                  <HiChevronLeft className=" text-xl " /> Prev
                </Button>

                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                  <Button
                    key={startPage + index}
                    className={`flex items-center ${
                      current_page === startPage + index
                        ? "cursor-auto text-slate-400"
                        : "text-dark hover:text-primary"
                    }`}
                    onClick={() => setPage(startPage + index)}
                    isDisabled={current_page === startPage + index}
                  >
                    {startPage + index}
                  </Button>
                ))}

                <Button
                  className={`flex items-center  ${
                    +current_page === total_page
                      ? "cursor-auto text-slate-400"
                      : "text-dark hover:text-primary"
                  }`}
                  onClick={() => handlePageClick("next")}
                  isDisabled={+current_page === total_page}
                >
                  Next <HiChevronRight className="text-xl " />
                </Button>
              </div>
            }
          </div>
        </div>
      </div>

      <Footer />

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        context={showModal.context}
        title={`Login`}
      />

      <UploadRecipeButton />
    </>
  );
}
