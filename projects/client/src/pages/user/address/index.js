import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAddress } from "../../../store/slices/address/slices";

import Button from "../../../components/Button";
import DeleteAddressPage from "./page.delete.address";
import InputAddressPage from "./page.input.address";
import ChangePrimaryAddressPage from "./page.change.primary.address";
import Pagination from "../../../components/PaginationV2";

export default function Address({
  showHandlePageContext,
  setShowHandlePageContext,
}) {
  const dispatch = useDispatch();

  const { address, isGetAddressLoading, isSubmitAddressLoading, totalPage, currentPage } =
    useSelector((state) => {
      return {
        address: state.address.data,
        totalPage: state.address.totalPage,
        currentPage: state.address.currentPage,
        isGetAddressLoading: state?.address?.isGetAddressLoading,
        isSubmitAddressLoading: state?.address?.isSubmitAddressLoading,
      };
    });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [page, setPage] = useState(1);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleShowAddressPageAction = (action, addressId) => {
    setShowHandlePageContext({ show: true, action });

    window.scrollTo({
      top: 0,
    });

    if (addressId) {
      const addressData = address.find((item) => item.addressId === addressId);
      setSelectedAddress(addressData);
    }
  };

  const handleCloseAddressPageAction = () => {
    setShowHandlePageContext({ show: false, action: "" });
    setSelectedAddress(null);
  };

useEffect(() => {
  dispatch(getAddress(page))
    
  setShowHandlePageContext({ show: false, action: "" });
}, [isSubmitAddressLoading, page]);

  if (isGetAddressLoading) {
    return (
      Array.from({length : 3}, (_, index)=>(
        <div key={index} className="mt-4 shadow-md animate-pulse h-40 border rounded-lg p-4 flex flex-col justify-between">
          <div className="h-4 md:w-1/2 bg-slate-300 rounded-lg"></div>
          <div className="h-4 w-2/3 md:w-1/3 bg-slate-400 rounded-lg"></div>
          <div className="h-4 w-3/4 md:w-1/4 bg-slate-300 rounded-lg"></div>
          <div className="h-4 md:w-1/3 bg-slate-400 rounded-lg"></div>
        </div>
      ))
    )
  }

  if (!showHandlePageContext.show) {
    return (
      <div className=" pb-24 lg:pb-0">
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
                    isDisabled={isToastVisible}
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
        {totalPage > 1 &&
          <div className="flex justify-center mt-4">
            <Pagination currentPage={currentPage} setPage={setPage} totalPage={totalPage}/>
          </div>
        }
      </div>
    );
  }

  if (
    showHandlePageContext.action === "Tambah Alamat Baru" || showHandlePageContext.action === "Ubah Alamat"
  ) {
    return (
      <InputAddressPage
        addressData={selectedAddress}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
        action={showHandlePageContext.action}
      />
    );
  }

  if (showHandlePageContext.action === "Hapus Alamat") {
    return (
      <DeleteAddressPage
        selectedAddress={selectedAddress}
        isSubmitAddressLoading={isSubmitAddressLoading}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
      />
    );
  }

  if (showHandlePageContext.action === "Ubah Alamat Utama") {
    return (
      <ChangePrimaryAddressPage
        selectedAddress={selectedAddress}
        isSubmitAddressLoading={isSubmitAddressLoading}
        handleCloseAddressPageAction={handleCloseAddressPageAction}
        setIsToastVisible={setIsToastVisible}
      />
    );
  }
}
