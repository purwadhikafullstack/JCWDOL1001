import { useRef, useState } from "react"
function ListOfProduct({
    product = [],
    productId = "",
    selected
}){
    return product.map((item,index)=>{
        if(productId === item?.productId){
        return <option value={[item?.productId, item?.productName,item?.productPrice]}
            selected={item?.productName=== selected }
        
        >
        {item?.productName}
    </option>
        }
     
        else{
            return(
                <option value={[item?.productId, item?.productName,item?.productPrice]}
                selected={item?.productName=== selected}
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
    productId = "",
    onChange,
    errorInput,
    selected
}){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const selectProductRef = useRef(null)
    return(
        <div className="flex flex-col w-full">
            <span>
                Product Name:
            </span>
            <select 
            className= {`w-full rounded-lg border bg-inherit px-2 py-2 outline-none 
            ${ errorInput ? "border-red-300" : "border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/50"}`}
            ref={selectProductRef} onChange={()=>{
                // onChange()
                onNormalProductChange(selectProductRef?.current?.value)}}
            onClick={() => setIsDropdownOpen(true)}
            >
                <option disabled={isDropdownOpen}>Select Product: </option>
                <ListOfProduct
                productId={productId}
                product={product}
                selected={selected}
                />
            </select>


        </div>
    )
}