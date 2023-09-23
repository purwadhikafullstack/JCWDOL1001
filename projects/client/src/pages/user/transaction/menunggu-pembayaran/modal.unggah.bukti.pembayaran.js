import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadPaymentProof } from "../../../../store/slices/transaction/slices";
import Button from "../../../../components/Button";
import InputImage from "../../../../components/InputImage";


export default function ModalUnggahBuktiPembayaran({
    selectedTransaction, 
    handleCloseModal, 
    isUpdateOngoingTransactionLoading 
  }) {
  const dispatch = useDispatch
  const [file, setFile] = useState(null);

  const formData = new FormData();

  const uploadImage = () => {

    formData.append("file", file);
    dispatch(uploadPaymentProof({
        transactionId : selectedTransaction.transactionId,
        imageData: formData
      })
    );

  };
  return (
    <>
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

        {file && <Button isButton isLoading={isUpdateOngoingTransactionLoading} isPrimary title={`Unggah Bukti Pembayaran`} onClick={uploadImage}/>}
      </div>
    </>
  )
}
