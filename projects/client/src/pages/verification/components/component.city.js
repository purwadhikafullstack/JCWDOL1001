import { useRef } from "react"
function ListOfCity({
    city = [],
}){
    return city.map((item)=>{
        const name = item.type+" "+item.city_name
        return(
            <option value={[name, item.postal_code]}>
                {item.type+" "+item.city_name}
            </option>
            
        )
    })
}

export default function GetCity({
    city = [],
    onCityChange = (cityParams)=>{}
}){
    const selectRef = useRef(null)
    return(
        <div className="flex flex-col w-full">
            <span>
                Kota
            </span>
            <select 
            className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={selectRef} onChange={()=>{onCityChange(selectRef?.current?.value)}}>
                <option disabled>Select City : </option>
                <ListOfCity
                city={city}
                onCityChange={onCityChange}
                />
            </select>
        </div>
    )
}