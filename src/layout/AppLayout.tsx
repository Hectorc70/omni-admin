import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet } from "react-router";
import { TiThMenu } from "react-icons/ti";


const AppLayout = () => {
    const [isOpenSideBar, setIsSidebarOpen] = useState(false);

    const onOpenSideBAr = () => {
        setIsSidebarOpen(!isOpenSideBar);
    };
    return (
        <div className="flex gap-0 h-screen w-screen bg-primary px-0 m-0 overflow-auto text-onPrimary">
            {/* Sidebar */}
            <div className={ `h-screen flex-col items-start justify-center ${isOpenSideBar ? "w-52" : "w-16"} transform transition-all duration-300 z-50`}>
                <div
                    className=" p-4 text-onPrimary cursor-pointer w-full flex items-center justify-center"
                    onClick={onOpenSideBAr}
                >
                    <TiThMenu className="text-xl text-onPrimary" />
                </div>
                <Sidebar isOpen={isOpenSideBar} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-background mr-3 my-3 rounded-2xl p-2">
                {/* Header */}
                <Header/>

                {/* Page Content */}
                <main className="flex-1  p-1 overflow-auto w-full h-full bg-hintColor pb-2 rounded-2xl ">
                    <div className=" w-full h-full p-2 rounded-lg ">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div >
    );
};

export default AppLayout;
