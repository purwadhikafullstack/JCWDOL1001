import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputImage from "../../../components/InputImage";
import { useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { capitalizeEachWords } from "../../../utils/capitalizeEachWords";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "../../../store/slices/product/slices";
import {
  inputProductValidationSchema,
  updateProductValidationSchema,
} from "../../../store/slices/product/validation";
import Message from "../../../components/Message";
import ModalSelectCategory from "./modal.select.category";

export default function ModalInputProduct({
  success,
  categories,
  categoriesTotalPage,
  setCategoriesPage,
  productData,
  handleCloseModal,
  isSubmitProductLoading,
  categoriesCurrentPage
}) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const dispatch = useDispatch();

  const productNameRef = useRef(null);
  const productPriceRef = useRef(null);
  const productDosageRef = useRef(null);
  const productDescriptionRef = useRef(null);

  const [error, setError] = useState("");
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const [file, setFile] = useState(null);
  const [dataImage, setDataImage] = useState(null);

  const handleSelectCategory = (e) => {
    const categoryId = +e.target.value;

    const isCategorySelected = selectedCategories.some(
      (category) => category.categoryId === categoryId
    );

    if (isCategorySelected) {
      setSelectedCategories(
        selectedCategories.filter(
          (category) => category.categoryId !== categoryId
        )
      );
    } else {
      const selectedCategory = categories.find(
        (category) => category.categoryId === categoryId
      );
      setSelectedCategories([...selectedCategories, selectedCategory]);
    }

    setError({ ...error, categoryId: "" });
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(
      selectedCategories.filter((item) => item.categoryId !== categoryId)
    );
  };

  useEffect(() => {
    if (productData) {
      productNameRef.current.value = productData.productName || "";
      productPriceRef.current.value = productData.productPrice || "";
      productDosageRef.current.value = productData.productDosage || "";
      productDescriptionRef.current.value =
        productData.productDescription || "";
      setSelectedCategories(productData.productCategories);
      setDataImage(productData.productPicture);
    }
  }, [productData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryIds = selectedCategories.map(
      (category) => category.categoryId
    );

    const inputProductData = {
      productName: capitalizeEachWords(productNameRef.current?.value),
      productPrice: productPriceRef.current?.value,
      productDosage: productDosageRef.current?.value,
      productDescription: productDescriptionRef.current?.value,
      productPicture: file,
      categoryId: categoryIds,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(inputProductData));
    if (file) formData.append("file", file);

    try {
      if (productData) {
        if (!confirmAdd) {
        await updateProductValidationSchema.validate(inputProductData, {
          abortEarly: false,
        });

        setError("");
        setConfirmAdd(true);
        } else {
          dispatch(updateProduct({ id: productData.productId, formData }));
        }
      }

      if (!productData) {
        if (!confirmAdd) {
          await inputProductValidationSchema.validate(inputProductData, {
          abortEarly: false,
        });

        setError("");
        setConfirmAdd(true);
        } else {
          dispatch(createProduct(formData));
        }
      }
    } catch (error) {
      const errors = {};

      error.inner.forEach((innerError) => {
        errors[innerError.path] = innerError.message;
      });
      setError(errors);

      toast.error("Periksa kembali kolom pengisian!");

      setIsToastVisible(true);

      setTimeout(() => {
        setIsToastVisible(false);
      }, 2000);
    }
  };

  if (success) {
    return (
      <Message
        type="success"
        message={
          productData
            ? "Produk Berhasil Diubah!"
            : "Produk Berhasil Ditambahkan!"
        }
        handleCloseModal={()=>{
          handleCloseModal()
          setSelectedCategories([]);
        }}
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-auto px-1">
      <form onSubmit={(e) => handleSubmit(e)} className="">
        <div className={`${confirmAdd ? "hidden" : ""}`}>
          <div className="grid md:grid-cols-2 md:gap-2">
            <div className="">
              <div className="">
                {selectedCategories.length === 0 ? (
                  <h3>Pilih Kategori ...</h3>
                ) : (
                  <>
                    <h3>Kategori</h3>

                    <div
                      className="mb-2 flex flex-wrap gap-2"
                      onChange={() => setError({ ...error, categoryId: false })}
                    >
                      {selectedCategories?.map((item) => {
                        return (
                          <Button
                            isPrimaryOutline
                            key={item?.categoryId}
                            className="flex items-center rounded-md px-2 py-1 text-sm"
                          >
                            {item?.categoryDesc}
                            <span
                              className="ml-2 cursor-pointer"
                              onClick={() => handleRemoveCategory(item.categoryId)}
                            >
                              <HiXMark className="text-lg" />
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </>
                )}

                <Button
                  isButton
                  isPrimary
                  title="Pilih Kategori"
                  onClick={() => setShowCategoryModal(true)}
                />

                {error.categoryId && (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {error.categoryId}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-y-4">
                <div className="">
                  <Input
                    ref={productNameRef}
                    type="text"
                    label="Nama Produk"
                    placeholder="Contoh: Paracetamol 500 mg"
                    errorInput={error.productName}
                    onChange={() => setError({ ...error, productName: false })}
                  />
                  {error.productName && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.productName}
                    </div>
                  )}
                </div>

                <div className="">
                  <Input
                    ref={productPriceRef}
                    type="number"
                    label="Harga Produk"
                    placeholder="Contoh: 35000"
                    errorInput={error.productPrice}
                    onChange={() => setError({ ...error, productPrice: false })}
                  />
                  {error.productPrice && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.productPrice}
                    </div>
                  )}
                </div>

                <div className="">
                  <Input
                    ref={productDosageRef}
                    type="text"
                    label="Dosis"
                    placeholder="Contoh: 3 x 1 hari"
                    errorInput={error.productDosage}
                    onChange={() => setError({ ...error, productDosage: false })}
                  />
                  {error.productDosage && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.productDosage}
                    </div>
                  )}
                </div>

                <div className="">
                  <Input
                    ref={productDescriptionRef}
                    type="textarea"
                    label="Deskripsi Produk"
                    placeholder="Tulis Deskripsi Disini"
                    errorInput={error.productDescription}
                    onChange={() =>
                      setError({ ...error, productDescription: false })
                    }
                  />
                  {error.productDescription && (
                    <div className="text-sm text-red-500 dark:text-red-400">
                      {error.productDescription}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <InputImage
              file={file}
              setFile={setFile}
              error={error.productPicture}
              setError={setError}
              dataImage={dataImage}
              setDataImage={setDataImage}
            />
          </div>

          <div className="mt-8 flex gap-2">
            <Button
              isButton
              isBLock
              isSecondary
              title="Kembali"
              onClick={()=>{
                handleCloseModal();
                setSelectedCategories([]);
              }}
            />
            <Button
              isButton
              isPrimary
              isBLock
              isDisabled={isToastVisible}
              title={productData ? "Ubah" : "Tambah Produk"}
              type={isToastVisible ? "button" : "submit"}
            />
          </div>
        </div>

        <div className={`${!confirmAdd ? "hidden" : null}`}>
          {productData ? (
            <>
            <p className="modal-text">
              Apa kamu yakin ingin mengubah produk ini?
            </p>
            {(!file) && 
              <p className="text-sm text-danger">Kamu tidak memilih gambar baru dan akan tetap menggunakan gambar produk sebelumnya</p>
            }
            </>
          ) : (
            <p className="modal-text">
              Apa kamu yakin ingin menambahkan produk{" "}
              <span className="font-bold">
                {capitalizeEachWords(productNameRef.current?.value)}
              </span>{" "}
              ke daftar produk?
            </p>
          )}

          <div className="flex justify-end gap-2">
            {!isSubmitProductLoading && (
              <Button
                isButton
                isPrimaryOutline
                title="Tidak"
                className="mt-4"
                type="button"
                onClick={() => setConfirmAdd(false)}
              />
            )}

            <Button
              isButton
              isPrimary
              title={"Ya"}
              className="mt-4"
              type="submit"
              isLoading={isSubmitProductLoading}
            />
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showCategoryModal && (
          <ModalSelectCategory
            categories={categories} 
            selectedCategories={selectedCategories} 
            handleSelectCategory={handleSelectCategory}
            setShowCategoryModal={setShowCategoryModal}
            categoriesTotalPage={categoriesTotalPage}
            categoriesCurrentPage={categoriesCurrentPage}
            setCategoriesPage={setCategoriesPage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
