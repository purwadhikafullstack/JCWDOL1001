import { useDispatch } from "react-redux";
import Button from "../../../components/Button";
import { updatePrimaryAddress } from "../../../store/slices/address/slices";

export default function ChangePrimaryAddressPage({
  selectedAddress,
  isSubmitAddressLoading,
  handleCloseAddressPageAction,
  setIsToastVisible
}) {
  const dispatch = useDispatch();

  const handleChangePrimaryAddress = (id) => {
    dispatch(updatePrimaryAddress(id));

    setTimeout(()=>{
      setIsToastVisible(false)
    }, 2000)
  };

  return (
    <>
      <h3 className="title">Ubah Alamat Utama</h3>

      <div className="mt-4 rounded-lg border border-warning p-4 shadow-md">
        <p>{selectedAddress.address}</p>
        <p>{selectedAddress.district}, {selectedAddress.city}, {selectedAddress.province}, {selectedAddress.postalCode}</p>
        <p>{selectedAddress.contactPhone} ({selectedAddress.contactName})</p>
      </div>

      <div className="flex flex-col items-center justify-center mt-4">
        <p className="text-center">
          Apa kamu yakin ingin menjadikan alamat ini sebagai alamat utama?
        </p>

        <div className="mt-4 flex justify-end gap-2">
          {!isSubmitAddressLoading && (
            <Button
              title="Gak"
              isButton
              isSecondary
              onClick={handleCloseAddressPageAction}
            />
          )}
          <Button
            title="Ya, Jadikan Alamat Utama"
            isButton
            isWarning
            isLoading={isSubmitAddressLoading}
            onClick={() => {
              handleChangePrimaryAddress(selectedAddress.addressId)
              setIsToastVisible(true)
            }}
          />
        </div>
      </div>
    </>
  );
}
