import { NavLink, useNavigate } from "react-router-dom";
import { routeNames } from "@/router/routes-names";
import toast from "react-hot-toast";
import { appVersion } from "@/common/constants";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { FaSignOutAlt, FaClipboardList, FaPeopleArrows } from "react-icons/fa";
import type { IModule } from "@/models/User/user.model";
import { AiFillHome } from "react-icons/ai";

import { IoNotificationsSharp } from "react-icons/io5";

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const navigate = useNavigate();
    const modulesList = useSelector((state: RootState) => state.user.modules);

    const signOut = () => {
        localStorage.clear();
        navigate(routeNames.loginPage);
        toast.success('Sesión cerrada')
    }
    return (
        <aside
            className={`max-h-full w-full text-onBackground  flex  flex-col items-center justify-between overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "w-48" : "w-16"}`}
        >
            {/* Logo */}
            {/* {isOpen && <div className={`flex items-center justify-center w-30`}>
                <img src={logo} alt="logo" className="w-full" />
            </div>} */}

            {/* Menu Items */}
            <nav className="flex-1 space-y-4 mt-10  px-2 w-full">
                {modulesList.map((module: IModule) => (
                    <NavLink
                        about={module.name}
                        key={module.name}
                        to={module.route}
                        title={module.label}
                        className={({ isActive }) =>
                            `group relative flex ${!isOpen ? "flex-col justify-center p-2 gap-1" : "px-3 py-2 gap-3"} items-center  rounded-md  text-sm font-medium transition-colors hover:bg-primaryHover
                        ${isActive
                                ? "bg-primaryHover text-white shadow-inner border-l-4 border-white"
                                : "hover:primaryHover hover:text-white text-onPrimary"}`
                        }
                    >
                        {/* Icono */}

                        {module.name === "business_owner" && <AiFillHome />}
                        {module.name === "business_customers" && <FaPeopleArrows />}
                        {module.name === "business_notifications_templates" && <IoNotificationsSharp />}
                        {module.name === "orders" && <FaClipboardList />}
                        {<span className={`sm:block ${!isOpen && "text-xs text-center truncate"}`}>
                            {module.label}
                        </span>}
                    </NavLink>
                ))}
            </nav>
            {/* Bottom section (sign out) */}
            <div className="px-2 py-4 flex flex-col items-center w-full  bottom-5">
                <span
                    onClick={signOut}
                    title="Cerrar sesión"
                    className="group cursor-pointer min-w-full flex items-center gap-3 rounded-md px-3 py-2
                    text-sm font-medium  hover:text-onPrimary transition-colors hover:bg-hoverPrimary justify-between"
                >
                    <FaSignOutAlt className="text-lg text-onPrimary" />
                    {isOpen && <span className={`${!isOpen && "hidden"} sm:block truncate text-onPrimary`}>
                        Cerrar sesión
                    </span>}
                </span>

                <span className="text-[10px] text-onPrimary mt-5">{isOpen && "Versión"} {appVersion}</span>
            </div>
        </aside>
    );
};

export default Sidebar;
