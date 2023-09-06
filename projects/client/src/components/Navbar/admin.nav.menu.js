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

export default function AdminNavMenu({isSidebarActive, setIsSidebarActive, isLogin, setIsLogin, user}) {
    const dispatch = useDispatch()

    const onClickLogOut = () => {
        dispatch(logout())
    }
    return (
        <>
        <div
        className={`group mt-16 fixed top-0 h-screen bg-slate-100 overflow-hidden border border-gray-300/40 py-16 duration-300  shadow-xl lg:left-0 lg:w-[calc(5rem)] lg:hover:w-64 ${
        isSidebarActive ? "left-0 w-2/3" : "-left-full"
            }`}
        >
            <div className="flex flex-col justify-between">
                <div className="">
                    <ul className="space-y-2 px-4 font-medium tracking-wide">
                        <li className="w-full space-y-2">
                            <Button
                            isLink
                            path="/admin/products"
                            className="block w-full rounded-lg bg-primary py-3 text-white duration-300 lg:w-[52px] lg:group-hover:w-full"
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <HiSquares2X2 className="h-7 w-7 " />
                                <span>Products</span>
                            </div>
                            </Button>
                        </li>

                        <li className="w-full space-y-4">
                            <Button
                            isLink
                            path="/admin/categories"
                            className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <FaList className="h-7 w-7 " />
                                <span>Categories</span>
                            </div>
                            </Button>
                        </li>

                        <li className="w-full space-y-4">
                            <Button
                            isLink
                            path="/admin/transaction"
                            className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:group-hover:w-full"
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <HiBanknotes className="h-7 w-7 " />
                                <span>Transaction</span>
                            </div>
                            </Button>
                        </li>

                        <li className="w-full space-y-4">
                            <Button
                            isLink
                            path="/admin/discount"
                            className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <BiSolidDiscount className="h-7 w-7 " />
                                <span>Discount</span>
                            </div>
                            </Button>
                        </li>

                        <li className="w-full space-y-4">
                            <Button
                            isLink
                            path="/admin/qna"
                            className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <HiMiniChatBubbleOvalLeftEllipsis className="h-7 w-7 " />
                                <span>QnA</span>
                            </div>
                            </Button>
                        </li>

                        <li className="w-full space-y-4">
                            <Button
                            isLink
                            path="/admin/report"
                            className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                            >
                            <div className="flex w-max items-center gap-6 px-3 ">
                                <HiClipboardDocumentList className="h-7 w-7 " />
                                <span>Report</span>
                            </div>
                            </Button>
                        </li>

                        <li className="w-full space-y-4">
                            <Button
                            className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                            onClick={onClickLogOut}
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