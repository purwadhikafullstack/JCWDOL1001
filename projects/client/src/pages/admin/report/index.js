import { useEffect, useState, useRef, React } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpAZ, faArrowDownZA, faArrowUp19, faArrowDown91,faCircleXmark  } from "@fortawesome/free-solid-svg-icons"
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

    const [graph,setGraph] = useState(false)
    const [filter,setFilter] = useState(false)
    
    const [sortingDate,setSortingDate] = useState("DESC")
    const [sortingPrice,setSortingPrice] = useState("")

    const onChangePagination = (type) => {
        dispatch( getTransactionList({ 
            page : type === "prev" ? Number(currentPage) - 1 : Number(currentPage) + 1, 
            statusId : 7
        }))
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
                sortTotal:sortingPrice
            })
        )
        setFilter(true)
    }

    const onButtonGraph = () => {
        setGraph(true)
        dispatch(
            getTransactionList({
                statusId : 7,
                startFrom : startDateRef.current.value,
                endFrom : endDateRef.current.value
            })
        )
    }

    const onButtonSortDate = (type="")=>{
        setSortingDate(type)
        setSortingPrice("")
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
        setSortingDate("DESC")
        setSortingPrice("")
        dispatch(getReport({statusId : 7}))
        dispatch(getTransactionList({
            statusId : 7,
            startFrom : startDateRef.current.value,
            endFrom : endDateRef.current.value,
            sortDate: sortingDate,
            sortTotal:sortingPrice
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
            sortTotal:sortingPrice
        }))
	}, [])
    
    return (
        <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
            <div className="pb-10">
                <a className="flex items-center normal-case text-[20pt] pb-3">
                    Report Transaction
                </a>
                <div class="flex items-center pb-5">
                    <span class="mx-4 text-gray-500">dari</span>
                    <div class="relative">
                        <input 
                            name="start" 
                            type="date" 
                            defaultValue={new URLSearchParams(window.location.search).get('startFrom')?new URLSearchParams(window.location.search).get('startFrom'):""}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5" 
                            ref={startDateRef}
                        />
                    </div>
                    <span class="mx-4 text-gray-500">sampai</span>
                    <div class="relative">
                        <input 
                            name="end" 
                            type="date" 
                            defaultValue={new URLSearchParams(window.location.search).get('endFrom')?new URLSearchParams(window.location.search).get('endFrom'):""}
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" 
                            ref={endDateRef}
                        />
                    </div>
                    <div className="flex mx-5 my-5 items-center h-auto gap-5">
                        Sort By :
                        <div className="flex flex-row items-center h-auto">
                            Date
                            <FontAwesomeIcon  icon={faArrowUpAZ} size="2xl" className= {`${sortingDate === "ASC" ? "hidden" : " "}`} onClick={()=>{onButtonSortDate("ASC")}} />
                            <FontAwesomeIcon icon={faArrowDownZA} size="2xl" className= {`${sortingDate === "DESC"  || sortingDate === "" ? "hidden" : " "}`} onClick={()=>{onButtonSortDate("DESC")}}/>                
                        </div>
                        <div className="flex flex-row items-center h-auto">
                            Total Price
                            <FontAwesomeIcon  icon={faArrowUp19} size="2xl" className= {`${sortingPrice === "ASC" ? "hidden" : " "}`} onClick={()=>{onButtonSortPrice("ASC")}} />
                            <FontAwesomeIcon icon={faArrowDown91} size="2xl" className= {`${sortingPrice === "DESC"  || sortingPrice === "" ? "hidden" : " "}`} onClick={()=>{onButtonSortPrice("DESC")}}/>                
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
                    <button className={`flex flex-row items-center h-auto text-red-700 ${filter ? "" : "hidden"}`}
                        onClick={clearFilter} 
                    >
                        <FontAwesomeIcon icon={faCircleXmark} style={{color: "#ff0000",}} />
                        Clear filter
                    </button>

                </div>
                <Button isButton isPrimary
                    className={`${graph || transactionList.length == 0  ? "hidden" : ""} flex items-center`}
                    onClick={onButtonGraph}

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
                                            <td className="p-3 ">{list.user_account.userProfile.name}</td>
                                            <td className="p-3 ">IDR {formatNumber(list.total)}</td>
                                            <td className="p-3 break-all max-w-xs ">
                                                {list.transactionDetail.map((detail,index)=>{
                                                   return index + 1 === list.transactionDetail.length ? detail.listedTransaction.productName : `${detail.listedTransaction.productName} , `
                                                })}
                                            </td>
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
                
            </div>
        </div>
    )
}

export default ReportPage