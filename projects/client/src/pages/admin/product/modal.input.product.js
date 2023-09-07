import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputImage from "../../../components/InputImage";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../store/slices/cat/slices";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { capitalizeEachWords } from "../../../utils/capitalizeEachWords";
import {
  createProduct,
  updateProduct,
} from "../../../store/slices/product/slices";
import {
  inputProductValidationSchema,
  updateProductValidationSchema,
} from "../../../store/slices/product/validation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Message from "../../../components/Message";


export default function ModalInputProduct({
  success,
  categories,
  productData,
  showCategoryModal,
  setShowCategoryModal,
  selectedCategories,
  setSelectedCategories,
  handleCloseModal,
  isSubmitProductLoading,
  errorMessage,
}) {
  const dispatch = useDispatch();

  const productNameRef = useRef(null);
  const productPriceRef = useRef(null);
  const productDosageRef = useRef(null);
  const productDescriptionRef = useRef(null);

  const [error, setError] = useState("");
  const [confirmAdd, setConfirmAdd] = useState(false);

  const [inputFormData, setInputFormData] = useState(null)
  const [file, setFile] = useState(null);
  const [dataImage, setDataImage] = useState(null);


  const handleSelectCategory = (e) => {
  const categoryId = +e.target.value;

  const isCategorySelected = selectedCategories.some((category) => category.categoryId === categoryId);

  if (isCategorySelected) {
    setSelectedCategories(selectedCategories.filter((category) => category.categoryId !== categoryId));
  } else {
    const selectedCategory = categories.find((category) => category.categoryId === categoryId);
    setSelectedCategories([...selectedCategories, selectedCategory]);
  }

  setError({ ...error, categoryId: "" });
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter((item) => item.categoryId !== categoryId));
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

// const handleSubmit = async (event) => {
//   event.preventDefault();
  
//     try {
//     const categoryIds = selectedCategories.map((category) => category.categoryId);

//     // Data product (JSON)
//     const inputProductData = {
//       productName: capitalizeEachWords(productNameRef.current?.value),
//       productPrice: productPriceRef.current?.value,
//       productDosage: productDosageRef.current?.value,
//       productDescription: productDescriptionRef.current?.value,
//       productPicture: file,
//       categoryId: categoryIds,
//     };

//     if (productData) {
//       await updateProductValidationSchema.validate(inputProductData, {
//         abortEarly: false,
//       });

//       setError("");
//       setInputFormData(inputProductData)
//       setConfirmAdd(true)
//     } else {
//       await inputProductValidationSchema.validate(inputProductData, {
//         abortEarly: false,
//       });

//       setError("");
//       setInputFormData(inputProductData)
//       setConfirmAdd(true)

//     }
//   } catch (error) {
//     const errors = {};

//     error.inner.forEach((innerError) => {
//       errors[innerError.path] = innerError.message;
//     });
//     setError(errors);
//   }
// };

// const handleConfirm = async (event) => {
//   event.preventDefault();

//     const formData = new FormData();
//     formData.append("data", JSON.stringify(inputFormData));
//     if (file) formData.append("file", file);

//     // for (let pair of formData.entries()) {
//     //   console.log(pair[0], pair[1]);
//     // }

//     if (productData) {
//       dispatch(updateProduct({ id: productData.productId, formData }));
//     }else{
//       dispatch(createProduct(formData));
//     }

// };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Data product (JSON)
    const inputProductData = {
      productName: capitalizeEachWords(productNameRef.current?.value),
      productPrice: productPriceRef.current?.value,
      productDosage: productDosageRef.current?.value,
      productDescription: productDescriptionRef.current?.value,
      productPicture: file,
      categoryId: selectedCategories,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(inputProductData));
    if (file) formData.append("file", file);

    try {
      if (productData) {
        await updateProductValidationSchema.validate(inputProductData, {
          abortEarly: false,
        });

        setError("");
        setConfirmAdd(true);

        if (confirmAdd) {
          dispatch(updateProduct({ id: productData.productId, formData }));
          // for (let pair of formData.entries()) {
          //   console.log(pair[0], pair[1]);
          // }
        }
      }

      if (!productData) {
        await inputProductValidationSchema.validate(inputProductData, {
          abortEarly: false,
        });

        setError("");
        setConfirmAdd(true);

        if (confirmAdd) {
          dispatch(createProduct(formData));
        }
      }
    } catch (error) {
      const errors = {};

      error.inner.forEach((innerError) => {
        errors[innerError.path] = innerError.message;
      });
      setError(errors);
    }
  };

  if (isSubmitProductLoading) {
    return <LoadingSpinner isLarge />;
  }

  if (success) {
    return (
      <Message
        type="success"
        message={
          productData
            ? "Product Updated Successfully"
            : "Product Added Successfully!"
          }
        handleCloseModal={handleCloseModal}
      />
    );
  }

  if (errorMessage) {
    return (
      <Message
        type="error"
        message={errorMessage}
        handleCloseModal={handleCloseModal}
      />
    );
  }

  return (
    <div className="max-h-[75vh] overflow-auto px-1">
      <form onSubmit={handleSubmit}>
        <div className={`${confirmAdd ? "hidden" : null}`}>
          <div className="">
            {selectedCategories.length === 0 ? (
              <h3>Select Category ...</h3>
            ) : (
              <>
                <h3>Categories</h3>

                <div
                  className="mb-2 flex flex-wrap gap-2"
                  onChange={() => setError({ ...error, categoryId: false })}
                >
                  {selectedCategories.map((item) => {
                    const selectedCategory = categories.find(
                      (category) => category.categoryId === item.categoryId
                    );
                    return (
                      <Button
                        isPrimaryOutline
                        key={selectedCategory?.categoryId}
                        className="flex items-center rounded-md px-2 py-1 text-sm"
                      >
                        {selectedCategory?.categoryDesc}
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
              title="Choose Category"
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
                label="Product Name"
                placeholder="e.g. Paracetamol 500 mg"
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
                type="text"
                label="Product Price"
                placeholder="e.g. 35000"
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
                label="Product Dosage"
                placeholder="e.g. 3 x 1 hari"
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
                label="Product Description"
                placeholder="Write Description Here"
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
              title="Cancel"
              onClick={handleCloseModal}
            />
            <button
              className="
              w-full 
              select-none 
              rounded-lg 
              bg-primary 
              px-6 
              py-2 
              text-sm 
              text-white 
              duration-300 
              hover:bg-teal-700"
              type="submit"
            >
              {productData ? "Update" : "Add Product"}
            </button>
          </div>
        </div>

        {confirmAdd && (
          <div className={``}>
            {productData ? (
              <p className="modal-text">
                Are you sure you want to update this product?
              </p>
            ) : (
              <p className="modal-text">
                Are you sure you want to add{" "}
                <span className="font-bold">
                  {capitalizeEachWords(productNameRef.current?.value)}
                </span>{" "}
                to the product list?
              </p>
            )}

            <div className="flex justify-end gap-2">
              {!isSubmitProductLoading && (
                <Button
                  isButton
                  isPrimaryOutline
                  title="Back"
                  className="mt-4"
                  type="button"
                  onClick={() => setConfirmAdd(false)}
                />
              )}

              <button
                className="mt-4
                select-none rounded-lg
                bg-primary
                px-6 py-2
                text-sm
                text-white
                duration-300
                hover:bg-teal-700"
                type="submit"
              >
                Sure
              </button>
            </div>
          </div>
        )}
      </form>

      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <motion.div
              initial={{ translateY: -20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ translateY: -20, opacity: 0 }}
              className="h-fit w-full rounded-lg border bg-slate-100 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="title">Choose Category</h3>
                <span
                  className="cursor-pointer"
                  onClick={() => setShowCategoryModal(false)}
                >
                  <HiXMark className="text-3xl" />
                </span>
              </div>

              <div className="my-4 max-h-[55vh] divide-y-2 overflow-auto">
                {categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className="group mr-2 flex justify-between"
                  >
                    <label
                      htmlFor={category.categoryId}
                      className="w-full cursor-pointer py-2 duration-300 group-hover:ml-3"
                    >
                      {category.categoryDesc}
                    </label>
                    <input
                      type="checkbox"
                      id={category.categoryId}
                      name={category.categoryDesc}
                      value={category.categoryId}
                      onChange={handleSelectCategory}
                      checked={selectedCategories.some(item => item.categoryId === category.categoryId)}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  isButton
                  isPrimary
                  isBLock
                  title="Done"
                  onClick={() => setShowCategoryModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
