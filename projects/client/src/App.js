import axios from "axios";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/landingPage";

// import AdminPage from "./components/Navbar/admin.nav.menu.js";
import Verification from "./pages/verification";

import { keepLogin } from "./store/slices/auth/slices";
import CategoryList from "./pages/admin/category";
import "./App.css";
import AdminProducts from "./pages/admin/product";
import Products from "./pages/user/products";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/LoadingSpinner";
import ProductDetail from "./pages/user/product.detail";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { pathname } = useLocation();

  const [message, setMessage] = useState("")

  const dispatch = useDispatch()

  const { user, isLogin } = useSelector(state => {
		return {
			user : state?.auth,
      isLogin : state?.auth?.isLogin
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

  if (loading) {
    return (
      <div className="grid place-content-center h-screen">
        <LoadingSpinner isLarge/>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} isLogin={isLogin} />
        <Routes>
          <Route path="/" element={<LandingPage />} />

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
            </>
          )}

          {!user?.role || user?.role == 2 && (
            <>
              {/* <Route path="/products" element={<Products />} /> */}
            </>
          )}

          <Route path="/verify/*" element={<Verification/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      {/* <Footer /> */}
      <ToastContainer />
    </div>
  );
}

export default App;
