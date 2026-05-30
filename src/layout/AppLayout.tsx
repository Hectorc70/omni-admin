import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Outlet } from "react-router";
import { TiThMenu } from "react-icons/ti";


const AppLayout = () => {
    const [isOpenSideBar, setIsSidebarOpen] = useState(() => window.matchMedia("(min-width: 1024px)").matches);

    const onOpenSideBAr = () => {
        setIsSidebarOpen(!isOpenSideBar);
    };
    return (
        <div className="relative flex h-screen w-screen bg-primary px-0 m-0 overflow-hidden text-onPrimary">
            {isOpenSideBar && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onOpenSideBAr}
                />
            )}
            {/* Sidebar */}
            <div className={`
                fixed lg:relative z-50 h-screen flex-col items-start justify-center
                bg-primary shadow-xl lg:shadow-none border-r border-white/10
                transform transition-all duration-300 ease-in-out
                ${isOpenSideBar ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
                ${isOpenSideBar ? "lg:w-52" : "lg:w-16"}
                w-64 lg:w-auto
            `}>
                <div
                    className="p-4 text-onPrimary cursor-pointer w-full flex items-center justify-center"
                    onClick={onOpenSideBAr}
                >
                    <TiThMenu className="text-xl text-onPrimary" />
                </div>
                <Sidebar isOpen={isOpenSideBar} />
            </div>
            {/* Main Content */}
            <div className={`
                flex-1 min-w-0 flex flex-col bg-background
                lg:mr-3 lg:my-3
                rounded-none lg:rounded-2xl
                p-2
                ${isOpenSideBar ? "pointer-events-none lg:pointer-events-auto" : ""}
            `}>
                <button
                    type="button"
                    className="lg:hidden fixed top-3 left-3 z-30 bg-primary p-2 rounded-md hover:bg-hoverPrimary"
                    onClick={onOpenSideBAr}
                >
                    <TiThMenu className="text-xl text-onPrimary" />
                </button>
                {/* Header */}
                <div className="pl-12 lg:pl-0">
                    <Header />
                </div>

                {/* Page Content */}
                <main className="flex-1 p-2 overflow-hidden w-full h-full bg-hintColor pb-2 rounded-2xl">
                    <Outlet />
                </main>
            </div>
        </div >
    );
};

export default AppLayout;
