import { useRef } from "react"
function ListOfProduct({
    product = [],
}){
    return product.map((item,index)=>{
        return(
            <option value={[item?.productId, item?.productName]}>
                {item?.productName}
            </option>
            
        )
    })
}



export default function IngredientList({
    product = [],
    onIngredientProductChange = (params)=>{},
    // onIngredientUnitChange = (params)=>{}
}){
    const selectProductRef = useRef(null)
    // const selectUnitRef = useRef(null)
    return(
        <div className="flex flex-col w-full">
            <span>
                Ingredient
            </span>
            <select 
            className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={selectProductRef} onChange={()=>{onIngredientProductChange(selectProductRef?.current?.value)}}>
                <option disabled>Select Ingredient Product: </option>
                <ListOfProduct
                product={product}
                />
            </select>
            {/* <span>
                Ingredient Unit:
            </span>
            <select 
            className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={selectUnitRef} onChange={()=>{onIngredientUnitChange(selectUnitRef?.current?.value)}}>
                <option disabled>Select Secondary Unit: </option>
                <ListOfUnit
                product={product}
                index = {index}
                />
            </select> */}

        </div>
    )
}