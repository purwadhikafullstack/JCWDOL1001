import { useDispatch } from "react-redux";
import Button from "../../../../components/Button";
import Message from "../../../../components/Message";
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
      <Message
        type="success"
        message={
          `${messageInput.split(" ")[0] === "aktifkan" 
          ? `Satuan ${selectedUnit.name} berhasil diaktifkan` 
          : `Satuan ${selectedUnit.name} berhasil dihapus`}`}
        handleCloseModal={handleCloseModal}
      />
    );
  }

  return (
    <>
      <p className="modal-text">
        Apakah kamu yakin untuk {messageInput} 
        <span className="font-bold"> {selectedUnit.name} ?</span>
      </p>

      <div className="mt-4 flex justify-end gap-2">
        {!isDeleteProductLoading && (
          <Button 
            title="Tidak" 
            isButton 
            isSecondary 
            onClick={() =>
              handleShowModal({
                context : "Ubah Satuan", 
                productId : selectedUnit.product_detail.productId
              })
            }
          />
        )}
        <Button
          title="Yakin"
          isButton
          isDanger
          isLoading={isDeleteProductLoading}
          onClick={() => 
            messageInput.split(" ")[0] === "aktifkan" 
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
