import Button from "../../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { receiveOrder } from "../../../../store/slices/transaction/slices";
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
      receiveOrder(selectedTransaction.transactionId)
    );

  return (
    successUpdateOngoingTransaction ? 
    <Message
      type={`success`} 
      message={`Terima kasih telah berbelanja di Apotech!`} 
      handleCloseModal={() => handleCloseModal(6)}
    />
    :
    <div className="flex flex-col items-center">
      <p className="font-semibold">Apakah pesananmu sudah diterima dengan benar?</p>

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
          title={`Ya, Sudah`}
          onClick={handleProcessOrder}
        />
      </div>
    </div>
  );
}
