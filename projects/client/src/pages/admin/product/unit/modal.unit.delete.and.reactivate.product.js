import { useDispatch } from "react-redux";
import Button from "../../../../components/Button";
import SuccessMessage from "../../../../components/Message";
import { deleteUnit, reactivateUnit } from "../../../../store/slices/product/unit/slices";

export default function ModalDeleteAndReactiveUnit({
  messageInput,
  success,
  selectedUnit,
  handleCloseModal,
  handleShowModal,
  isDeleteProductLoading,
}) {
  const dispatch = useDispatch()

  const handleDeleteUnit = ({stockId , productId}) => {
    dispatch(deleteUnit({stockId , productId}))
  }

  const handleReactivateUnit = ({stockId , productId}) => {
    dispatch(reactivateUnit({stockId , productId}))
  }

  if (success) {
    return (
      <SuccessMessage
        type="success"
        message={
          `${messageInput.split(" ")[0] === "reactivate" 
          ? `Reactive of product unit ${selectedUnit.name} success` 
          : `Product unit ${selectedUnit.name} has been delete`}`}
        handleCloseModal={handleCloseModal}
      />
    );
  }

  return (
    <>
      <p className="modal-text">
        Are you sure want to {messageInput} 
        <span className="font-bold"> {selectedUnit.name} ?</span>
      </p>

      <div className="mt-4 flex justify-end gap-2">
        {!isDeleteProductLoading && (
          <Button 
            title="No" 
            isButton 
            isSecondary 
            onClick={() =>
              handleShowModal({
                context : "Edit Unit", 
                productId : selectedUnit.product_detail.productId
              })
            }
          />
        )}
        <Button
          title="Yes"
          isButton
          isDanger
          isLoading={isDeleteProductLoading}
          onClick={() => 
            messageInput.split(" ")[0] === "reactivate" 
            ? handleReactivateUnit({
                productId : selectedUnit.product_detail.productId,
                stockId : selectedUnit.product_detail.stockId
              })
            : handleDeleteUnit({
                productId : selectedUnit.product_detail.productId,
                stockId : selectedUnit.product_detail.stockId
              })
          }
        />
      </div>
    </>
  );
}
