import { useRef, useState } from "react"
import Pagination from "../../../../components/PaginationV2"
function ListOfUser({
    user = [],
    onUserChange=(params)=>{}
}){
    return user.map((item,index)=>{
        return(
            <tr 
            className="cursor-pointer text-center hover:bg-slate-100 
            hover:shadow capitalize"
            onClick={()=>onUserChange([item?.email, item?.userProfile.name, item?.imgRecipe])}
            >
                <td className="border-b-2 border-slate-300 p-3">{index+1}</td>
                <td className="border-b-2 border-l-2 border-slate-300 p-3"> {item?.userProfile.name}</td>
               
            </tr>
            
            // <table className="text-gray-500 w-full text-left text-sm">
            // <thead className="text-gray-700 bg-slate-100 text-sm uppercase">
            //   <tr>
            //     <th className="p-3">#</th>
            //     <th className="p-3">Nama User</th>
            //   </tr>
            // </thead>
            // <tbody>
            //   {isGetProductsLoading || isSubmitProductLoading ? (
            //     <tr className="text-center">
            //       <td colSpan={7} className="p-3">
            //         <LoadingSpinner isLarge />
            //       </td>
            //     </tr>
        )
    })
}



export default function UserList({
    user = [],
    onUserChange = (params)=>{},
}){
    const [page,setPage] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    const [totalPage,setTotalPage] = useState(1)

    const selectRef = useRef(null)
    return(
        <div className="flex flex-col w-full items-center justify-center">
            <span className="font-semibold mb-6">
                Resep dokter dari customer mana yang hendak diproses?
            </span>
            <table className="text-gray-500 w-1/3 text-left text-sm">
                <thead className="text-white bg-primary text-sm uppercase text-center"
                >
                    <tr>
                        <th className="p-3">#</th>
                        <th className="border-l-2 p-3">Nama User</th>
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