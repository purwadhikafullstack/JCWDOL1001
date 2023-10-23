import { useRef, useState } from "react"
import Input from "../../../../components/Input";
function ListOfProduct({
    product = [],
    selected
}){
    return product.map((item,index)=>{
        return(
            <option value={[item?.productId, item?.productName]}
            selected={item?.productName=== selected }>
                {item?.productName}
            </option>
            
        )
    })
}



export default function IngredientList({
    product = [],
    onIngredientProductChange = (params)=>{},
    onChange,
    errorInput,
    selected

}){

    const selectProductRef = useRef(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return(
        <div className="flex flex-col w-full">
            <span>
                Obat Racik
            </span>
            
            <select 
            className= {`w-full rounded-lg border bg-inherit px-2 py-2 outline-none 
            ${ errorInput ? "border-red-300" : "border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/50"}`}
            ref={selectProductRef} onChange={()=>{
                onIngredientProductChange(selectProductRef?.current?.value)}}
            onClick={() => setIsDropdownOpen(true)}
            >
                 <option disabled={isDropdownOpen}>Select Ingredient Product:  </option>
                <ListOfProduct
                selected={selected}
                product={product}
                />
            </select>

        </div>
    )
}