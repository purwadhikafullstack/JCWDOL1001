import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import formatNumber from "../../utils/formatNumber"
import { getShippingCost } from "../../store/slices/address/slices"

export default function ShippingCost({
    selectedAddress,
    setShipping
}) {
    const {shippingCost} = useSelector(state=>{
        return{
            shippingCost : state?.address?.shippingCost,
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
        <div className={`flex ${window.screen.width <= 500 ? "flex-col gap-2" : "flex-row gap-8"}  ${selectedAddress?.length === 0 &&"hidden"}`}>
            <div className="flex flex-col">
                <a>Pilih pengiriman : </a>
                <div className="flex max-w-lg gap-3 items-center">
                    <select 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
                        onChange={handleChangeCourier}
                    >
                        <option disabled={true} selected={true}>Pilih Jasa</option>
                        <option value="jne">JNE</option>
                        <option value="pos">POS INDONESIA</option>
                        <option value="tiki">TIKI</option>
                    </select>
                    <select 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block p-2.5"
                        onChange={handleChangeCourierService}
                    >
                        <option disabled={true} selected={selectedCourier.cost === ''}>Pilih Layanan</option>
                        {shippingCost.map((cost) => (
                            <option 
                                value={cost?.cost[0]?.value}
                                title={cost.service}
                                id={cost?.cost[0]?.etd}
                            >
                                {cost?.service}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex flex-col w-fit">
                <a>Biaya : </a>
                <a className="flex flex-grow items-center border border-gray-300 px-2 rounded-lg">Rp. {selectedCourier.cost ? formatNumber(selectedCourier.cost) : "-" }</a>
            </div>
            <div className="flex flex-col w-fit">
                <a>Estimasi : </a>
                <a className="flex flex-grow items-center border border-gray-300 px-2 rounded-lg">{selectedCourier.etd ? selectedCourier.etd : "-" }  Hari</a>
            </div>
        </div>
    )
}