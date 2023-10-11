import Button from "../../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { confirmPayment } from "../../../../store/slices/transaction/slices";
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

  const handleConfirmPayment = () =>
    dispatch(
      confirmPayment(selectedTransaction.transactionId)
    );

  return (
    successUpdateOngoingTransaction ? 
    <Message
      type={`success`} 
      message={`Pembayaran berhasil diterima!`} 
      handleCloseModal={() => handleCloseModal(3)}
    />
    :
    <div className="flex flex-col items-center">
      <p className="font-semibold text-center">Apa anda yakin untuk menerima pembayaran?</p>

      <div className="mt-4 flex justify-end gap-2">
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
          onClick={handleConfirmPayment}
        />
      </div>
    </div>
  );
}
