import { useDispatch, useSelector } from "react-redux";
import UserSidebar from "./component.sidebar";
import { useLocation, useParams } from "react-router-dom";
import Profile from "./profile";
import Address from "./address";
import Password from "./password";
import Transaction from "./transaction";
import Email from "./email";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { HiArrowLeft, HiArrowLongLeft, HiXMark } from "react-icons/hi2";
import Modal from "../../components/Modal";
import ForumPage from "./forum";

export default function UserPage({ user, ongoingTransactions }) {
  const { context } = useParams();

  const profile = user.profile;

  const [mobileContextActive, setMobileContextActive] = useState(false);
  const [showHandlePageContext, setShowHandlePageContext] = useState({
    show: false,
    context: "",
  });

  const renderPageContext = (context) => {
    const pageContext = {
      profile: <Profile />,

      address: (
        <Address
          showHandlePageContext={showHandlePageContext}
          setShowHandlePageContext={setShowHandlePageContext}
          user={user}
        />
      ),

      email: <Email />,

      password: <Password />,
      
      transaction: (
        <Transaction
          showHandlePageContext={showHandlePageContext}
          setShowHandlePageContext={setShowHandlePageContext}
          ongoingTransactions={ongoingTransactions}
        />
      ),

      qna:(<ForumPage/>)
    };

    if (context in pageContext) {
      return pageContext[context];
    } else {
      return <div>Something was wrong</div>;
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [mobileContextActive]);

  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-4 lg:gap-4">
        <UserSidebar
          profile={profile}
          user={user}
          setMobileContextActive={setMobileContextActive}
          ongoingTransactions={ongoingTransactions}
        />

        <div
          className={`absolute left-0 top-16 z-20 col-span-3 min-h-[125vh] w-full border bg-slate-50 p-4 shadow-md duration-300 lg:static lg:z-0 lg:rounded-lg overflow-hidden ${
            mobileContextActive
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {!showHandlePageContext.show && (
            <div className="mb-4 w-full border-b-2 bg-slate-50 lg:mb-0 lg:border-b-0 lg:border-none">
              <Button
                isBLock
                className={`mb-3 flex items-center gap-2 lg:hidden`}
                onClick={() => {
                  setMobileContextActive(false);
                }}
              >
                <HiArrowLongLeft className="text-2xl" />
                <span className="font-semibold">Kembali</span>
              </Button>
            </div>
          )}


          {renderPageContext(context)}
        </div>
      </div>
    </div>
  );
}
