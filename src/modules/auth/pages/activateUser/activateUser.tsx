/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

// import logo from '@/assets/logo.png'
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import FormInput from "@/common/components/input";
import { Button } from "@/common/components/button";
import { FaEye } from "react-icons/fa";

import { useState } from "react";

import { routeNames } from "@/router/routes-names";
import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import AuthService from "../../services/auth.service";
type FormValues = {
  password: string,
}
const ActivateUserPage: React.FC = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const [typePassword, setTypePassword] = useState('password')
  const [loading, setLoading] = useState(false)



  const changeVisibilityPassword = () => {
    if (typePassword === 'password') {
      setTypePassword('text')
    } else {
      setTypePassword('password')
    }
  }

  const onSubmit = async ({ password }: FormValues) => {
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    if (loading) {
      return
    }
    try {
      await AuthService.activateUser(token!.toString(), password)
      toast.success("Usuario activado correctamente")
      navigate(routeNames.loginPage)
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      if (error !== CANCELLED_REQUEST) {
        toast.error(error.toString())
      }
    }
  }
  return (<>
    <div className="w-full h-full flex flex-col items-center p-10">
      <h4 className="text-2xl font-bold text-colorText my-20">Activar usuario</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-1 px-20">
        <FormInput
          label="Contraseña"
          name="password"
          placeholder="Ingrese su contraseña"
          type={typePassword}
          button={<FaEye />}
          functionButton={() => { changeVisibilityPassword() }}
          error={errors.password}
          register={register('password',
            {
              required: {
                value: true,
                message: "La contraseña es requerida"
              },
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres"
              },
              validate: (value: string) => {
                const pattern2 = /^[^\s]+$/;
                if (!value.match(pattern2)) {
                  return 'La contraseña no puede contener espacios';
                }
                return true;
              },
            })} />
        <div className="flex justify-end mt-5">
          <Button isLoading={loading} type="submit" variant="primary" size="lg">Aceptar</Button>
        </div>

      </form>
    </div>
  </>)
}


export default ActivateUserPage