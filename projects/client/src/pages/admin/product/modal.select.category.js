import { motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import Button from "../../../components/Button";

export default function ModalSelectCategory({ categories, handleSelectCategory, selectedCategories, setShowCategoryModal }) {
  return (
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
                      checked={selectedCategories.some(
                        (item) => item.categoryId === category.categoryId
                      )}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* <div className="flex gap-2">
                <Button
                  className={`flex items-center  ${
                    +categoriesPage === 1
                      ? "cursor-auto text-slate-400"
                      : "text-dark hover:text-primary"
                  }`}
                  onClick={() => handlePreviousPage()}
                  isDisabled={+categoriesPage === 1}
                >
                  <HiChevronLeft className=" text-xl " /> Prev
                </Button>

                <Button
                  className={`flex items-center  ${
                    +categoriesPage === totalCategoriesPage
                      ? "cursor-auto text-slate-400"
                      : "text-dark hover:text-primary"
                  }`}
                  onClick={() => handleNextPage()}
                  isDisabled={+categoriesPage === totalCategoriesPage}
                >
                  Next <HiChevronRight className="text-xl " />
                </Button>
              </div> */}

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
  )
}
