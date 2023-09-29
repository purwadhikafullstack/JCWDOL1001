import { useDispatch } from "react-redux"
import Button from "../../../../components/Button"
import SuccessMessage from "../../../../components/Message"
import { deleteDiscount, getDiscount } from "../../../../store/slices/discount/slices.js"


export default function ModalDeleteDiscount({
  success,
  selectedDiscount,
  handleCloseModal,
  isDeleteLoading
}) {

  const dispatch = useDispatch()

  if (success) {
    return (
      <SuccessMessage
        type="success"
        message={`Diskon produk ${selectedDiscount.discountName} telah dihapus`}
        handleCloseModal={handleCloseModal}
      />
    )
  }

  return (
    <>  
        <p className="modal-text">
            Apa kamu yakin ingin menghapus diskon : 
            <span className="font-bold"> {selectedDiscount.discountName}</span>?
            <p className="modal-text">
            Kamu tidak akan bisa melakukan perubahan apapun setelah menghapus
            </p>
        </p>

        <div className="mt-4 flex justify-end gap-2">
            
            <Button title="Tidak" isButton isSecondary onClick={handleCloseModal} />
            <Button
                title="Ya, Hapus"
                isButton
                isDanger
                isLoading={isDeleteLoading}
                onClick={() => dispatch(deleteDiscount(selectedDiscount.discountId))}
            />
        </div>
    </>
  )
}
