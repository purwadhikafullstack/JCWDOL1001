import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPaymentProof } from "../../../../store/slices/transaction/slices";
import Button from "../../../../components/Button";
import InputImage from "../../../../components/InputImage";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import Message from "../../../../components/Message";

export default function ModalCaraBayar({
  selectedTransaction,
  handleCloseModal,
  isUpdateOngoingTransactionLoading,
}) {
  const dispatch = useDispatch();
  const { successUpdateOngoingTransaction } = useSelector((state) => {
    return {
      successUpdateOngoingTransaction: state.transaction?.successUpdateOngoingTransaction,
    };
  });
  
  const [file, setFile] = useState(null);

  const formData = new FormData();

  const uploadImage = () => {
    formData.append("file", file);
    dispatch(
      uploadPaymentProof({
        transactionId: selectedTransaction.transactionId,
        imageData: formData,
      })
    );
  };

  if (successUpdateOngoingTransaction) {
    return <Message
      type={`success`} 
      message={`Bukti pembayaranmu berhasil diunggah!`} 
      handleCloseModal={() => handleCloseModal(2)}
    />
  }

  return (
    <div className="overflow-auto max-h-[75vh] pb-4">
      <div className="">
        <div className="p-4 bg-green-100 border border-primary rounded-lg flex gap-2 items-center">
          <div className="">
            <HiOutlineInformationCircle className="text-primary text-3xl"/>
          </div>
          <div className="">
            <p>Lakukan pembayaran dengan cara transfer bank.</p>
            <p>Kemudian unggah bukti pembayaran kamu</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="">
            <p className="font-bold">0918023981</p>
            <p>Apotech Sehat</p>
          </div>
          <p>BCA</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="">
            <p className="font-bold">0918023981</p>
            <p>Apotech Sehat</p>
          </div>
          <p>Mandiri</p>
        </div>

      </div>
      <InputImage file={file} setFile={setFile} />
      <div className="mt-4 flex justify-center gap-2">
        <Button
          isButton
          isPrimaryOutline
          isDisabled={isUpdateOngoingTransactionLoading}
          title={`Kembali`}
          onClick={() => {
            handleCloseModal();
            setFile(null);
          }}
        />

        {file && (
          <Button
            isButton
            isLoading={isUpdateOngoingTransactionLoading}
            isPrimary
            title={`Unggah Bukti Pembayaran`}
            onClick={uploadImage}
          />
        )}
      </div>
    </div>
  );
}
