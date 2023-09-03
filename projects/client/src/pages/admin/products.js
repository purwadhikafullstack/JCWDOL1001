import Button from "../../components/Button";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";

export default function AdminProducts() {
  const [showModal, setShowModal] = useState({ show: false, context: "" });
  const [selectCategory, setSelectCategory] = useState(false)

  const handleShowModal = (context) => {
    setShowModal({ show: true, context });

    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setShowModal({ show: false, context: "" });
    setSelectCategory(false)

    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="container py-24 lg:ml-[calc(5rem)]">
        <h3 className="font-semibold text-2xl border-b-2 pb-2">Products</h3>

        <div className="mt-4 flex justify-between items-center">
          <Button isButton isPrimary title="Add Product" onClick={()=>handleShowModal("Add Product")}/>
          <Button isButton isPrimary title="Edit Product" onClick={()=>handleShowModal("Edit Product")}/>
          
          <div className="">Dropdown For Filter</div>
        </div>
      </div>

      <Modal showModal={showModal.show} closeModal={handleCloseModal} title={showModal.context}>
        {showModal.context === "Add Product" &&
        <>
        <form>

        <div className="">
        <h3>Select Category ...</h3>

        <Button isButton isPrimary title="Choose Category" onClick={()=>setSelectCategory(true)}/>
        </div>

        <Input type="text" label="Product Name" placeholder="Paracetamol 500 mg"/>

        <Button isButton isBLock isPrimary type="submit" title="Add Product" />
        </form> 

        <AnimatePresence>

          {selectCategory &&
        <motion.div
        initial={{ translateY: -20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ translateY: -20, opacity: 0 }}
        className="inset-0 bg-black/20 z-50 absolute flex justify-center items-center">
          <div className="w-5/6 h-fit bg-slate-200 border p-4 rounded-lg">
          <h3 className="title">Choose Category</h3>
            <div className="flex flex-col gap-2 bg-red-500 h-1/2 mb-4">
              <p>Asd</p>
              <p>Asd</p>
              <p>Asd</p>
              <p>Asd</p>
              <p>Asd</p>
              <p>Asd</p>
              <p>Asd</p>
            </div>
            <Button isButton isPrimary isBLock title="Choose" onClick={()=>setSelectCategory(false)}/>
          </div>
        </motion.div>
        }
        </AnimatePresence>
        </>
        }

        {showModal.context === "Edit Product" && 
        <h3>Edit</h3>
        }

      </Modal>
    </>
  )
}
