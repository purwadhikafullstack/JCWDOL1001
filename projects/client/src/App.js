import axios from "axios";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/landingPage";

// import AdminPage from "./components/Navbar/admin.nav.menu.js";
import Verification from "./pages/verification";

import { keepLogin } from "./store/slices/auth/slices";
import CategoryList from "./pages/admin/category";
import "./App.css";
import AdminProducts from "./pages/admin/product";

function App() {
  const [message, setMessage] = useState("")

  const dispatch = useDispatch()

  const { user } = useSelector(state => {
		return {
			user : state?.auth
		}
	})
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}greetings`
      );
      setMessage(data?.message || "");
    })();
    
    const token = localStorage.getItem("token")
    
    if(token) return setIsLogin(true)

  }, [user] )
  return (
    <div>
      <Navbar user={user} isLogin={isLogin} setIsLogin={setIsLogin} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/categories" element={<CategoryList/>}/>
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/verify/*" element={<Verification/>} />

        </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
