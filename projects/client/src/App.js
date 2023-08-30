import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/landingPage";
import "./App.css";
import AdminPage from "./pages/admin";


function App() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const [message, setMessage] = useState("");

  const user = { role: 1 }

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);
  return (
    <div>
      <Navbar     
        user={user}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage isSidebarActive={isSidebarActive} setIsSidebarActive={setIsSidebarActive}/>} />
        </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
