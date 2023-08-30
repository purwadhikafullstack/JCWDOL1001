import { useEffect } from "react";
import Sidebar from "./component.sidebar";

export default function AdminPage({ isSidebarActive, setIsSidebarActive }) {
  useEffect(()=>{
    if (isSidebarActive) {
      document.body.style.overflow = "hidden";    
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarActive])
  return (
    <>
      <div className="relative ">

        <Sidebar isSidebarActive={isSidebarActive} setIsSidebarActive={setIsSidebarActive} />

        <main className="container bg-slate-50 lg:ml-auto lg:w-[calc(100%-4rem)] h-[200vh]">
          <div className="mx-auto py-24">
            <div className="lg:px-12">
              <div className="">
                <span className="text-gray-500 dark:text-gray-200">asd</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>

  );
}
