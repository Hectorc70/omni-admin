/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

// import logo from '@/assets/logo.png'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import FormInput from "@/common/components/input";
import { Button } from "@/common/components/button";
import { FaEye } from "react-icons/fa";

import { useState } from "react";

import { routeNames } from "@/router/routes-names";
import { CANCELLED_REQUEST, handleError } from "@/common/utils/errors.util";
import AuthService from "../../services/auth.service";
type FormValues = {
  email: string,
  password: string,
}
const LoginPage: React.FC = () => {

  const navigate = useNavigate()
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

  const handleLoginEmail = async (data: FormValues) => {
    try {
      setLoading(true)
      // const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      // console.log("ID Token:", idToken);
      // await onLogin(idToken)

    } catch (err: any) {
      const message = handleError(err)
      console.error("Error login email:", err);
      toast.error(message)
      setLoading(false)
    }
  };
  const onLogin = async (idToken: string) => {
    if (loading) {
      return
    }
    try {
      await AuthService.login(idToken)
      navigate(routeNames.homePage)
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
      <h4 className="text-2xl font-bold text-colorText my-20">Iniciar sesión</h4>
      <form onSubmit={handleSubmit(handleLoginEmail)} className="w-full flex flex-col gap-1 px-20">
        <FormInput label="Correo electrónico"
          name="email"
          type="email"
          placeholder="Ingrese su correo"
          error={errors.email} register={register('email',
            {
              required: {
                value: true,
                message: "El correo es requerido"
              },
              validate: (value: string) => {
                const pattern2 = /^[^\s]+$/;
                if (!value.match(pattern2)) {
                  return 'El correo no puede contener espacios';
                }
                return true;
              },
            })} />
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
              validate: (value: string) => {
                const pattern2 = /^[^\s]+$/;
                if (!value.match(pattern2)) {
                  return 'La contraseña no puede contener espacios';
                }
                return true;
              },
            })} />
        <div className="flex justify-end mt-5">
          <Button isLoading={loading} type="submit" variant="primary" size="lg">Iniciar sesión</Button>
        </div>

      </form>
      <section className="mt-20 w-full text-center">
        <span className="text-md text-colorText text-center">¿No tienes una cuenta?</span>
        <Button onClick={() => { navigate(routeNames.registerPage) }} variant="secondary" size="lg" className="mt-2">Crear una cuenta</Button>
      </section>
    </div>
  </>)
}


export default LoginPage