import { useDispatch } from "react-redux";
import Button from "../../../components/Button";
import SuccessMessage from "../../../components/Message";
import { deleteProduct } from "../../../store/slices/product/slices";

export default function ModalDeleteProduct({
  success,
  selectedProduct,
  handleCloseModal,
  isDeleteProductLoading,
}) {

  const dispatch = useDispatch()
  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };
  if (success) {
    return (
      <SuccessMessage
        type="success"
        message={`${selectedProduct.productName} deleted successfully`}
        handleCloseModal={handleCloseModal}
      />
    );
  }

  return (
    <>
      <p className="modal-text">
        Are you sure to delete{" "}
        <span className="font-bold">{selectedProduct?.productName}</span>?{" "}
        <p className="modal-text">
          You won't be able to undo the changes after deleting.
        </p>
      </p>

      <div className="mt-4 flex justify-end gap-2">
        {!isDeleteProductLoading && (
          <Button title="No" isButton isSecondary onClick={handleCloseModal} />
        )}
        <Button
          title="Yes"
          isButton
          isDanger
          isLoading={isDeleteProductLoading}
          onClick={() => handleDeleteProduct(selectedProduct.productId)}
        />
      </div>
    </>
  );
}
