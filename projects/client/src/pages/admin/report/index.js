import { useEffect, useState, useRef, React } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify";
import { HiMagnifyingGlass } from "react-icons/hi2"
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown,FaSortAmountUp } from "react-icons/fa"
import moment from "moment"
import { Line } from 'react-chartjs-2';
import {  Chart as ChartJS,  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getReport } from "../../../store/slices/report/slices"
import { getTransactionList } from "../../../store/slices/transaction/slices.js"
import { filterDateReportValidationSchema } from "../../../store/slices/report/validation.js";
import Button from "../../../components/Button/index.js"
import Input from "../../../components/Input/index.js"
import TransactionList from "./component.transaction";
ChartJS.register( CategoryScale,  LinearScale, PointElement,  LineElement, Title, Tooltip, Legend);

function ReportPage () {
    const dispatch = useDispatch()
    const { transactionList, currentPage, totalPage, report} = useSelector(state => {
        return {
            transactionList : state?.transaction?.transactions,
            report : state?.report?.list,
            currentPage : state?.transaction?.currentPage ? state?.transaction?.currentPage : 1,
            totalPage : state?.transaction?.totalPage ? state?.transaction?.totalPage : 1
        }
    })

    const startDateRef = useRef()
    const endDateRef = useRef()
    const nameRef = useRef()
    const [graph,setGraph] = useState(false)
    const [filter,setFilter] = useState(false)
    const [sortingDate,setSortingDate] = useState("DESC")
    const [sortingPrice,setSortingPrice] = useState("")
    const [showModal, setShowModal] = useState({ show: false,context:"" })
    const [selectedTransaction, setSelectedTransaction] = useState([])
    const [page, setPage] = useState(1);
    const [isToastVisible, setIsToastVisible] = useState(false)

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
                text: 'Total',
            },
        },
    }

    const labels = report?.map((item)=> { return moment(item.tanggal).format("DD-MM-Y") })
    
    const data = {labels,
        datasets: [{
            label: 'Total',
            data: report?.map((item)=> {return Number(item.total)}),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }]
    }

    const onButtonFilter = async () => {
        try {
            startDateRef?.current?.value && endDateRef?.current?.value && await filterDateReportValidationSchema.validate({
                startFrom : startDateRef?.current?.value,
                endFrom : endDateRef?.current?.value
            })

            dispatch(getReport({
                statusId : 6,
                startFrom : startDateRef.current.value,
                endFrom : endDateRef.current.value
            }))

            onButtonSearchName()

            setFilter(true)
        }catch(error){
            if(error) {
                toast.error(error.message)
            }

            setIsToastVisible(true);

            setTimeout(() => { setIsToastVisible(false)}, 2000);
        }
    }

    const onButtonSearchName = () =>{
        dispatch(getTransactionList({
            statusId : 6,
            startFrom : startDateRef.current.value,
            endFrom : endDateRef.current.value,
            sortDate: sortingDate,
            sortTotal:sortingPrice,
            filterName : nameRef?.current?.value,
            page:1
        }))
    }

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
        setSortingDate("DESC")
        setSortingPrice("")
        dispatch(getReport({statusId : 6}))
        dispatch(getTransactionList({
            statusId : 6,
            startFrom : "",
            endFrom : "",
            sortDate: "DESC",
            filterName :""
        }))
        setFilter(false)
    }
    
    const width = window.screen.width
    const mobileWidth = 414

    useEffect(() => {
        dispatch( getReport({statusId : 6, page : page }) )
    }, [page])

    useEffect(() => {
        dispatch(getReport({statusId : 6}))
        onButtonSearchName()
	}, [])
    
    return (
        <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
            <div className="relative flex flex-col pb-15">
                <div className={`flex ${width <= mobileWidth ? "flex-col w-fit" : "items-center align-middle"} gap-5 px-3 mb-5`}>
                    <a className="flex normal-case text-[20pt]">  Laporan </a>
                        <Input type="text" placeholder="Cari Pengguna" ref={nameRef}/>
                        <Button className={`absolute ${width <= mobileWidth ? "top-[23%] right-[45%]" : "top-[15%] left-[21%]"} -translate-y-1/2`}
                            onClick={()=>{
                                onButtonSearchName()
                                setFilter(true)}}
                        >
                            <HiMagnifyingGlass className="text-2xl text-primary" />
                        </Button>
                    <Button title="Hapus pengaturan" onClick={clearFilter}  className={` ${width <= mobileWidth && "hidden"} flex flex-row items-center h-auto text-red-700 ${filter ? "" : "hidden"}`} />
                </div>
                <div className={`flex  ${width <= mobileWidth ? "flex-col items-start" :"items-center"}`}>
                    
                    <span className="mx-4 text-gray-500">dari</span>
                    <div className="relative ">
                        <input ref={startDateRef} name="start" type="date" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${width <= mobileWidth ? "ml-5" :""}  block w-full pl-10 p-2.5`}/>
                    </div>
                    <span className="mx-4 text-gray-500">sampai</span>
                    <div className="relative">
                        <input ref={endDateRef} name="end" type="date" className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ${width <= mobileWidth ? "ml-5" :""}  block w-full pl-10 p-2.5`}/>
                    </div>
                    <div className="flex mx-5 my-5 items-center h-auto gap-5">
                        Urutkan :
                        <div className="flex flex-row items-center h-auto gap-1">
                            Tanggal
                            <FaSortAlphaDown className={`${sortingDate === "DESC" || sortingDate ==="" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("DESC")}} />
                            <FaSortAlphaUp className={`${sortingDate === "ASC" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortDate("ASC")}}/>                
                        </div>
                        <div className="flex flex-row items-center h-auto gap-1">
                            Total
                            <FaSortAmountDown  className= {`${sortingPrice === "DESC" || sortingPrice ==="" ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortPrice("DESC")}} />
                            <FaSortAmountUp className= {`${sortingPrice === "ASC"  ? "hidden" : "text-2xl text-primary"}`} onClick={()=>{onButtonSortPrice("ASC")}}/>                
                        </div>
                    </div>
                    <Button title="Filter" isButton isPrimary className="flex mx-5 items-center" isDisabled={isToastVisible} onClick={onButtonFilter} />
                    <Button title="Hapus pengaturan" onClick={clearFilter}  className={` ${width > mobileWidth && "hidden"} mt-3 ml-5 items-center h-auto text-red-700 ${filter ? "" : "hidden"}`} />

                </div>
            </div>
            <TransactionList width={width} mobileWidth={mobileWidth} transactionList={transactionList} currentPage={currentPage} totalPage={totalPage} setPage={setPage} handleShowModal={handleShowModal} handleCloseModal={handleCloseModal} setSelectedTransaction={setSelectedTransaction} selectedTransaction={selectedTransaction} showModal={showModal} />              
            <Button title="Lihat Grafik" isSmall={true} isButton isPrimary onClick={()=>{setGraph(true)}} className={`${graph || transactionList.length == 0  ? "hidden" : ""} flex items-center mt-5`} />
            <Button title="Sembunyikan Grafik" isButton isSecondary onClick={()=>{setGraph(false)}} className={`${!graph ? "hidden" : ""} flex items-center`} />
            <div className={`${graph ? "" : "hidden"}`}>
                <Line options={options} data={data} />
            </div>
        </div>
    )
}
export default ReportPage