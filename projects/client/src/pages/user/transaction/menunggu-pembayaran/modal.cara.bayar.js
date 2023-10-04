import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPaymentProof } from "../../../../store/slices/transaction/slices";
import Button from "../../../../components/Button";
import InputImage from "../../../../components/InputImage";
import { HiOutlineDocumentDuplicate, HiOutlineInformationCircle } from "react-icons/hi2";
import Message from "../../../../components/Message";
import formatNumber from "../../../../utils/formatNumber";
import LogoBca from "../../../../assets/logo-bca.png";
import LogoMandiri from "../../../../assets/logo-mandiri.png";
import { toast } from "react-toastify"
import Countdown from "../../../../components/Countdown";

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
  const [showInputImage, setShowInputImage] = useState(true);

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

  const [isCopyTextSuccess, setIsCopyTextSuccess] = useState(false)
  const copyText = (text) => {
    setIsCopyTextSuccess(true)
    navigator.clipboard.writeText(text)
    toast.success("Berhasil menyalin!")

    setTimeout(() => {
      setIsCopyTextSuccess(false);
    }, 2000);
  }

  if (successUpdateOngoingTransaction) {
    return <Message
      type={`success`} 
      message={`Bukti pembayaranmu berhasil diunggah!`} 
      handleCloseModal={() => handleCloseModal(2)}
    />
  }

  const createdAt = new Date(selectedTransaction?.createdAt).getTime() + 24 * 3600000;
  const date = new Date().getTime();

  return (
    <div className="overflow-auto max-h-screen pb-8 md:pr-1">
      <div className="flex flex-col gap-4 mt-4">
        <div className="p-4 bg-green-100 border border-primary rounded-lg flex gap-2 items-center">
          <div className="">
            <HiOutlineInformationCircle className="text-primary text-3xl"/>
          </div>
          <div className="">
            <p>Lakukan pembayaran dengan cara transfer bank.</p>
            <p>Kemudian unggah bukti pembayaran kamu</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-2 border border-warning rounded-lg font-semibold text-xl">
            <Countdown expired={selectedTransaction.expired}/>
          </div>
        </div>
        
        <h3 className="subtitle text-center">Total Pembayaran: <span className="text-primary">Rp. {formatNumber(selectedTransaction.total)}</span></h3>

        <div className="w-fit mx-auto">
          <div className="flex items-center gap-6 border border-primary rounded-md p-4">
            <div className="w-20">
              <img src={LogoBca} alt="" />
            </div>
            <div className="">
              <Button
                isBLock
                className="flex justify-between items-center" 
                isDisabled={isCopyTextSuccess}
                onClick={() => copyText('0918023981')}
              >
                <p className="font-bold">0918023981</p>
                <HiOutlineDocumentDuplicate
                  className="text-primary text-lg"
                />
              </Button>
              <p>Apotech Pasti Sukses</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 border border-primary rounded-md p-4">
            <div className="w-20">
              <img src={LogoMandiri} alt="" />
            </div>
            <div className="">
              <Button
                isBLock
                className="flex justify-between items-center"
                isDisabled={isCopyTextSuccess}
                onClick={() => copyText('1234567890')}
              >
                <p className="font-bold">1234567890</p>
                <HiOutlineDocumentDuplicate
                  className="text-primary text-lg"
                />
              </Button>
              <p>Apotech Pasti Sukses</p>
            </div>
          </div>
        </div>
        { date < createdAt &&
          <InputImage file={file} setFile={setFile} />
        }
      </div>
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
