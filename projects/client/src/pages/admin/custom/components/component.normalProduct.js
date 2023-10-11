import { useEffect, useRef, useState } from "react"
import Input from "../../../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../../store/slices/product/slices";
import {FaDeleteLeft} from "react-icons/fa6"

function ListOfProduct({
    product = [],

    onNormalProductChange = (params)=>{},
    clickOption = (params)=>{}
}){
    return product.map((item,index)=>{
        return(
                <div
                  key={index}
                  onClick={()=>clickOption([item?.productId, item?.productName,item?.productPrice])}
                  className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                >
                 <p> {item.productName}</p>
                </div>
            
        )
    })
}



export default function NormalProductList({
    onNormalProductChange = (params)=>{},
    productId = "",
    productName,
    productPrice

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
    const [selectProductRef,setSelectProductRef] = useState([0,"",0])
    const[visible,setVisible] = useState(false)
    const handleChangeValue = (e) =>{
        e.preventDefault();
        const newValue = e.target.value;
        if(newValue){
            setSelectProductRef([0, newValue,0])
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
        setSelectProductRef(["0","","0"])
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
        onNormalProductChange(selectProductRef)
      }, [selectProductRef]);

    useEffect(()=>{
        setSelectProductRef([productId,productName,productPrice])
    },[productName])

    return(
        <div className="flex flex-col w-full relative z-[999]">
            <span>
                Nama Produk :
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
                product={product}
                onNormalProductChange={onNormalProductChange}
                clickOption={clickOption}
                />
                </div>
                }
            
        </div>
    )
}