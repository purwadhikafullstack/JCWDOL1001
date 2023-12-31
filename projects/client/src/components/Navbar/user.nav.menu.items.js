import { useLocation } from "react-router-dom"
import Button from "../Button"
import { HiDocumentText, HiMiniChatBubbleOvalLeftEllipsis, HiMiniSquares2X2 } from "react-icons/hi2"

export default function UserNavMenuItems({ user, ongoingTransactions }) {
  const { pathname } = useLocation()

  return (
    <div className="flex w-full justify-between items-center lg:justify-end gap-10">
      <Button
        isLink
        path="/products"
        className={`flex flex-col items-center gap-1 text-xs ${ pathname === "/products" ? "text-primary" : "text-slate-500"}`}
      >
        <HiMiniSquares2X2 className="text-2xl" />
        <span>Produk</span>
      </Button>

      <Button
        isLink
        path="/upload-recipe"
        className={`text-center flex flex-col items-center gap-1 text-xs lg:hidden ${ pathname === "/upload-recipe" ? "text-primary" : "text-slate-500"}`}
      >
        <HiDocumentText className="text-2xl" />
        <span className="">Unggah Resep</span>
      </Button>

      <Button
        isLink
        path="/qna"
        className={`flex flex-col items-center gap-1 text-xs ${ pathname === "/qna" ? "text-primary" : "text-slate-500" } `}
      >
        <HiMiniChatBubbleOvalLeftEllipsis className="text-2xl"/>
        QnA
      </Button>

      <Button
        isLink
        path={pathname.includes("user")  ? null : "/user/profile"}
        className={`flex flex-col items-center gap-1 text-xs lg:hidden ${  pathname === "/user/profile" ? "text-primary" : "text-slate-500"}`}
      >
        <div className={`profile-img-wrapper`}>
          <div
            className={`nav-profile-img aspect-square w-7 cursor-pointer self-center overflow-hidden rounded-full md:mb-0 border`}
          >
            {user?.profile?.profilePicture ?
              <img
                src={process.env.REACT_APP_CLOUDINARY_BASE_URL + user?.profile?.profilePicture}
                alt=""
                className="h-full w-full object-cover"
              />
            :
              <div className="flex justify-center items-center bg-primary w-full h-full text-white font-semibold text-lg">
                {user?.profile.name.charAt(0)}
              </div>
            }

            {ongoingTransactions > 0 &&
              <span className="absolute w-4 h-4 flex justify-center items-center rounded-full bg-danger right-6 bottom-6 text-white group-hover:right-1 text-[12px]">
                {ongoingTransactions}
              </span>
            }
          </div>
        </div>
        <span className={user?.status === 0 && "text-danger"}>Saya</span>
      </Button>
    </div>
  );
}
