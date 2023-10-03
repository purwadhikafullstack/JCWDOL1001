import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productStockHistory, productDetailHistory } from "../../../../store/slices/product/history/slices";
import Button from "../../../../components/Button";
import { formatDateValue } from "../../../../utils/formatDate";
import Pagination from "../../../../components/PaginationV2";

export default function StockHistory (){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortStatus, setSortStatus] = useState("");
    const [sortType, setSortType] = useState("");
    const [page, setPage] = useState(1);
    let productId = location.state?.productId;
    let productName = location.state?.productName;
    const {data, stock, currentPage, totalPage} = useSelector((state)=>{
        return {
            data : state?.stocks?.data,
            stock : state?.stocks?.stock,
            currentPage : state?.stocks?.currentPage,
            totalPage : state?.stocks?.totalPage
        }
    })
    
    useEffect(()=>{
        dispatch(productDetailHistory({productId : productId}))
    },[])

    useEffect(()=>{
        dispatch(productStockHistory({page : page, sort_type : sortType, productId : productId, start_date : startDate, end_date : endDate, sort_status : sortStatus}))
    },[page, startDate, endDate, sortStatus, sortType])


    const statusText = (context) => {
        if(context === "Penambahan"){
            return(<td className="p-3">
                <h1 className=" text-blue-500">{context}</h1>
            </td>) 
        }else{
            return(<td className="p-3">
                <h1 className=" text-red-500">{context}</h1>
            </td>) 
        }
    }

    return(
        <div className="container py-24 ml-[calc(5rem)]">
            <div>
                <h1 className="title text-4xl border-b-2">{productName}</h1>
                <h1 className="text-3xl">Current Stock</h1>
                {
                    stock ? stock?.map ((stock, index) => (
                        <div className="text-gray-700 bg-slate-100 text-sm uppercase">
                            <h1 className="text-green-500 text-xl font-bold">{stock.product_unit.name} : {stock.quantity}</h1>
                        </div>
                    )) :
                    <tr></tr>
                }
                <div className="flex flex-row">
                    <div className="mx-2 border border-black rounded">
                        <label>Start Date :</label>
                        <input type="date" onChange={(e)=>setStartDate(e.target.value)}></input>
                    </div>
                    <div className="mx-2 border border-black rounded">
                        <label className="ml-4">End Date :</label>
                        <input type="date" onChange={(e)=>setEndDate(e.target.value)}></input>
                    </div>
                    <div className="mx-2 border border-black rounded">
                        <label className="ml-4">Sort Type :</label>
                        <select value={sortType} onChange={(e)=>setSortType(e.target.value)}>
                        <option value={""}></option>
                        <option value={"ASC"}>A-Z</option>
                        <option value={"DESC"}>Z-A</option>
                        </select>
                    </div>
                    <div className="mx-2 border border-black rounded">
                        <label className="ml-4">Sort Status :</label>
                        <select value={sortStatus} onChange={(e)=>setSortStatus(e.target.value)}>
                        <option value={""}></option>
                        <option value={"ASC"}>A-Z</option>
                        <option value={"DESC"}>Z-A</option>
                        </select>
                    </div>       
                </div>
                <table className="text-gray-500 w-full text-left text-sm">
                    <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
                        <tr>
                            <th scope="col" class="p-3 font-extrabold">
                                Datetime
                            </th>
                            <th scope="col" class="p-3">
                                Transaction Type
                            </th>
                            <th scope="col" class="p-3">
                                Transaction Status
                            </th>
                            <th scope="col" class="p-3">
                                Unit
                            </th>
                            <th scope="col" class="p-3">
                                Initial Stock
                            </th>
                            <th scope="col" class="p-3">
                                Quantity
                            </th>
                            <th scope="col" class="p-3">
                                Results
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                {
                    data ? data?.map ((data, index)=>(
                        <tr>
                            <th scope="row" className="text-gray-900 whitespace-nowrap p-3 font-medium">
                                <h1>{formatDateValue(data.updatedAt)}</h1>
                            </th>
                            <td className="p-3">
                                <h1>{data.type}</h1>
                            </td>
                            {statusText(data.status)}
                            <td className="p-3">
                                <h1>{data.unit}</h1>
                            </td>
                            <td className="p-3">
                                <h1>{data.initialStock}</h1>
                            </td>
                            <td className="p-3">
                                <h1>{data.quantity}</h1>
                            </td>
                            <td className="p-3">
                                <h1>{data.results}</h1>
                            </td>
                        </tr>
                    )) :
                    <tr></tr>
                }</tbody>
                </table>
            </div>
            <div className="mt-4 flex items-center justify-center text-center text-green-900 text-lg">
                <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
            </div>
            <Button isWarning isButton title={`Go Back to Product List`} onClick={()=>navigate("/admin/products")}/>
        </div>
    )
}