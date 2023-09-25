import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import formatNumber from "../../utils/formatNumber"
import { getShippingCost } from "../../store/slices/address/slices"

export default function ShippingCost({
    selectedAddress,
    setShipping
}) {
    const {shippingCost, isGetCostLoading} = useSelector(state=>{
        return{
            shippingCost : state?.address?.shippingCost,
            isGetCostLoading : state?.address?.isGetCostLoading,
        }
    })

    const dispatch = useDispatch()

    const [selectedCourier, setSelectedCourier] = useState({
        name : "", 
        type :"",
        etd :"",
        cost :""
    })

    const handleChangeCourier = (event) => {
        dispatch(
            getShippingCost({ 
                "origin": 151, 
                "destination": selectedAddress.postalCode, 
                "weight": 1000, 
                "courier": event.target.selectedOptions[0].value
            })
        )
        setSelectedCourier({
            name : event.target.selectedOptions[0].value,
            type : "",
            etd : "",
            cost : ""
        })
    }

    const handleChangeCourierService = (event) =>{
        setSelectedCourier({
            name : selectedCourier.name,
            type : event.target.selectedOptions[0].title,
            etd : event.target.selectedOptions[0].id.replace(" HARI",""),
            cost : event.target.selectedOptions[0].value
        })
        setShipping({
            name : selectedCourier.name,
            type : event.target.selectedOptions[0].title,
            etd : event.target.selectedOptions[0].id.replace(" HARI",""),
            cost : event.target.selectedOptions[0].value
        })
    }

    return (
        <div className={selectedAddress.length === 0 &&"hidden"}>
            Pilih jasa pengiriman : 
            <div className="flex max-w-sm gap-3">
                <select 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    onChange={handleChangeCourier}
                >
                    <option disabled={true} selected={true}>Choose Courier</option>
                    <option value="jne">JNE</option>
                    <option value="pos">POS INDONESIA</option>
                    <option value="tiki">TIKI</option>
                </select>
                <select 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    onChange={handleChangeCourierService}
                >
                    <option disabled={true} selected={selectedCourier.cost === ''}>Choose Service</option>
                    {shippingCost.map((cost) => (
                        <option 
                            value={cost?.cost[0]?.value}
                            title={cost.service}
                            id={cost?.cost[0]?.etd}
                        >
                            {`${cost?.service} \n ${formatNumber(cost.cost[0]?.value)}`}
                        </option>
                    ))}
                </select>

            </div>
        </div>
    )
}