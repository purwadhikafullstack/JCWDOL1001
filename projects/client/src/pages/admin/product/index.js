import React, { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputImage from "../../../components/InputImage";
import Modal from "../../../components/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import TableProducts from "./table.products";
import { useNavigate } from "react-router-dom";

export default function AdminProducts({user}) {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleShowModal = (context) => {
    setShowModal({ show: true, context });
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
    setShowCategoryModal(false);
    setSelectedCategories([]);
    document.body.style.overflow = "auto";
  };

  const handleSelectCategory = (e) => {
    const categoryId = +e.target.value;

    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
  };

  const categories = [
    { id: 1, name: "Obat-obatan" },
    { id: 2, name: "Vitamin & Suplemen" },
    { id: 3, name: "Alat Kesehatan" },
    { id: 4, name: "Perawatan Tubuh" },
    { id: 5, name: "Ibu & Anak" },
  ];

  if(!user.role)return navigate("/","replace")

  return (
    <>
      <div className="container py-24 lg:ml-[calc(5rem)]">
        <h3 className="border-b-2 pb-2 text-2xl font-semibold">Products</h3>

        <div className="mt-4 flex items-center justify-between">
          <Button
            isButton
            isPrimary
            title="Add Product"
            onClick={() => handleShowModal("Add Product")}
          />

          <div className="">Dropdown For Filter</div>
        </div>

        <div className="relative mt-4 shadow-md">
          <TableProducts />
        </div>
      </div>

      <Modal
        showModal={showModal.show}
        closeModal={handleCloseModal}
        title={showModal.context}
        disableOutside
      >
        {showModal.context === "Add Product" && (
          <div className="max-h-[75vh] overflow-auto px-1">
            <form>
              <div className="">
                {selectedCategories.length === 0 ? (
                  <h3>Select Category ...</h3>
                ) : (
                  <>
                    <h3>Categories</h3>

                    <div className="mb-2 flex flex-wrap gap-2">
                      {selectedCategories.map((categoryId) => {
                        const selectedCategory = categories.find(
                          (category) => category.id === categoryId
                        );
                        return (
                          <Button
                            isPrimaryOutline
                            key={selectedCategory.id}
                            className="flex items-center rounded-md px-2 py-1 text-sm"
                          >
                            {selectedCategory.name}
                            <span
                              className="ml-2 cursor-pointer"
                              onClick={() => handleRemoveCategory(categoryId)}
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
              </div>

              <div className="mt-4 flex flex-col gap-y-4">
                <Input
                  type="text"
                  label="Product Name"
                  placeholder="Paracetamol 500 mg"
                />
                <Input
                  type="text"
                  label="Product Price"
                  placeholder="Paracetamol 500 mg"
                />
                <Input
                  type="text"
                  label="Product Dosage"
                  placeholder="Paracetamol 500 mg"
                />
                <Input
                  type="textarea"
                  label="Product Description"
                  placeholder="Paracetamol 500 mg"
                />
                <InputImage file={file} />
              </div>

              <div className="mt-8 flex gap-2">
                <Button
                  isButton
                  isBLock
                  isSecondary
                  title="Cancel"
                  onClick={handleCloseModal}
                />
                <Button
                  isButton
                  isBLock
                  isPrimary
                  type="submit"
                  title="Add Product"
                />
              </div>
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
                          key={category.id}
                          className="mr-2 flex justify-between"
                        >
                          <label
                            htmlFor={category.id}
                            className="w-full cursor-pointer py-2 duration-300 hover:ml-3"
                          >
                            {category.name}
                          </label>
                          <input
                            type="checkbox"
                            id={category.id}
                            name={category.name}
                            value={category.id}
                            onChange={handleSelectCategory}
                            checked={selectedCategories.includes(category.id)}
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
        )}

        {showModal.context === "Edit Product" && <h3>Edit</h3>}
      </Modal>
    </>
  );
}
