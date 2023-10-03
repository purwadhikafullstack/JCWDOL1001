import axios from "axios";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CustomOrder from "./pages/admin/custom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/landingPage";
import Cart from "./pages/user/cart";
import Verification from "./pages/verification";
import { keepLogin } from "./store/slices/auth/slices";
import CategoryList from "./pages/admin/category";
import AdminProducts from "./pages/admin/product";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/LoadingSpinner";
import Products from "./pages/products";
import ProductDetail from "./pages/product-details";
import UploadRecipePage from "./pages/upload-recipe";
import DiscountPage from "./pages/admin/discount";
import UserPage from "./pages/user";
import AdminTransaction from "./pages/admin/transaction";
import ConfirmCustom from "./pages/user/confirmCustom";
import { getOngoingTransactions } from "./store/slices/transaction/slices";
import CheckoutPage from "./pages/user/transaction/checkout";
import ReportPage from "./pages/admin/report";
import QnAPage from "./pages/qna";
import ResetPassword from "./pages/reset-password";

function App() {
  const { pathname } = useLocation();

  const [message, setMessage] = useState("")

  const dispatch = useDispatch()

  const { user, isLogin, ongoingTransactions, isUpdateOngoingTransactionLoading } = useSelector(state => {
		return {
			user : state?.auth,
      isLogin : state?.auth?.isLogin,
      ongoingTransactions : state?.transaction?.ongoingTransactions,
      isUpdateOngoingTransactionLoading : state?.transaction?.isUpdateOngoingTransactionLoading,
		}
	})
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({top:0, left:0});
  }, [pathname]);
  
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}greetings`
      );
      setMessage(data?.message || "");
    })();
    
      dispatch(keepLogin()).finally(() => {
        setLoading(false);
      });
  }, [] )

  useEffect(()=>{
    if (isLogin) {
      dispatch(getOngoingTransactions())
    }
  }, [isUpdateOngoingTransactionLoading, isLogin])

  if (loading) {
    return (
      <div className="grid place-content-center h-screen">
        <LoadingSpinner isLarge/>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} isLogin={isLogin} ongoingTransactions={ongoingTransactions?.totalTransactions}/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/qna" element={<QnAPage />} />

          <Route path="/products" element={
            user?.role===1 ?
              <Navigate to="/admin/products"/>
              :
              <Products user={user}/>}
            />
          <Route path="/products/:id" element={
            user?.role===1 ?
              <Navigate to="/admin/products"/>
              :
              <ProductDetail user={user}/>}
            />

          {user?.role == 1 && (
            <>
              <Route path="/admin/products" element={<AdminProducts user={user}/>} />
              <Route path="/admin/categories" element={<CategoryList />}/>
              <Route path="/admin/discount" element={<DiscountPage />}/>
              <Route path="/admin/custom" element={<CustomOrder />}/>
              <Route path="/admin/transaction" element={<AdminTransaction ongoingTransactions={ongoingTransactions}/>}/>
              <Route path="/admin/report" element={<ReportPage />}/>
            </>
          )}

          {!user?.role || user?.role == 2 && (
            <>
              <Route path="/user/" element={<Navigate to={`/user/profile`}/>} />
              <Route path="/user/:context" element={<UserPage user={user} ongoingTransactions={ongoingTransactions}/>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/upload-recipe/" element={<UploadRecipePage/>} />
              <Route path="/checkout" element={<CheckoutPage/>}/>
            </>
          )}
          <Route path="/reset-password/*" element={<ResetPassword/>}/>
          <Route path="/confirm/*" element={<ConfirmCustom/>} />     
          <Route path="/verify/*" element={<Verification/>} />     
          <Route path="*" element={<NotFound />} />
        </Routes>

      {/* <Footer /> */}
      <ToastContainer 
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={true}
        progress={undefined}
        theme="light"
      />
    </div>
  );
}

export default App;
