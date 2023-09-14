import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../component.profile.card";
import { useEffect, useState } from "react";
import { getAddress } from "../../../../store/slices/address/slices";
import Button from "../../../../components/Button";

export default function Address() {
  const dispatch = useDispatch()

  const [selectedAddress, setSelectedAddress] = useState(null);

  const { profile, address } = useSelector(state=>{
    return {
      profile : state.auth.profile,
      address : state.address.data,
    }
  })

  useEffect(()=>{
    dispatch(getAddress())
    console.log(selectedAddress);
  }, [selectedAddress])

  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-4 lg:gap-4">
        <ProfileCard profile={profile}/>
        <div className="col-span-3 h-screen">
          <h3 className="title">Alamat</h3>
          {address.map((data, index) => (
            <div key={index} className="mt-4 p-4 border shadow-md rounded-lg">
              <h3>{data.address}, {data.district}, {data.city}</h3>
              <h3>{data.province}</h3>
              <h3>{data.postalCode}</h3>
              <div className="flex justify-end gap-2    ">
                <Button
                  isButton
                  isPrimaryOutline
                  title="Ubah Alamat"
                  onClick={() => setSelectedAddress(data.addressId)}
                />
                <Button
                  isButton
                  isPrimaryOutline
                  title="Hapus Alamat"
                  onClick={() => setSelectedAddress(data.addressId)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
