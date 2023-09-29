import { useEffect, useState, useRef, React } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown,FaSortAmountUp } from "react-icons/fa"
import Pagination from "../../../components/Pagination/index.js"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from "moment"
import { getReport } from "../../../store/slices/report/slices"
import { getTransactionList } from "../../../store/slices/transaction/slices.js"
import formatNumber from "../../../utils/formatNumber.js"
import { formatDate } from "../../../utils/formatDate.js"
import Button from "../../../components/Button/index.js"
import Modal from "../../../components/Modal/index.js";
import Input from "../../../components/Input/index.js"
import { HiMagnifyingGlass } from "react-icons/hi2"


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ReportPage () {
    const dispatch = useDispatch()
    
    const { transactionList, currentPage, totalPage, report} = useSelector(state => {
        return {
            transactionList : state.transaction.transactions,
            report : state.report.list,
            currentPage : state.report.list.currentPage,
            totalPage : state.report.list.totalPage
        }
    })

    const startDateRef = useRef()
    const endDateRef = useRef()
    const nameRef = useRef()

    const [graph,setGraph] = useState(false)
    const [filter,setFilter] = useState(false)
    const [sortingDate,setSortingDate] = useState("")
    const [sortingPrice,setSortingPrice] = useState("")
    const [showModal, setShowModal] = useState({ show: false,context:"" })
    const [selectedTransaction, setSelectedTransaction] = useState([])

    const onChangePagination = (type) => {
        dispatch( getTransactionList({ 
            page : type === "prev" ? Number(currentPage) - 1 : Number(currentPage) + 1, 
            statusId : 7
        }))
    }

    const handleShowModal = ({context}) => {
        setShowModal({ show: true,context })
    }

    const handleCloseModal = () => {
        setShowModal({ show: false,context:"" })
        document.body.style.overflow = "auto"
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total Sales',
            },
        },
    }

    const labels = report?.map((item)=> {
        return moment(item.tanggal).format("DD-MM-Y")
    })
    
    const data = {
        labels,
        datasets: [
            {
                label: 'Total Sales',
                data: report?.map((item)=> {return Number(item.total)}),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    }
    
    const onButtonFilter = () => {
        dispatch(
            getReport({
                statusId : 7,
                startFrom : startDateRef.current.value,
                endFrom : endDateRef.current.value
            })
        )
        dispatch(
            getTransactionList({
                statusId : 7,
                startFrom : startDateRef.current.value,
                endFrom : endDateRef.current.value,
                sortDate: sortingDate,
                sortTotal:sortingPrice,
                filterName : nameRef.current.value
            })
        )
        setFilter(true)
    }

    // const onButtonGraph = () => {
    //     setGraph(true)
    //     dispatch(
    //         getTransactionList({
    //             statusId : 7,
    //             startFrom : startDateRef.current.value,
    //             endFrom : endDateRef.current.value
    //         })
    //     )
    // }

    const onButtonSortDate = (type="")=>{
        setSortingPrice("")
        setSortingDate(type)
        setFilter(true)
    }

    const onButtonSortPrice = (type="")=>{
        setSortingPrice(type)
        setSortingDate("")
        setFilter(true)
    }
    
    const clearFilter = () => {
        startDateRef.current.value = ""
        endDateRef.current.value = ""
        nameRef.current.value = ""
        setSortingDate("")
        setSortingPrice("")
        dispatch(getReport({statusId : 7}))
        dispatch(getTransactionList({
            statusId : 7,
            startFrom : startDateRef.current.value,
            endFrom : endDateRef.current.value,
            sortDate: "",
            sortTotal:"",
            filterName :""
        }))
        setFilter(false)
    }

    useEffect(() => {
        dispatch(getReport({statusId : 7}))
        dispatch(getTransactionList({
            statusId : 7,
            startFrom : startDateRef.current.value,
            endFrom : endDateRef.current.value,
            sortDate: sortingDate,
            sortTotal:sortingPrice,
            filterName :""
        }))
	}, [])
    
    return (
        <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
            <div className="pb-10">
                <div className="relative flex flex-col pb-5">
                    <div className="flex items-center align-middle gap-5 px-3 mb-5">
                        <a className="flex normal-case text-[20pt]">
                            Report Transaction
                        </a>
                        <Input 
                            type="text" 
                            placeholder="Search User" 
                            ref={nameRef}
                        />
                        <Button 
                            className="absolute top-[16%] left-[31%] -translate-y-1/2" 
                            onClick={()=>{
                                dispatch(getTransactionList({statusId : 7,filterName : nameRef?.current?.value}))
                                setFilter(true)}}
                        >
                            <HiMagnifyingGlass className="text-2xl text-primary" />
                        </Button>
                        
                        <button className={`flex flex-row items-center h-auto text-red-700 ${filter ? "" : "hidden"}`}
                            onClick={clearFilter} 
                        >
                            Clear filter
                        </button>
                    </div>
                    <div className="flex items-center">
                        <span className="mx-4 text-gray-500">dari</span>
                        <div className="relative">
                            <input name="start" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5" 
                                ref={startDateRef}
                            />
                        </div>
                        <span className="mx-4 text-gray-500">sampai</span>
                        <div className="relative">
                            <input name="end" type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" 
                                ref={endDateRef}
                            />
                        </div>
                        <div className="flex mx-5 my-5 items-center h-auto gap-5">
                            Sort By :
                            <div className="flex flex-row items-center h-auto">
                                Date
                                <FaSortAlphaDown className={`${sortingDate === "DESC" || sortingDate ==="" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("DESC")}} />
                                <FaSortAlphaUp className={`${sortingDate === "ASC" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("ASC")}}/>                
                            </div>
                            <div className="flex flex-row items-center h-auto">
                                Total Price
                                <FaSortAmountDown  className= {`${sortingPrice === "DESC" || sortingPrice ==="" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortPrice("DESC")}} />
                                <FaSortAmountUp className= {`${sortingPrice === "ASC"  ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortPrice("ASC")}}/>                
                            </div>
                        </div>
                        <Button isButton isPrimary
                            className="flex mx-5 items-center"
                            onClick={onButtonFilter}
                        >
                            Filter
                            <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Button>
                    </div>

                </div>                
                <div class="my-10 mr-20 w-full shadow-md sm:rounded-lg">
                    <table class="w-full max-text-sm text-center text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                            <tr>
                                <th scope="col" className="px-6 py-3 ">Transaction ID</th>
                                <th scope="col" className="px-6 py-3 ">Time</th>
                                <th scope="col" className="px-6 py-3 ">User</th>
                                <th scope="col" className="px-6 py-3 ">Total Price</th>
                                <th scope="col" className="px-6 py-3 ">Product</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionList.length ===0 ? <h3>Data Tidak Ditemukan</h3>
                                : transactionList.map((list)=>{
                                    return (
                                        <tr  className="items-center text-center">
                                            <th className="p-3 ">Transaction#{list.transactionId}</th>
                                            <td className="p-3 ">{formatDate(list.updatedAt)}</td>
                                            <td className="p-3 ">{list.userProfile.name}</td>
                                            <td className="p-3 ">IDR {formatNumber(list.total)}</td>
                                            <Button isButton isPrimary title="Show Products" 
                                                onClick={()=>{
                                                    setSelectedTransaction(list)
                                                    handleShowModal({context : "Product List" })
                                                }}
                                            />
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="w-full">
                    <Pagination 
                        onChangePagination={onChangePagination}
                        disabledPrev={Number(currentPage) === 1}
                        disabledNext={currentPage >= totalPage}
                    />
                </div>
                <Button isButton isPrimary
                    className={`${graph || transactionList.length == 0  ? "hidden" : ""} flex items-center`}
                    onClick={()=>{setGraph(true)}}

                >
                    Show Graph
                    <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </Button>
                <Button isButton isSecondary
                    className={`${!graph ? "hidden" : ""} flex items-center`}
                    onClick={()=>{setGraph(false)}}

                >
                    Hide Graph
                    <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </Button>
                <div className={`${graph ? "" : "hidden"}`}>
                    <Line options={options} data={data} />
                </div>
                <Modal
                    showModal={showModal.show}
                    closeModal={handleCloseModal}
                    title={showModal.context}
                >
                    {showModal.context === "Product List" && (
                        <table class="w-full max-text-sm text-left text-gray-500">
                            <thead class="text-sm text-center text-gray-700 uppercase bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="p-3 text-left">Product Name</th>
                                    <th scope="col" className="p-3 ">Qty</th>
                                    <th scope="col" className="p-3 ">@</th>
                                    <th scope="col" className="p-3 text-right">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedTransaction.transactionDetail.length ===0 ? <h3>Data Tidak Ditemukan</h3>
                                    : selectedTransaction.transactionDetail.map((detail)=>{
                                        return (
                                            <tr  className="items-center text-left">
                                                <td className="p-3 ">{detail.listedTransaction.productName}</td>
                                                <td className="p-3 text-center ">{detail.quantity}</td>
                                                <td className="p-3 text-right">{formatNumber(detail.price)}</td>
                                                <td className="p-3 text-right">IDR {formatNumber(detail.totalPrice)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    )}
                </Modal>
            </div>
        </div>
    )
}

export default ReportPage