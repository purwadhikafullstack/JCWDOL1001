import Button from "../../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { processOrder } from "../../../../store/slices/transaction/slices";
import Message from "../../../../components/Message";

export default function ModalKonfirmasi({
  handleShowModal,
  handleCloseModal,
  selectedTransaction,
  isUpdateOngoingTransactionLoading,
}) {
  const dispatch = useDispatch();
  const {
    successUpdateOngoingTransaction
  } = useSelector((state) => {
    return {
      successUpdateOngoingTransaction: state.transaction?.successUpdateOngoingTransaction,
    };
  });

  const handleProcessOrder = () =>
    dispatch(
      processOrder(selectedTransaction.transactionId)
    );

  return (
    successUpdateOngoingTransaction ? 
    <Message
      type={`success`} 
      message={`Berhasil melanjutkan ke Proses Pesanan`} 
      handleCloseModal={() => handleCloseModal(4)}
    />
    :
    <div className="flex flex-col items-center">
      <p className="font-semibold">Lanjutkan ke Proses Pesanan?</p>

      <div className="mt-2 flex justify-end gap-2">
        <Button
          isButton
          isDisabled={isUpdateOngoingTransactionLoading}
          isDanger
          onClick={() =>
            handleShowModal(
              "Detail Transaksi",
              selectedTransaction.transactionId
            )
          }
          title={`Tidak`}
        />

        <Button
          isButton
          isPrimary
          isLoading={isUpdateOngoingTransactionLoading}
          title={`Ya, Lanjutkan`}
          onClick={handleProcessOrder}
        />
      </div>
    </div>
  );
}
