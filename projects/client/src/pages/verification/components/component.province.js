import { useRef } from "react"

function ListOfProvince({
    province = []
}){
    return province.map((item)=>{
       
        return(
            <option value={[ item.province_id, item.province]}
            >
                {item.province}
            </option>
            
        )
    })
}

export default function GetProvince({
    province = [],
    onProvinceChange = (provinceParams)=>{}
}){
    const selectRef = useRef(null)
    
    return(
        <div className="flex flex-col w-full">
            <span>
                Provinsi
            </span>
            <select 
            className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={selectRef} onChange={()=>{onProvinceChange(selectRef?.current?.value)}}>
            <option value={"Select Province :"} disabled>Select Province : </option>
                <ListOfProvince
                province={province}
                />
            </select>
        </div>
    )
}