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
        message={`Produk ${selectedProduct.productName} berhasil dihapus!`}
        handleCloseModal={handleCloseModal}
      />
    );
  }

  return (
    <>
      <p className="modal-text">
        Apa kamu yakin ingin menghapus produk{" "}
        <span className="font-bold">{selectedProduct?.productName}</span>?{" "}
        <p className="modal-text text-danger">
          Kamu tidak akan bisa melakukan perubahan apapun setelah menghapus produk ini
        </p>
      </p>

      <div className="mt-4 flex justify-end gap-2">
        {!isDeleteProductLoading && (
          <Button title="Tidak" isButton isSecondary onClick={handleCloseModal} />
        )}
        <Button
          title="Ya, Hapus"
          isButton
          isDanger
          isLoading={isDeleteProductLoading}
          onClick={() => handleDeleteProduct(selectedProduct.productId)}
        />
      </div>
    </>
  );
}
