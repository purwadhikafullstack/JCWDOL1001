import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAddress } from "../../../store/slices/address/slices";

import Button from "../../../components/Button";
import DeleteAddressPage from "./page.delete.address";
import InputAddressPage from "./page.input.address";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function Address({
  user,
  showHandleAddressPage,
  setShowHandleAddressPage,
}) {
  const dispatch = useDispatch();

  const { profile, address, isGetAddressLoading, isSubmitAddressLoading } =
    useSelector((state) => {
      return {
        profile: state.auth.profile,
        address: state.address.data,
        isGetAddressLoading: state?.address?.isGetAddressLoading,
        isSubmitAddressLoading: state?.address?.isSubmitAddressLoading,
      };
    });

  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleShowAddressPageAction = (action, addressId) => {
    setShowHandleAddressPage({ show: true, action });

    window.scrollTo({
      top: 0,
    });

    if (addressId) {
      const addressData = address.find((item) => item.addressId === addressId);
      setSelectedAddress(addressData);
    }
  };

  const handleCloseAddressPageAction = () => {
    setShowHandleAddressPage({ show: false, action: "" });
    setSelectedAddress(null);
  };

  useEffect(() => {
    setShowHandleAddressPage({ show: false, action: "" });
  }, []);

  useEffect(() => {
    dispatch(getAddress());
    setShowHandleAddressPage({ show: false, action: "" });
  }, [isSubmitAddressLoading]);

  if (!showHandleAddressPage.show) {
    return (
      <>
        {isGetAddressLoading ? (
          <>
            <div className="mt-40 flex items-center justify-center">
              <LoadingSpinner isSmall />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="title">Alamat</h3>

              <Button
                isButton
                isPrimary
                title={`Tambah Alamat Baru`}
                onClick={() =>
                  handleShowAddressPageAction("Tambah Alamat Baru")
                }
              />
            </div>

            {address?.map((data, index) => (
              <div key={index} className="mt-4 rounded-lg border p-4 shadow-md">
                <p>{data.district}</p>
                <p>{data.city}</p>
                <p>{data.province}</p>
                <p>{data.postalCode}</p>

                <h3 className="font-bold mt-4">Detail Alamat:</h3>
                <p>{data.address}</p>
                <div className="flex justify-end gap-2    ">
                  <Button
                    isButton
                    isPrimaryOutline
                    title="Ubah Alamat"
                    onClick={() =>
                      handleShowAddressPageAction("Ubah Alamat", data.addressId)
                    }
                  />
                  {address.length > 1 && (
                    <Button
                      isButton
                      isDanger
                      title="Hapus Alamat"
                      onClick={() =>
                        handleShowAddressPageAction(
                          "Hapus Alamat",
                          data.addressId
                        )
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </>
    );
  }

  if (
    showHandleAddressPage.show &&
    showHandleAddressPage.action === "Tambah Alamat Baru"
  ) {
    return (
      <InputAddressPage
        addressData={selectedAddress}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
        action={showHandleAddressPage.action}
      />
    );
  }

  if (
    showHandleAddressPage.show &&
    showHandleAddressPage.action === "Hapus Alamat"
  ) {
    return (
      <DeleteAddressPage
        selectedAddress={selectedAddress}
        isSubmitAddressLoading={isSubmitAddressLoading}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
      />
    );
  }
}
