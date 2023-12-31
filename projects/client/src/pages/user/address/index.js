import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getAddress } from "../../../store/slices/address/slices";

import Button from "../../../components/Button";
import DeleteAddressPage from "./page.delete.address";
import InputAddressPage from "./page.input.address";
import ChangePrimaryAddressPage from "./page.change.primary.address";
import Pagination from "../../../components/PaginationV2";
import Loading from "./components/component.loading";
import Input from "../../../components/Input";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

export default function Address({
  showHandlePageContext,
  setShowHandlePageContext,
  user,
}) {
  const dispatch = useDispatch();

  const {
    address,
    isGetAddressLoading,
    isSubmitAddressLoading,
    totalPage,
    currentPage,
  } = useSelector((state) => {
    return {
      address: state.address.data,
      totalPage: state.address.totalPage,
      currentPage: state.address.currentPage,
      isGetAddressLoading: state?.address?.isGetAddressLoading,
      isSubmitAddressLoading: state?.address?.isSubmitAddressLoading,
    };
  });

  const searchRef = useRef(null);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [page, setPage] = useState(1);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [search, setSearch] = useState(null)

  const handleSearch = (event) => {
    setPage(1)
    event.preventDefault();
    setSearch(searchRef.current?.value)
  };

  const clearSearch = () => {
    setSearch(null)
    setPage(1)

    searchRef.current.value = "";
  }

  const handleShowAddressPageAction = (action, addressId) => {
    setShowHandlePageContext({ show: true, action });

    window.scrollTo({
      top: 0,
    });

    if (addressId) {
      const addressData = address.find((item) => item.addressId === addressId);
      setSelectedAddress(addressData);
    } else {
      setSelectedAddress(null)
    }
  };

  const handleCloseAddressPageAction = () => {
    setShowHandlePageContext({ show: false, action: "" });
    setSelectedAddress(null);
  };

  useEffect(() => {
    dispatch(getAddress({
      page,
      address : search
    }));

    setShowHandlePageContext({ show: false, action: "" });
  }, [isSubmitAddressLoading, page, search]);

  if (!showHandlePageContext.show) {
    return (
      <div className=" pb-24 lg:pb-0">
        <div className="flex items-center justify-between">
          <h3 className="title">Alamat</h3>

          <Button
            isButton
            isPrimary
            isDisabled={user?.status === 0}
            title={`Tambah Alamat Baru`}
            onClick={() => handleShowAddressPageAction("Tambah Alamat Baru", null)}
          />
        </div>

        <form
          className="relative w-full lg:w-1/3 mt-2"
          onSubmit={(e) => {
            handleSearch(e);
          }}
        >
          <Input
            ref={searchRef}
            type="text"
            placeholder="Cari alamat"
            className="pr-16"
          />
          <Button
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
            type="submit"
          >
            <HiMagnifyingGlass className="text-2xl text-primary" />
          </Button>
        {search && 
          <Button
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2"
            onClick={clearSearch}
          >
            <HiXMark className="text-2xl text-primary" />
          </Button>
        }
        </form>

        {
        isGetAddressLoading ? 
          (<Loading />)
          :
          address?.length === 0 ? (
            user?.status === 0 ? (
              <div className="text-center">
                <h3 className="mt-20 text-slate-500">
                  Yah! akunmu belum terverifikasi :(
                </h3>
                <h3 className="text-slate-500">
                  Yuk, verifikasi dulu agar kamu bisa menambahkan alamat :)
                </h3>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="mt-20 text-slate-500">
                  Kamu belum memiliki data alamat!
                </h3>
                <h3 className="text-slate-500">
                  Yuk, tambahkan alamatmu agar kami dapat mengirim pesananmu :)
                </h3>
              </div>
            )
          ) : (
            address?.map((data, index) => (
              <div
                key={index}
                className={`mt-4 rounded-lg border p-4 shadow-md ${
                  data.isPrimary === 1 && "border-primary"
                }`}
              >
                {data.isPrimary === 1 && (
                  <p className="mb-2 font-semibold text-primary">Alamat Utama</p>
                )}

                <p className="font-semibold">{data.contactName}</p>
                <p>{data.address}</p>
                <p>
                  {data.district}, {data.city}, {data.province}, {data.postalCode}
                </p>
                <p>
                  {data.contactPhone}
                </p>
                <div className="mt-4 flex justify-end gap-2">
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
          )}
        {totalPage > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              setPage={setPage}
              totalPage={totalPage}
            />
          </div>
        )}
      </div>
    );
  }

  if (
    showHandlePageContext.action === "Tambah Alamat Baru" ||
    showHandlePageContext.action === "Ubah Alamat"
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
