import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./component.sidebar";
import { useLocation, useParams } from "react-router-dom";
import Profile from "./profile";
import Address from "./address";
import Password from "./password";
import Transaction from "./transaction";
import Email from "./email";

export default function UserPage({ user }) {
  const { context } = useParams()

  const profile = user.profile

  const renderPageContext = (context) => {
    const pageContext = {
      profile : <Profile />,
      address : <Address />,
      email : <Email />,
      password : <Password />,
      transaction : <Transaction />
    }

    if (context in pageContext) {
      return pageContext[context];
    } else {
      return <div>Something was wrong</div>;
    }
  }

  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-y-4 lg:gap-4">
        <Sidebar profile={profile} user={user}/>
        <div className="col-span-3 bg-red-500 h-screen">
        { renderPageContext(context) }
        </div>
      </div>
    </div>
  )
}
