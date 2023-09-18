import { useDispatch } from "react-redux";
import Button from "../../../components/Button";
import { deleteAddress } from "../../../store/slices/address/slices";

export default function DeleteAddressPage({
  selectedAddress,
  isSubmitAddressLoading,
  handleCloseAddressPageAction,
}) {
  const dispatch = useDispatch();

  const handleDeleteProduct = (id) => {
    dispatch(deleteAddress(id));
  };

  return (
    <>
      <div className="mt-4 rounded-lg border border-danger p-4 shadow-md">
        <p>{selectedAddress.district}</p>
        <p>{selectedAddress.city}</p>
        <p>{selectedAddress.province}</p>
        <p>{selectedAddress.postalCode}</p>

        <h3 className="font-bold mt-4">Detail Alamat:</h3>
        <p>{selectedAddress.address}</p>
      </div>

      <div className="flex flex-col items-center justify-center mt-4">
        <p className="text-center">
          Apa kamu yakin ingin menghapus alamat ini?
        </p>
        <p className="text-center text-danger">
          Kamu tidak akan bisa melakukan perubahan setelah menghapus alamat ini.
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
            title="Ya, hapus"
            isButton
            isDanger
            isLoading={isSubmitAddressLoading}
            onClick={() => handleDeleteProduct(selectedAddress.addressId)}
          />
        </div>
      </div>
    </>
  );
}
