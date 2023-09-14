import { useDispatch } from "react-redux"
import Button from "../../../../components/Button"
import SuccessMessage from "../../../../components/Message"
import { deleteDiscount, getDiscount } from "../../../../store/slices/discount/slices.js"


export default function ModalDeleteDiscount({
  success,
  name,
  id,
  handleCloseModal,
  isDeleteLoading
}) {

  const dispatch = useDispatch()

  if (success) {
    return (
      <SuccessMessage
        type="success"
        message={`${name} discount has been delete`}
        handleCloseModal={handleCloseModal}
      />
    )
  }

  return (
    <>  
        <p className="modal-text">
            Are you sure to delete discount name : 
            <span className="font-bold"> {name}</span>?
            <p className="modal-text">
            You won't be able to undo the changes after deleting.
            </p>
        </p>

        <div className="mt-4 flex justify-end gap-2">
            
            <Button title="No" isButton isSecondary onClick={handleCloseModal} />
            <Button
                title="Yes"
                isButton
                isDanger
                isLoading={isDeleteLoading}
                onClick={() => dispatch(deleteDiscount(id))}
            />
        </div>
    </>
  )
}
