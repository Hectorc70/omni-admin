import { Outlet } from "react-router";
import background from '@/assets/background_auth.jpg'
import logo from '@/assets/logo.png'
import  { Toaster } from "react-hot-toast";

const AuthLayout = () => {

  return (
    <div className="flex gap-0 h-screen w-screen bg-background px-0 m-0 overflow-auto text-onPrimary  justify-between">

      <div className="w-[60%] relative">
        <div className="w-full h-full">
          <img src={background} alt="tienda negocios valanza" className="w-full h-full object-cover"/>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-2">Bienvenido a</h1>
          <img src={logo} alt="" className="w-1/3"/>
        </div>
      </div>
      <div className="w-[40%] h-full">
        <Toaster />
        <Outlet />
      </div>
    </div >
  );
};

export default AuthLayout;
