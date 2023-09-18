import { useDispatch, useSelector } from "react-redux";
import GetProvince from "../../verification/components/component.province";
import GetCity from "../../verification/components/component.city";
import Input from "../../../components/Input";
import { useEffect, useRef, useState } from "react";
import {
  addAddress,
  getAddress,
  listCity,
  listProvince,
} from "../../../store/slices/address/slices";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Button from "../../../components/Button";
import { HiArrowLongLeft } from "react-icons/hi2";
import { InputAddressValidationSchema } from "../../../store/slices/address/validation";
import { toast } from "react-toastify";
import Message from "../../../components/Message";

export default function InputAddressPage({
  addressData,
  handleCloseAddressPageAction,
  action,
}) {
  const dispatch = useDispatch();

  const { dataProvince, dataCity, isLoading, isSubmitAddressLoading } =
    useSelector((state) => {
      return {
        dataProvince: state?.address?.province,
        dataCity: state?.address?.city,
        isLoading: state?.address?.isLoading,
        isSubmitAddressLoading: state?.address?.isSubmitAddressLoading,
      };
    });

  const addressRef = useRef(null);
  const districtRef = useRef(null);
  const postalCodeRef = useRef(null)
  // const [postalCodeState, setPostalCode] = useState(80351);
  const [cityRef, setCityRef] = useState("Kabupaten Badung");
  const [provinceRef, setProvinceRef] = useState("Bali");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const [error, setError] = useState("");
  const [confirmAdd, setConfirmAdd] = useState(false);

  const onProvinceChange = (provinceParams) => {
    const result = provinceParams.split(",");
    setProvinceRef(result[1]);
    dispatch(listCity({ province: result[0] }));
  };

  const onCityChange = (cityParams) => {
    const result = cityParams.split(",");
    // setPostalCode(result[1]);
    setCityRef(result[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
    });

    const inputAddressData = {
      address: addressRef.current?.value,
      district: districtRef.current?.value,
      city: cityRef,
      province: provinceRef,
      postalCode: postalCodeRef.current?.value,
    };

    try {
      if (addressData) {
        await InputAddressValidationSchema.validate(inputAddressData, {
          abortEarly: false,
        });

        setError("");
        setConfirmAdd(true);

        if (confirmAdd) {
          // dispatch(updateProduct({ id: productData.productId, formData }));
        }
      }

      if (!addressData) {
        await InputAddressValidationSchema.validate(inputAddressData, {
          abortEarly: false,
        });

        setError("");
        setConfirmAdd(true);

        if (confirmAdd) {
          dispatch(addAddress(inputAddressData));
        }
      }
    } catch (error) {
      const errors = {};

      error.inner.forEach((innerError) => {
        errors[innerError.path] = innerError.message;
      });
      setError(errors);

      toast.error("Periksa kembali data alamatmu");

      setIsToastVisible(true);

      setTimeout(() => {
        setIsToastVisible(false);
      }, 2000);
    }
  };

  useEffect(() => {
    // setPostalCode(dataCity[0]?.postal_code);

    setCityRef(dataCity[0]?.type + " " + dataCity[0]?.city_name);
  }, [dataCity]);

  useEffect(() => {
    dispatch(listProvince());
    dispatch(listCity({ province: 1 }));
  }, []);

  return (
    <form className="px-1 pb-24 lg:pb-8" onSubmit={handleSubmit}>
      <>
        <div className={`${confirmAdd ? "hidden" : null}`}>
          <div className="mb-4">
            <Button
              isLink
              className={`text-primary`}
              title={
                <div className="flex items-center gap-2">
                  <HiArrowLongLeft className="text-lg" />
                  <span className="underline">Kembali ke Daftar Halaman</span>
                </div>
              }
              onClick={handleCloseAddressPageAction}
            />

            <h3 className="title mt-4">{action}</h3>
          </div>
          <div className="mb-4">
            <GetProvince
              onProvinceChange={onProvinceChange}
              province={dataProvince}
            />
          </div>

          <div className="mb-4">
            <GetCity onCityChange={onCityChange} city={dataCity} />
          </div>

          <div className="mb-4">
            <Input
              ref={districtRef}
              required
              type="text"
              label="Kecamatan"
              placeholder="Contoh: Tebet"
              errorInput={error.district}
              onChange={() => setError({ ...error, district: false })}
            />
            {error.district && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {error.district}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <Input
              ref={postalCodeRef}
              type="number"
              label="Kode Pos"
              placeholder="Contoh: 12345"
            />
          </div>

          <div className="mb-4">
            <Input
              ref={addressRef}
              required
              type="textarea"
              label="Detail Alamat"
              placeholder="Contoh: Jl. Terus, RT 001/002, No 22 (Samping Warteg)"
              errorInput={error.address}
              onChange={() => setError({ ...error, address: false })}
            />
            {error.address && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {error.address}
              </div>
            )}
          </div>


          <div className="mt-8 flex gap-2">
            <Button
              isButton
              isBLock
              isPrimaryOutline
              title="Kembali"
              onClick={handleCloseAddressPageAction}
            />
            <Button
              isButton
              isPrimary
              isBLock
              isLoading={isSubmitAddressLoading}
              isDisabled={isToastVisible}
              title={addressData ? "Ubah Alamat" : "Tambah Alamat"}
              type={isToastVisible ? "button" : "submit"}
            />
          </div>
        </div>

        <div
          className={`${
            !confirmAdd
              ? "hidden"
              : "mt-[10%] flex flex-col items-center justify-center"
          }`}
        >
          {addressData ? (
            <p className="text-center">
              Apa kamu yakin ingin mengubah alamat ini?
            </p>
          ) : (
            <p className="text-center">
              Apa alamat yang kamu isi sudah sesuai?
            </p>
          )}

          <div className="flex justify-center gap-2">
            {!isSubmitAddressLoading && (
              <Button
                isButton
                isPrimaryOutline
                title={addressData ? "Gak" : "Cek lagi"}
                className="mt-4"
                type="button"
                onClick={() => setConfirmAdd(false)}
              />
            )}

            <Button
              isButton
              isPrimary
              title={addressData ? "Ya, ubah" : "Ya, tambahkan alamat"}
              className="mt-4"
              type="submit"
              isLoading={isSubmitAddressLoading}
            />
          </div>
        </div>
      </>
    </form>
  );
}
