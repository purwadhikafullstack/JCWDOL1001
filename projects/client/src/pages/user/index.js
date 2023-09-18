import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./component.sidebar";
import { useLocation, useParams } from "react-router-dom";
import Profile from "./profile";
import Address from "./address";
import Password from "./password";
import Transaction from "./transaction";
import Email from "./email";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { HiArrowLeft, HiXMark } from "react-icons/hi2";

export default function UserPage({ user }) {
  const { context } = useParams();

  const profile = user.profile;

  const [mobileContextActive, setMobileContextActive] = useState(false);
  const [showHandleAddressPage, setShowHandleAddressPage] = useState({ show: false, context: "" });

  const renderPageContext = (context) => {
    const pageContext = {
      profile: <Profile />,
      address: <Address showHandleAddressPage={showHandleAddressPage} setShowHandleAddressPage={setShowHandleAddressPage}/>,
      email: <Email />,
      password: <Password />,
      transaction: <Transaction />,
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

  //   if (mobileContextActive) {
  //   document.body.style.overflow = "hidden";
  // }
  
  // if (!mobileContextActive) {
  //   document.body.style.overflow = "auto";
  // }
  }, [mobileContextActive]);

  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-4 lg:gap-4">
        <Sidebar
          profile={profile}
          user={user}
          setMobileContextActive={setMobileContextActive}
        />

        <div
          className={`absolute left-0 top-16 z-20 col-span-3 min-h-screen w-full border bg-slate-50 p-4 shadow-md duration-300 lg:static lg:z-0 lg:rounded-lg ${
            mobileContextActive
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {!showHandleAddressPage.show &&
            <div className="mb-4 lg:mb-0 w-full border-b-2 lg:border-b-0 lg:border-none bg-slate-50">
              <Button
                isBLock
                className={`mb-3 flex items-center gap-2 lg:hidden`}
                onClick={() => {
                  setMobileContextActive(false);
                }}
                >
                <HiXMark className="text-2xl" />
                <span className="font-semibold">Close</span>
              </Button>
            </div>
          }

            {renderPageContext(context)} 

        </div>
      </div>
    </div>
  );
}
