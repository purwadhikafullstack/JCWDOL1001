import { motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import Button from "../../../components/Button";
import Pagination from "../../../components/PaginationV2";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function ModalSelectCategory({ 
  categories, 
  handleSelectCategory, 
  selectedCategories, 
  setShowCategoryModal,
  categoriesTotalPage,
  categoriesCurrentPage,
  setCategoriesPage, 
}) {
  const { isLoading } = useSelector(state => {
    return {
      isLoading : state?.cat?.isLoading,
    }
  })
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
                <h3 className="title">Pilih Kategori</h3>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setCategoriesPage(1);
                  }}
                >
                  <HiXMark className="text-3xl" />
                </span>
              </div>

              <div className="my-4 max-h-[55vh] divide-y-2 overflow-auto">
                {isLoading ? 
                  <LoadingSpinner isLarge/>  
                :
                  categories.map((category) => (
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
                  ))
                }

              </div>
              {categoriesTotalPage > 1 &&
                <Pagination currentPage={categoriesCurrentPage} totalPage={categoriesTotalPage} setPage={setCategoriesPage} />
              }


              <div className="mt-4 flex gap-2">
                <Button
                  isButton
                  isPrimary
                  isBLock
                  title="Selesai"
                  onClick={() => setShowCategoryModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
  )
}
