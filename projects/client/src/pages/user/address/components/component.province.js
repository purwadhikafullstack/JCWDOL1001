import { useRef } from "react"

function ListOfProvince({
    province = [],
    selected
}){
    return province.map((item)=>{
       
        return(
            <option
                value={[ item.province_id, item.province]}
                selected={item.province === selected ? "selected" : ""}
            >
                {item.province}
            </option>
            
        )
    })
}

export default function GetProvince({
    province = [],
    onProvinceChange = (provinceParams)=>{},
    selected
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
            <option value="" className="text-slate-500 hover:bg-red-500">Select Province</option>
                <ListOfProvince
                province={province}
                selected={selected}
                />
            </select>
        </div>
    )
}