import { useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { rejectPayment } from "../../../../store/slices/transaction/slices";
import Message from "../../../../components/Message";

export default function ModalTolakPembayaran({
  handleShowModal,
  handleCloseModal,
  selectedTransaction,
  isUpdateOngoingTransactionLoading,
}) {
  const dispatch = useDispatch();
  const {
    successCancelTransaction
  } = useSelector((state) => {
    return {
      successCancelTransaction: state.transaction?.successCancelTransaction,
    };
  });
  const [chooseReasonRef, setChooseReasonRef] = useState(null);
  const [inputReasonRef, setInputReasonRef] = useState(null);
  const reasons = [
    { title: "Pembayaran tidak tesuai" },
  ];

  const chooseReason = (e) => {
    setInputReasonRef(null);
    setChooseReasonRef(e.target.value);
  };

  const handleInputReason = (e) => {
    const inputVal = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
    e.target.value = inputVal;

    setInputReasonRef(inputVal);
  };

  const handleCancelOrder = () =>
    dispatch(
      rejectPayment({
        transactionId: selectedTransaction.transactionId,
        message: inputReasonRef ? inputReasonRef : chooseReasonRef,
      })
    );

  return (
    successCancelTransaction ? 
    <Message
      type={`success`} 
      message={`Pembayaran berhasil ditolak!`} 
      handleCloseModal={() => handleCloseModal(1)}
    />
    :
    <div>
      <p className="font-semibold">Pilih alasan penolakan:</p>

      <div className="mt-2 flex flex-col gap-2">
        {reasons.map((reason, index) => (
          <div className="flex items-center" onClick={chooseReason}>
            <input
              id={index}
              type="radio"
              value={reason.title}
              name="reason"
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600"
            />
            <label htmlFor={index} className="ml-2 w-full">
              {reason.title}
            </label>
          </div>
        ))}
      </div>

      {chooseReasonRef === "Lainnya" && (
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Berikan alasanmu (opsional)"
            onChange={handleInputReason}
          />
        </div>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <Button
          isButton
          isDisabled={isUpdateOngoingTransactionLoading}
          isPrimary
          onClick={() =>
            handleShowModal(
              "Detail Transaksi",
              selectedTransaction.transactionId
            )
          }
          title={`Kembali`}
        />

        <Button
          isButton
          isLoading={isUpdateOngoingTransactionLoading}
          isWarning={chooseReasonRef}
          isSecondary={!chooseReasonRef}
          isDisabled={!chooseReasonRef}
          title={`Tolak Pembayaran`}
          onClick={handleCancelOrder}
        />
      </div>
    </div>
  );
}
