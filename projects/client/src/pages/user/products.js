import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/slices/product/slices";
import { getCategory } from "../../store/slices/cat/slices";
import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Footer from "../../components/Footer";

import "./index.css";
import SkeletonCard from "../../components/SkeletonCard";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

export default function Products({ user }) {
  const dispatch = useDispatch();

  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const searchRef = useRef(null);
  
  const { products, categories, isGetProductsLoading } = useSelector(
    (state) => {
      return {
        products: state.products.data,
        categories: state.cat.category,
        isGetProductsLoading: state.products.isGetProductsLoading,
      };
    }
  );

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
    // setSortName(true);
    // setSortPrice(null);
    // setSortStatus("");

    setSelectedCategory(null)

    dispatch(
      getProducts({
        page: 1,
        id_cat: selectedCategory ? selectedCategory.categoryId : "",
        product_name: searchRef.current?.value,
        sort_price: "",
        sort_name: "",
      })
    );
  };

  const resetSearch = () => {
    searchRef.current.value = "";
  };

  const handleSelectCategory = (categoryId) => {
    dispatch(
      getProducts({
        page: 1,
        id_cat: categoryId,
        product_name: "",
        sort_price: "",
        sort_name: "",
      })
    );
  }

  useEffect(() => {
    dispatch(
      getProducts({
        page: 1,
        id_cat: "",
        product_name: "",
        sort_price: "",
        sort_name: "",
      })
    );
  }, []);

  useEffect(() => {
    dispatch(getCategory());
  }, []);

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
                  handleSelectCategory("")
                  resetSearch()
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
                    setSelectedCategory(category)
                    handleSelectCategory(category.categoryId)
                    resetSearch()
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
                handleSearch(e)
                }
              }
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
                {searchRef.current?.value ? (
                  <HiXMark
                    className="text-2xl text-primary"
                    onClick={resetSearch}
                  />
                ) : (
                  <HiMagnifyingGlass className="text-2xl text-primary" />
                )}
              </button>
            </form>

            <h3 className="title mt-4">
              {searchRef.current?.value? `Hasil Pencarian: ${searchRef.current?.value}` :
              selectedCategory
                ? selectedCategory.categoryDesc
                : "Semua Produk"}
            </h3>
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
                  />
                ))
              )}
            </div>
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
    </>
  );
}
