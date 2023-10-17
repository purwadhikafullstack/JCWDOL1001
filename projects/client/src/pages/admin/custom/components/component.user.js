import { useEffect, useRef, useState } from "react"
import Pagination from "../../../../components/PaginationV2"
import { useDispatch, useSelector } from "react-redux"
import { getUser } from "../../../../store/slices/custom/slices"
import { HiMagnifyingGlass } from "react-icons/hi2"
import Input from "../../../../components/Input"
import Button from "../../../../components/Button"
import { formatDate } from "../../../../utils/formatDate"


function ListOfUser({
    user = [],
    onUserChange=(params)=>{}
}){
    return user?.map((item,index)=>{
        return(
            <tr 
            className="cursor-pointer text-center hover:bg-slate-100 
            hover:shadow capitalize"
            onClick={()=>onUserChange([item?.email, item?.userProfile.name, item?.imgRecipe])}
            >
                <td className="border-b-2 border-slate-300 p-3">{index+1}</td>
                <td className="border-b-2 border-l-2 border-slate-300 p-3"> {item?.userProfile.name}</td>
                <td className="border-b-2 border-l-2 border-slate-300 p-3"> {formatDate(item?.createdRecipe)}</td>
               
            </tr>
        )
    })
}



export default function UserList({
    // user = [],
    onUserChange = (params)=>{},
}){
    const{user,totalPage,currentPage} = useSelector(state=>{
        return {
            totalPage : state?.custom?.totalPage,
            currentPage: state?.custom?.currentPage,
            user : state?.custom?.dataUser
        }
    })
    const [page,setPage] = useState(1)
    const [sortDate,setSortDate] = useState(false)
    const dispatch = useDispatch()

    const answerRef = useRef(null)
    useEffect(()=>{
    dispatch(getUser({
        search : null,
        sortDate : "ASC",
        page: 1
    }))
    },[])

    useEffect(()=>{
        if(sortDate){
            dispatch(getUser({
                search : answerRef?.current?.value ? answerRef?.current?.value : null,
                sortDate : "DESC",
                page: page
            }))
        }
        if(!sortDate){
            dispatch(getUser({
                search : answerRef?.current?.value ? answerRef?.current?.value : null,
                sortDate : "ASC",
                page: page
            }))
        }

        },[page,sortDate])

    return(
        <div className="flex flex-col w-full items-center justify-center">
            <span className="font-semibold mb-6">
                Resep dokter dari customer mana yang hendak diproses?
            </span>
            <div className="relative mx-5 my-5 items-center h-auto gap-5 flex flex-row justify-between">
                    <Input type="text" placeholder="Search" 
                        ref={answerRef}
                    />
                    <Button 
                        className="absolute top-1/2 left-40 -translate-y-1/2 p-2" 
                        onClick={()=>{
                            if(sortDate){
                                dispatch(getUser({
                                    search : answerRef?.current?.value,
                                    sortDate : "DESC",
                                    page: page
                                }))
                            }
                            if(!sortDate){
                                dispatch(getUser({
                                    search : answerRef?.current?.value,
                                    sortDate : "ASC",
                                    page: page
                                }))
                            }
                            
                        }}
                    >
                        <HiMagnifyingGlass className="text-2xl text-primary" />
                    </Button>

                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">Urutkan Tanggal Dari : </span>
                  <Button 
                    isButton
                    isPrimary
                    className={`relative`}
                    title={sortDate ? "Terbaru" : "Terlama"}
                    onClick={() => {
                        setSortDate(prevState => !prevState)
                    }}
                    />
                </div>
                </div>
            <table className="text-gray-500 w-1/3 text-left text-sm">
                <thead className="text-white bg-primary text-sm uppercase text-center"
                >
                    <tr>
                        <th className="p-3 ">#</th>
                        <th className="border-l-2 p-3 ">Nama User</th>
                        <th className="border-l-2 p-3 ">Tanggal Upload</th>
                    </tr>
                </thead>
                <tbody className="cursor-pointer text-center">
                    <ListOfUser
                    user={user}
                    onUserChange={onUserChange}
                    />
                </tbody>
            </table>
            <div className="mt-4 flex items-center justify-center">
            <Pagination currentPage={currentPage} totalPage={totalPage} setPage={setPage}/>
            </div>
        </div>
    )
}