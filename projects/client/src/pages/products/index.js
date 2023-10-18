import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/slices/product/slices";
import { getCategory } from "../../store/slices/cat/slices";
import { useEffect, useRef, useState } from "react";
import { HiMagnifyingGlass, HiOutlineFunnel, HiXMark } from "react-icons/hi2";

import Button from "../../components/Button";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import SkeletonCard from "../../components/SkeletonCard";
import Input from "../../components/Input";
import UploadRecipeButton from "../../components/UploadRecipeButton";
import "./index.css";
import FilterDropdownMenu from "./filter.dropdown.menu";
import { totalProductCart } from "../../store/slices/cart/slices";
import { useLocation } from "react-router-dom";
import Pagination from "../../components/PaginationV2";

export default function Products({ user }) {
  const dispatch = useDispatch();
  const location = useLocation();

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
  const [sort, setSort] = useState({ sortBy: "", type: "" });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null)
  const [promo, setPromo] = useState(false)
  const [filterType, setFilterType] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false)

  const handleSearch = (event) => {
    setPage(1)
    event.preventDefault();
    setSearch(searchRef.current?.value)
    setSelectedCategory(null)
    setPromo(false)
  };

  const clearSearch = () => {
    setSearch(null)
    setPage(1)

    searchRef.current.value = "";
    dispatch(
      getProducts({
        page: page,
        category_id: selectedCategory ? selectedCategory?.categoryId : "",
        product_name: search,
        sort_price: sort.sortBy === "price" ? sort.type : "",
        sort_name: sort.sortBy === "name" ? sort.type : "",
        limit: 12,
        promo,
      })
    );
}

  const handleSort = (sortBy, type) => {
    setSort({sortBy, type})
    setPage(1)
  };

  
  const setAllProducts = (isPromo) =>{
    setSelectedCategory(null);
    setSearch(null)
    setPage(1)
    setPromo(isPromo)
    setSort(false)
    setFilterType(null)
    setActiveFilter(null)
    searchRef.current.value = ""
  }

  useEffect(() => {
    dispatch(getCategory({ page : 1, limit: 20 }));

    if(location.state?.categorySelected){
      setSelectedCategory(location.state?.categorySelected)
      dispatch(
        getProducts({
          page : 1,
          category_id : location.state?.categorySelected.categoryId,
          limit : 12
        })
      )
    }

    if (location.state?.promo) {
      setAllProducts(true)
    }
    dispatch(totalProductCart())
  }, []);

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
    });

    dispatch(
      getProducts({
        page: page,
        category_id: selectedCategory ? selectedCategory?.categoryId : "",
        product_name: search,
        sort_price: sort.sortBy === "price" ? sort.type : "",
        sort_name: sort.sortBy === "name" ? sort.type : "",
        limit: 12,
        promo,
      })
    );

    setIsDropdownActive(false)
  }, [selectedCategory, search, sort, page, promo ]);

  useEffect(()=>{
    setSort(false)
    setFilterType(null)
    setActiveFilter(null)
  }, [selectedCategory])

  
  return (
    <>
      <div className="container py-24">
        <div className="col-span-1 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="col-span-1 h-fit w-full border-b pb-4 lg:block lg:rounded-lg lg:border lg:p-6 lg:shadow-lg ">
            <h3 className="title">Kategori</h3>
            <div className="categories-wrapper mt-4 flex flex-nowrap gap-8 overflow-auto lg:flex-col lg:items-start lg:justify-start lg:gap-4 lg:max-h-[80vh] lg:overflow-auto">

              <Button
                isLink
                className={`product-category ${!selectedCategory && !promo && "active"}`}
                onClick={() => setAllProducts(false)}
              >
                Semua Produk
              </Button>

              <Button
                isLink
                className={`product-category ${promo && "active"}`}
                onClick={() => setAllProducts(true)}
              >
                Promo
              </Button>

              {categories.map((category, index) => (
                <Button
                  key={index}
                  isLink
                  className={`product-category ${
                    selectedCategory?.categoryDesc === category.categoryDesc &&
                    "active"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearch(null)
                    setPage(1)
                    setPromo(false)
                    searchRef.current.value = ""
                  }}
                >
                  {category.categoryDesc}
                </Button>
              ))}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <div className="flex justify-center items-center flex-col md:flex-row md:justify-between gap-2">
              <form
                className="relative w-full lg:w-1/3"
                onSubmit={(e) => {
                  handleSearch(e);
                }}
              >
                <Input
                  ref={searchRef}
                  type="text"
                  placeholder="Cari kebutuhanmu disini"
                  className="pr-16"
                />
                <Button
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                  type="submit"
                >
                  <HiMagnifyingGlass className="text-2xl text-primary" />
                </Button>
              {search && 
                <Button
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2"
                  onClick={clearSearch}
                >
                  <HiXMark className="text-2xl text-primary" />
                </Button>
              }
              </form>

              <div className="relative md:w-1/3 lg:w-1/5 self-stretch" onClick={() => setIsDropdownActive(!isDropdownActive)} onMouseLeave={() => setIsDropdownActive(false)}>
                <Button
                  isButton
                  isBLock
                  isPrimaryOutline
                  className="flex items-center justify-between h-full"
                >
                  {filterType ?
                    <span className="capitalize">{filterType}</span>
                    :
                    <span>Sortir</span>
                  }
                  <HiOutlineFunnel className="text-lg" />
                </Button>

                <FilterDropdownMenu 
                  handleSort={handleSort} 
                  setFilterType={setFilterType} 
                  activeFilter={activeFilter} 
                  setActiveFilter={setActiveFilter}
                  isDropdownActive={isDropdownActive}
                  />
                
              </div>
            </div>


            <div className="flex items-center justify-between mt-4">
              <h3 className="subtitle">
                {searchRef.current?.value
                  ? `Hasil Pencarian: ${searchRef.current?.value}`
                  : selectedCategory
                  ? selectedCategory.categoryDesc
                  : promo ? "Promo" : "Semua Produk"}
              </h3>

            
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {isGetProductsLoading ? (
                Array.from({ length: 8 }, (_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : products.length === 0 ? (
                <div className="col-span-full py-24 text-center">
                  <h3 className="text-dark text-xl font-semibold ">
                    Yah! Produk yang kamu cari tidak ditemukan :(
                  </h3>
                  <p className="text-slate-600">
                    Yuk, coba cari produk yang lain
                  </p>
                </div>
              ) : (
                products.map((product, index) => (
                  <Card
                    key={product.productId}
                    productId={product.productId}
                    productName={product.productName}
                    productPrice={product.productPrice}
                    productDiscount={product.discountProducts}
                    productPicture={product.productPicture}
                    productStock={product.productStock}
                    productCategories={product.productCategories}
                  />
                ))
              )}
            </div>

            {total_page > 1 &&
              <Pagination currentPage={current_page} totalPage={total_page} setPage={setPage}/>
            }
          </div>
        </div>
      </div>

      <Footer />

      <UploadRecipeButton user={user} />
    </>
  );
}
