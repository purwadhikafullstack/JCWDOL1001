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
    // dispatch(getProducts({
    //     category_id : "",
    //     product_name : "",
    //     sort_name : "", 
    //     sort_price : "", 
    //     page : 1,
    //     limit: 12
    //   }));

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
                // onChange()
                onIngredientProductChange(selectProductRef?.current?.value)}}
            onClick={() => setIsDropdownOpen(true)}
            >
                {/* <Input
                type="text"
                placeholder="earch..." 
                /> */}
                 <option disabled={isDropdownOpen}>Select Ingredient Product:  </option>
                <ListOfProduct
                selected={selected}
                product={product}
                />
            </select>

        </div>
    )
}