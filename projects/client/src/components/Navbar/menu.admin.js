import Button from "../Button"
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiOutlineRectangleGroup,
  HiOutlineUser,
} from "react-icons/hi2";

export default function AdminPage({isSidebarActive}) {
    return (
        <aside
        className={`group fixed top-15 h-screen bg-white overflow-hidden border-r border-gray-300/40 py-16 duration-300  hover:shadow-xl lg:left-0 lg:w-[calc(5rem)] lg:hover:w-64 ${
        isSidebarActive ? "left-0 w-1/2" : "-left-full"
            }`}
        >
        <div className="flex flex-col justify-between">
            <div className="">
            <div className="mt-6 ">
                <ul className="space-y-2 px-4 font-medium tracking-wide">
                <li className="w-full space-y-2">
                    <Button
                    isLink
                    className="block w-full rounded-lg bg-primary py-3 text-white duration-300 lg:w-[52px] lg:group-hover:w-full"
                    >
                    <div className="flex w-max items-center gap-6 px-3 ">
                        <HiOutlineRectangleGroup className="h-7 w-7 " />
                        <span>Dashboard</span>
                    </div>
                    </Button>
                </li>
                <li className="w-full space-y-4">
                    <Button
                    isLink
                    className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                    >
                    <div className="flex w-max items-center gap-6 px-3 ">
                        <HiOutlineEnvelope className="h-7 w-7 " />
                        <span>Messages</span>
                    </div>
                    </Button>
                </li>
                <li className="w-full space-y-4">
                    <Button
                    isLink
                    className="block w-[60px] w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:group-hover:w-full"
                    >
                    <div className="flex w-max items-center gap-6 px-3 ">
                        <HiOutlineUser className="h-7 w-7 " />
                        <span>Profile</span>
                    </div>
                    </Button>
                </li>
                <li className="w-full space-y-4">
                    <Button
                    isLink
                    className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                    >
                    <div className="flex w-max items-center gap-6 px-3 ">
                        <HiOutlineClipboardDocumentList className="h-7 w-7 " />
                        <span>Tasks</span>
                    </div>
                    </Button>
                </li>
                <li className="w-full space-y-4">
                    <Button
                    isLink
                    className="block w-full rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                    >
                    <div className="flex w-max items-center gap-6 px-3 ">
                        <HiOutlineCog6Tooth className="h-7 w-7 " />
                        <span>Settings</span>
                    </div>
                    </Button>
                </li>
                </ul>
            </div>
            </div>
        </div>
        </aside>
    )
}