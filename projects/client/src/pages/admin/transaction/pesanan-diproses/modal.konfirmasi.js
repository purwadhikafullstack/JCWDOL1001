import Button from "../../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { sendOrder } from "../../../../store/slices/transaction/slices";
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
      sendOrder(selectedTransaction.transactionId)
    );

  return (
    successUpdateOngoingTransaction ? 
    <Message
      type={`success`} 
      message={`Berhasil mengirimkan pesanan!`} 
      handleCloseModal={() => handleCloseModal(5)}
    />
    :
    <div className="flex flex-col items-center">
      <p className="font-semibold">Lanjutkan untuk mengirimkan pesanan?</p>

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
