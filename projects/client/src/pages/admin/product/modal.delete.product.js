import Button from "../../../components/Button";
import SuccessMessage from "../../../components/Message";

export default function ModalDeleteProduct({
  success,
  selectedProduct,
  handleCloseModal,
  handleDeleteProduct,
  isDeleteProductLoading,
}) {
  if (success) {
    return (
      <SuccessMessage
        message={`Product ${selectedProduct.productName} deleted successfully`}
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
