import { useEffect, useRef, useState } from "react"
import Input from "../../../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../../store/slices/product/slices";
import {FaDeleteLeft} from "react-icons/fa6"

function ListOfProduct({
    product = [],
    selected,
    onIngredientProductChange = (params)=>{},
    clickOption = (params)=>{}
}){
    return product.map((item,index)=>{
        return(
           
            // onClick={()=>onIngredientProductChange([item?.productId, item?.productName])}
            // value={[item?.productId, item?.productName]}
                <div
                  key={index}
                //   onMouseDown={() => handleSelection(index)}
                //   ref={index === focusedIndex ? resultContainer : null}
                //   style={{
                //     backgroundColor:
                //       index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                //   }}
                  onClick={()=>clickOption([item?.productId, item?.productName])}
                  className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                >
                 <p> {item.productName}</p>
                </div>
            
        )
    })
}



export default function IngredientList({
    onIngredientProductChange = (params)=>{},
    onChange,
    errorInput,
    selected

}){
    const dispatch = useDispatch()
    const{product} = useSelector(state=>{
        return{
           product : state?.products?.data
        }
    })
    useEffect(()=>{
        dispatch(getProducts({
        category_id : "",
        product_name : "",
        sort_name : "", 
        sort_price : "", 
        page : 1,
        limit: 5
      }));
},[])
    
    const [result,setResult] = useState(true)
    const [selectProductRef,setSelectProductRef] = useState([])
    const[visible,setVisible] = useState(false)
    const handleChangeValue = (e) =>{
        e.preventDefault();
        const newValue = e.target.value;
        if(newValue){
            setSelectProductRef([0, newValue])
        }
        if(newValue === ""){
            setSelectProductRef([])
        }
        setResult(true)
        dispatch(getProducts({
            category_id : "",
            product_name : `${newValue}`,
            sort_name : "", 
            sort_price : "", 
            page : 1,
            limit: 5
          }))
    }
    const resetValue =()=>{
        setSelectProductRef(["",""])
        setVisible(false)
    }
    const clickOption = (params) =>{
        setSelectProductRef(params)
        dispatch(getProducts({
            category_id : "",
            product_name : `${params[1]}`,
            sort_name : "", 
            sort_price : "", 
            page : 1,
            limit: 5
          })).then((response)=>{if(response)setVisible(false)}
          )
    }

    useEffect(() => {
        if (selectProductRef.length > 0 && (result === false)) setResult(true);
        if (selectProductRef.length === 0) setResult(false);
        onIngredientProductChange(selectProductRef)
      }, [selectProductRef]);

    return(
        <div className="flex flex-col w-full relative z-[999]">
            <span>
                Obat Racik :
            </span>
            <div className="relative">
                <Input
                value={selectProductRef ? selectProductRef[1] : ""}
                type="text"
                placeholder="Search..."
                className="pr-16"
                onChange={(event)=>{
                    setVisible(true)
                    handleChangeValue(event)
                }}
                />
                <FaDeleteLeft className="absolute text-xl top-1/2 right-6 -translate-y-1/2
                    cursor-pointer
                "
                onClick={resetValue}
                />
            </div>
                {
                result &&
                <div className={`absolute ${visible? "" : "invisible"} 
                top-full
                 mt-1 w-fit p-2 bg-white shadow-lg rounded-bl z-[999]
                rounded-br h-fit overflow-y-auto`}>
                <ListOfProduct
                selected={selected}
                product={product}
                onIngredientProductChange={onIngredientProductChange}
                clickOption={clickOption}
                />
                </div>
                }
            
        </div>
    )
}