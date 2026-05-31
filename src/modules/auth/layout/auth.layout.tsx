import { Outlet } from "react-router";
import background from '@/assets/background_auth.jpg'
import logo from '@/assets/logowhite.png'
import { Toaster } from "react-hot-toast";

const AuthLayout = () => {

  return (
    <div className="flex h-screen w-screen bg-background text-onPrimary overflow-hidden">

      <div className="relative hidden md:flex md:w-1/2 lg:w-3/5">
        <div className="absolute inset-0 w-full h-full">
          <img src={background} alt="tienda negocios omni assisto" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-center px-6">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Bienvenido a</h1>
          <img src={logo} alt="Omni Asisto" className="w-1/2 lg:w-1/3 max-w-xs" />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 overflow-y-auto">
        <Toaster />
        <Outlet />
      </div>
    </div >
  );
};

export default AuthLayout;
