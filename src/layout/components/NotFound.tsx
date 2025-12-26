/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/common/components/button"
import { useNavigate } from "react-router"



const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  return (<>

    <div className="w-full h-full py-10 flex  flex-col justify-center items-center bg-background rounded-lg">
      <span className="text-colorText text-2xl text-center mt-5">Página no encontrada</span>
      <span className=" text-9xl text-center mt-5 mb-10 font-bold text-red-300">404</span>
      <Button type="button" onClick={() => navigate(-1)} children="Regresar" />
    </div>
  </>)
}


export default NotFoundPage