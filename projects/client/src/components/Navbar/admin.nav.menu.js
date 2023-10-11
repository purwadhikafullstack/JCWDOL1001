import { useDispatch } from "react-redux";
import { FaList, FaPowerOff } from "react-icons/fa6";
import Button from "../Button";
import { logout } from "../../store/slices/auth/slices";
import {
  HiBanknotes,
  HiClipboardDocumentCheck,
  HiClipboardDocumentList,
  HiMiniBars3,
  HiMiniChatBubbleOvalLeftEllipsis,
  HiSquares2X2,
  HiXMark,
} from "react-icons/hi2";
import { BiSolidDiscount } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminNavMenu({
  isSidebarActive,
  setIsSidebarActive,
  ongoingTransactions,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const onClickLogOut = () => {
    dispatch(logout()).finally(() => {
        navigate("/");
      });
  };

  const { pathname } = useLocation();

  const menu = [
    {
      title: "Produk",
      path: "/admin/products",
      notification: null,
      icon: <HiSquares2X2 className="h-7 w-7 " />,
    },
    {
      title : "Pesanan Resep",
      path : "/admin/custom",
      icon : <HiClipboardDocumentList className="h-7 w-7"/>
  },
    {
      title: "Kategori",
      path: "/admin/categories",
      notification: null,
      icon: <FaList className="h-7 w-7 " />,
    },
    {
      title: "Transaksi",
      path: "/admin/transaction/1",
      notification: ongoingTransactions,
      icon: <HiBanknotes className="h-7 w-7 " />,
    },
    {
      title: "Diskon",
      path: "/admin/discount",
      notification: null,
      icon: <BiSolidDiscount className="h-7 w-7 " />,
    },
    {
      title: "QnA",
      path: "/admin/qna",
      notification: null,
      icon: <HiMiniChatBubbleOvalLeftEllipsis className="h-7 w-7 " />,
    },
    {
      title: "Laporan",
      path: "/admin/report",
      notification: null,
      icon: <HiClipboardDocumentCheck className="h-7 w-7 " />,
    },
  ];
  return (
    <>
      <div
        className={`group fixed top-0 mt-16 h-[200vh] overflow-hidden border border-gray-300/40 bg-slate-100 py-10 shadow-xl  duration-300 lg:left-0 lg:w-[calc(5rem)] lg:hover:w-64
        ${isSidebarActive ? "left-0 w-full" : "-left-full"}
        `}
      >
        <div className="flex flex-col justify-between">
          <div className="">
            <ul className="space-y-2 px-4 font-medium tracking-wide">
              {menu.map((item, index) => (
                <li key={index} className="w-full space-y-2">
                  <Button
                    isLink
                    path={item.path}
                    onClick={() => setIsSidebarActive(false)}
                    className={`relative block w-full rounded-lg border py-3 duration-300 lg:w-[52px] lg:group-hover:w-full ${
                      pathname.split("/").slice(0,3).join("/") === item.path.split("/").slice(0,3).join("/")
                        ? "border-primary bg-primary text-white"
                        : "border-dark text-dark hover:bg-slate-200"
                    }`}
                  >
                    <div className="flex w-max items-center gap-6 px-3 ">
                      {item.icon}
                      <span>{item.title}</span>

                      {item.notification > 0 && (
                        <span className="absolute right-1 lg:-right-2 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-xs text-white">
                          {Math.min(99, item.notification)}
                        </span>
                      )}

                    </div>
                  </Button>
                </li>
              ))}

              <li className="w-full space-y-4">
                <Button
                  className="block w-full border border-dark rounded-lg bg-inherit py-3 text-dark duration-200 hover:bg-slate-200 lg:w-[52px] lg:group-hover:w-full"
                  onClick={() => {
                    onClickLogOut();
                    setIsSidebarActive(false);
                  }}
                >
                  <div className="flex w-max items-center gap-6 px-3 ">
                    <FaPowerOff className="h-7 w-7 " />
                    <span>Keluar</span>
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
  );
}
