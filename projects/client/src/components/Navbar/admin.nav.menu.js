import { useDispatch } from "react-redux"
import { FaList, FaPowerOff } from "react-icons/fa6";
import Button from "../Button"
import { logout } from "../../store/slices/auth/slices"
import {
    HiBanknotes,
    HiClipboardDocumentList,
    HiMiniBars3,
    HiMiniChatBubbleOvalLeftEllipsis,
    HiSquares2X2,
    HiXMark,
} from "react-icons/hi2";
import { BiSolidDiscount } from "react-icons/bi";
import { useLocation } from "react-router-dom";

export default function AdminNavMenu({isSidebarActive, setIsSidebarActive}) {
    const dispatch = useDispatch()

    const onClickLogOut = () => {
        dispatch(logout())
    }

    const {pathname} = useLocation()

    const menu = [
        {
            title:"Products",
            path:"/admin/products",
            icon: <HiSquares2X2 className="h-7 w-7 " />
        },
        {
            title:"Categories",
            path:"/admin/categories",
            icon: <FaList className="h-7 w-7 " />

        },
        {
            title:"Transaction",
            path:"/admin/transaction",
            icon: <HiBanknotes className="h-7 w-7 " />
        },
        {
            title:"Discount",
            path:"/admin/discount",
            icon: <BiSolidDiscount className="h-7 w-7 " />
        },
        {
            title:"QnA",
            path:"/admin/qna",
            icon: <HiMiniChatBubbleOvalLeftEllipsis className="h-7 w-7 " />
        },
        {
            title:"Report",
            path:"/admin/report",
            icon: <HiClipboardDocumentList className="h-7 w-7 " />
        },
    ]
    return (
        <>
        
        <div
        className={`group mt-16 fixed top-0 h-[200vh] bg-slate-100 overflow-hidden border border-gray-300/40 py-16 duration-300  shadow-xl lg:left-0 lg:w-[calc(5rem)] lg:hover:w-64
        ${isSidebarActive ? "left-0 w-full" : "-left-full"}
        `}
        >
            <div className="flex flex-col justify-between">
                <div className="">
                    <ul className="space-y-2 px-4 font-medium tracking-wide">
                        {menu.map((item,index)=>(
                            <li key={index} className="w-full space-y-2">
                            <Button
                            isLink
                            path={item.path}
                            onClick={()=>setIsSidebarActive(false)}
                            className={`block w-full rounded-lg  py-3  duration-300 lg:w-[52px] lg:group-hover:w-full ${pathname === item.path ? "bg-primary text-white" : "text-dark hover:bg-slate-200"}`}
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                {item.icon}
                                <span>{item.title}</span>
                            </div>
                            </Button>
                        </li>
                        ))}

                        <li className="w-full space-y-4">
                            <Button
                            className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                            onClick={()=>{
                                onClickLogOut()
                                setIsSidebarActive(false)
                            }}
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <FaPowerOff className="h-7 w-7 " />
                                <span>Log Out</span>
                            </div>
                            </Button>
                        </li>
                    </ul>
                </div>
                
            </div>
        </div>
        

        <Button
            className={`select-none rounded-lg border p-2 lg:hidden`}
            onClick={() => setIsSidebarActive(!isSidebarActive)}
        >
            {isSidebarActive ? (
                <HiXMark className="text-xl" />
            ) : (
                <HiMiniBars3 className="text-xl" />
            )}
        </Button>
        </>
    )
}