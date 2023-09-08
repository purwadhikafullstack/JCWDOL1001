import { useDispatch } from "react-redux";
import Button from "../../../../components/Button";
import SuccessMessage from "../../../../components/Message";
import { deleteUnit } from "../../../../store/slices/product/unit/slices";

export default function ModalDeleteUnit({
  success,
  selectedUnit,
  handleCloseModal,
  handleShowModal,
  isDeleteProductLoading,
}) {
  const dispatch = useDispatch()
  const handleDeleteUnit = ({stockId , productId}) => {
    dispatch(deleteUnit({stockId , productId}));
  };
  if (success) {
    return (
      <SuccessMessage
        type="success"
        message={`${selectedUnit.name} deleted successfully`}
        handleCloseModal={handleCloseModal}
      />
    );
  }

  return (
    <>
      <p className="modal-text">
        Are you sure to delete{" "}
        <span className="font-bold">unit {selectedUnit.name}</span>?{" "}
        <p className="modal-text">
          You won't be able to undo the changes after deleting.
        </p>
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
          onClick={() => handleDeleteUnit({
            productId : selectedUnit.product_detail.productId,
            stockId : selectedUnit.product_detail.stockId
          })}
        />
      </div>
    </>
  );
}
