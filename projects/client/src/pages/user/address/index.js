import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAddress, listProvince } from "../../../store/slices/address/slices";

import Button from "../../../components/Button";
import DeleteAddressPage from "./page.delete.address";
import InputAddressPage from "./page.input.address";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ChangePrimaryAddressPage from "./page.change.primary.address";

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
    dispatch(listProvince());

  }, []);

  useEffect(() => {
    dispatch(getAddress());
    setShowHandleAddressPage({ show: false, action: "" });
  }, [isSubmitAddressLoading]);

  if (!showHandleAddressPage.show) {
    return (
      <div className=" pb-24 lg:pb-0">
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

            {address?.length === 0 ?
            <div className="text-center">
              <h3 className="mt-20 text-slate-500">Kamu belum memiliki data alamat!</h3>
              <h3 className="text-slate-500">Silakan tambahkan alamatmu agar kami dapat mengirim pesananmu :)</h3>
            </div>
            :
              address?.map((data, index) => (
                <div key={index} className={`mt-4 rounded-lg border p-4 shadow-md ${data.isPrimary === 1 && "border-primary"}`}>
                  {data.isPrimary === 1 &&
                    <p className="font-semibold text-primary mb-2">Alamat Utama</p>
                  }

                  <p>{data.address}</p>
                  <p>{data.district}, {data.city}, {data.province}, {data.postalCode}</p>
                  <p>{data.contactPhone} ({data.contactName})</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      isButton
                      isPrimaryOutline
                      title="Ubah Alamat"
                      onClick={() =>
                        handleShowAddressPageAction("Ubah Alamat", data.addressId)
                      }
                    />
                    {data.isPrimary !== 1 && (
                      <>
                        <Button
                          isButton
                          isWarningOutline
                          title="Jadikan Alamat Utama"
                          onClick={() =>
                            handleShowAddressPageAction(
                              "Ubah Alamat Utama",
                              data.addressId
                              )
                            }
                        />

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
                      </>
                    )}
                  </div>
                </div>
              ))
            }    
          </>
        )}
      </div>
    );
  }

  if (
    showHandleAddressPage.action === "Tambah Alamat Baru" || showHandleAddressPage.action === "Ubah Alamat"
  ) {
    return (
      <InputAddressPage
        addressData={selectedAddress}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
        action={showHandleAddressPage.action}
      />
    );
  }

  if (showHandleAddressPage.action === "Hapus Alamat") {
    return (
      <DeleteAddressPage
        selectedAddress={selectedAddress}
        isSubmitAddressLoading={isSubmitAddressLoading}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
      />
    );
  }

  if (showHandleAddressPage.action === "Ubah Alamat Utama") {
    return (
      <ChangePrimaryAddressPage
        selectedAddress={selectedAddress}
        isSubmitAddressLoading={isSubmitAddressLoading}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
      />
    );
  }
}
