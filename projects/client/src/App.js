import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [message, setMessage] = useState("");

  const user = 1;

  const [isLogin, setIsLogin] = useState(true);

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
      <Navbar user={user} isLogin={isLogin} setIsLogin={setIsLogin} />
       {message}
      <Footer />
    </div>
  );
}

export default App;
