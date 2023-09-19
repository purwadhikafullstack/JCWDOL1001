import { useDispatch } from "react-redux";
import Button from "../../../components/Button";
import { updatePrimaryAddress } from "../../../store/slices/address/slices";

export default function ChangePrimaryAddressPage({
  selectedAddress,
  isSubmitAddressLoading,
  handleCloseAddressPageAction,
}) {
  const dispatch = useDispatch();

  const handleChangePrimaryAddress = (id) => {
    dispatch(updatePrimaryAddress(id));
  };

  return (
    <>
      <h3 className="title">Ubah Alamat Utama</h3>

      <div className="mt-4 rounded-lg border border-warning p-4 shadow-md">
        <p>{selectedAddress.district}</p>
        <p>{selectedAddress.city}</p>
        <p>{selectedAddress.province}</p>
        <p>{selectedAddress.postalCode}</p>

        <h3 className="font-bold mt-4">Detail Alamat:</h3>
        <p>{selectedAddress.address}</p>
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
            onClick={() => handleChangePrimaryAddress(selectedAddress.addressId)}
          />
        </div>
      </div>
    </>
  );
}
