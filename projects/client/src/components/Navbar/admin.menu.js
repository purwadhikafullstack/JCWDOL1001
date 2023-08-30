import { HiMiniBars3, HiXMark } from "react-icons/hi2";
import Button from "../Button"

export default function AdminNavMenu({isSidebarActive, setIsSidebarActive, isLogin, setIsLogin, user}) {
    return (
        <Button
            className={`select-none ${
              isSidebarActive ? "left-1" : "left-1/2"
            }  top-20 ml-1 cursor-pointer rounded-lg border  p-2 duration-300 lg:left-20 lg:hidden`}
            onClick={() => setIsSidebarActive(!isSidebarActive)}
          >
            {isSidebarActive ? (
              <HiXMark className="text-xl" />
            ) : (
              <HiMiniBars3 className="text-xl" />
            )}
          </Button>
    )
}