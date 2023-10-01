import { useRef } from "react"
function ListOfProduct({
    product = [],
    productId = ""
}){
    return product.map((item,index)=>{
        if(productId === item?.productId){
        return <option value={[item?.productId, item?.productName,item?.productPrice]}
        selected
        >
        {item?.productName}
    </option>
        }
     
        else{
            return(
                <option value={[item?.productId, item?.productName,item?.productPrice]}
                >
                {item?.productName}
            </option>
           
            )
        }
    })
}



export default function NormalProductList({
    product = [],
    onNormalProductChange = (params)=>{},
    productId = ""
    // onIngredientUnitChange = (params)=>{}
}){
    const selectProductRef = useRef(null)
    return(
        <div className="flex flex-col w-full">
            <span>
                Product Name:
            </span>
            <select 
            className="w-full rounded-lg border bg-inherit px-2 py-2 outline-none focus:ring-2
            focus:ring-primary/50 dark:focus:ring-primary border-slate-300 focus:border-primary
            "
            ref={selectProductRef} onChange={()=>{onNormalProductChange(selectProductRef?.current?.value)}}>
                <option disabled>Select Product: </option>
                <ListOfProduct
                productId={productId}
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