

import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
import { changeTitle } from "@/redux/global.slice";
import type { AppDispatch } from "@/redux/store";
import {useEffect, useLayoutEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {useForm } from "react-hook-form";
import type { IBusiness } from "@/models/Business/business.model";
import FormInput from "@/common/components/input";
import FormTextarea from "@/common/components/text-area";
import FormFileInput from "@/common/components/input-file";
import { Button } from "@/common/components/button";
import BusinessService from "@/modules/business/services/business.service";
import LoaderComponent from "@/common/components/loader";
import { useUser } from "@/hooks/use-user";
interface BussinessFormProps {
  onBeforeSubmit: () => Promise<void>;
}

const BusinessForm: React.FC<BussinessFormProps> = ({ onBeforeSubmit }) => {
  const { business } = useUser()
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IBusiness>()

  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  useLayoutEffect(() => {
    dispatch(changeTitle("Configura tu negocio"));
  }, [])
  const onSubmit = async (data: IBusiness) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      if (business?.uuid) {
        data.uuid = business.uuid
        await BusinessService.updateBusiness(data)
        await onBeforeSubmit()
        toast.success('Negocio actualizado exitosamente')
        setStatusScreen(ScreenStatus.success)
        return
      }
      setStatusScreen(ScreenStatus.success)
    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.success)
        toast.error(error.toString())
      }
    }
  }

  const init = async () => {
    setValue('name', business?.name || '')
    setValue('description', business?.description || '')
  }

  useEffect(() => {
    init()
  }, [])
  return (<>
    {statusScreen === ScreenStatus.loading && <LoaderComponent />}
    {
      statusScreen === ScreenStatus.success && <form className="bg-background " onSubmit={handleSubmit(onSubmit)}>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-top">
          <FormInput label="Nombre de tú negocio"
            name="name"
            placeholder="Nombre de tú negocio"
            maxLength={100}
            error={errors.name} register={register('name',
              {
                required: {
                  value: true,
                  message: "El nombre es requerido"
                },
              })} />
          {/* <FormSelect label="Categoría de tu negocio"
            options={
              [
                { label: 'Tiendas', value: 1 },
                { label: 'Alimentos', value: 3 },
                { label: 'Mascotas', value: 4 },
                { label: 'Salud y belleza', value: 5 },
                { label: 'Hogar', value: 6 },
              ]
            }
            name="price"
            placeholder="Selecciona la categoría"
            error={errors.category?.id} register={register('category.id',
              {
                required: {
                  value: true,
                  message: "La categoría es requerida"
                },
              })} /> */}

        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 mt-5">
          <FormTextarea label="Descripción de tú negocio"
            name="description"
            placeholder="Describe de que trata tu negocio, sus productos y servicios"
            maxLength={100}
            error={errors.description} register={register('description',
              {
                required: {
                  value: true,
                  message: "La descripción es requerido"
                },
              })} />
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <FormFileInput label="Logo de tú negocio"
            name="logoFile"
            error={errors.logoFile} register={register('logoFile',
              {
                required: {
                  value: business!.logo ? false : true,
                  message: "El logo es requerido"
                },
              })} />
        </div>
        <div className="flex justify-end mt-10">
          <Button onClick={handleSubmit(onSubmit)}>Guardar</Button>
        </div>
      </form>
    }

  </>)
}

export default BusinessForm