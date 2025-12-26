

import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
// import { changeTitle } from "@/redux/globalSlice";
// import type { AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import type { IBusiness, IPhone } from "@/models/Business/business.model";
import FormInput from "@/common/components/input";
import { Button } from "@/common/components/button";
import BusinessService from "@/modules/business/services/business.service";
import LoaderComponent from "@/common/components/loader";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useUser } from "@/hooks/use-user";
import ModalComponent from "@/common/components/modal";
import GoogleMapSelector from "@/common/components/map-selector";
interface BussinessFormProps {
  onBeforeSubmit: () => Promise<void>;
  uuidBusiness: string
}

const BusinessContactForm: React.FC<BussinessFormProps> = ({ onBeforeSubmit, uuidBusiness }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IBusiness>()
  const { register: registerPhone1, formState: { errors: errorsPhone1 }, getValues: getValuePhone1, trigger: triggerPhone, setValue: setValuePhone } = useForm<IPhone>()
  const { register: registerPhone2, formState: { errors: errorsPhone2 }, getValues: getValuePhone2, trigger: triggerPhone2, setValue: setValuePhone2 } = useForm<IPhone>()
  const { user } = useUser()

  const [showMap, setShowMap] = useState(false)

  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const init = async () => {
    if (user.business) {
      setValue('email', user.business.email)
      setValue('full_address', user.business.full_address)
      setValue('latitude', user.business.latitude)
      setValue('longitude', user.business.longitude)
      if (user.business.phones) {
        setValuePhone('number_phone', user.business.phones[0].number_phone.replace('+52', ''))
        if (user.business.phones.length > 1) {
          setValuePhone2('number_phone', user.business.phones[1].number_phone.replace('+52', ''))
        }
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  const onSubmit = async (data: IBusiness) => {
    try {
      const phone1 = getValuePhone1('number_phone')
      const resultphone = await triggerPhone('number_phone')
      if (!resultphone) return
      const phone2 = getValuePhone2('number_phone')
      if (phone2) {
        const resultphone = await triggerPhone2('number_phone')
        if (!resultphone) return
      }
      setStatusScreen(ScreenStatus.loading)
      const contacts: IPhone[] = []
      if (phone1) {
        let idPhone = undefined
        if (user.business?.phones?.length! > 0) {
          idPhone = user?.business?.phones![0].id ?? undefined
        }
        contacts.push({ number_phone: `+52${phone1}`, name: 'Contacto 1', id: idPhone })
      }
      if (phone2) {
        let idPhone = undefined
        if (user.business?.phones?.length! > 1) {
          idPhone = user?.business?.phones![1].id ?? undefined
        }
        contacts.push({ number_phone: `+52${phone1}`, name: 'Contacto 2', id: idPhone })
      }
      const requestData: IBusiness = { business_hours: [] };
      requestData.phones = contacts
      requestData.email = data.email?.toLowerCase()
      requestData.full_address = data.full_address?.toLowerCase()
      requestData.latitude = data.latitude
      requestData.longitude = data.longitude
      requestData.uuid = uuidBusiness
      await BusinessService.updateContactInfo(requestData)
      toast.success('Datos editados correctamente')
      await onBeforeSubmit()

      setStatusScreen(ScreenStatus.success)

    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.success)
        toast.error(error.toString())
      }
    }
  }

  const onLocationSelect = (lat: number, lng: number, address: string) => {
    setShowMap(false)
    setValue('full_address', address)
    setValue('latitude', lat)
    setValue('longitude', lng)
  }

  return (<>
    {statusScreen === ScreenStatus.loading && <LoaderComponent />}
    {
      statusScreen === ScreenStatus.success && <form className="bg-background " onSubmit={handleSubmit(onSubmit)}>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-top">
          <FormInput label="Correo de contacto"
            name="email"
            placeholder="Correo de contacto"
            type="email"
            error={errors.email} register={register('email',
              {
                required: {
                  value: true,
                  message: "El correo es requerido"
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo no valido"
                }
              })} />
          <FormInput label="Ubicación de tu negocio"
            name="full_address"
            disabled={true}
            placeholder="Seleccione la ubicación de tu negocio"
            maxLength={100}
            button={<FaMapMarkerAlt onClick={() => setShowMap(true)} className="text-primary text-2xl cursor-pointer" />}
            functionButton={() => { }}
            error={errors.full_address} register={register('full_address',
              {
                required: {
                  value: true,
                  message: "La ubicación es requerida"
                },
              })} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="flex gap-1  w-full justify-between">
            <div className="w-44">
              <FormInput label="Codigo de país"
                name="lada"
                value={"+52"}
                disabled={true}
              />
            </div>
            <FormInput label="Número de contacto 1"
              name="phone1"
              placeholder="solo numeros"
              type="text"
              maxLength={10}
              error={errorsPhone1.number_phone} register={registerPhone1('number_phone',
                {
                  required: {
                    value: true,
                    message: "El número es requerido"
                  },
                  validate: (value) => {
                    if (!value) return "El número es obligatorio";
                    if (value.length !== 10) return "Debe tener exactamente 10 dígitos";
                    if (!/^\d+$/.test(value)) return "Solo se permiten números";
                    return true;
                  }
                })} />
          </div>
          <div className="flex gap-1  w-full justify-between">
            <div className="w-44">
              <FormInput label="Codigo de país"
                name="lada"
                value={"+52"}
                disabled={true}
              />
            </div>
            <FormInput label="Número de contacto 2"
              name="phone2"
              placeholder="Solo numeros"
              type="text"
              maxLength={10}
              error={errorsPhone2.number_phone} register={registerPhone2('number_phone',
                {
                  required: {
                    value: false,
                    message: ""
                  },
                  validate: (value) => {
                    if (!value) return "El número es obligatorio";
                    if (value.length !== 10) return "Debe tener exactamente 10 dígitos";
                    if (!/^\d+$/.test(value)) return "Solo se permiten números";
                    return true;

                  }
                })} />
          </div>


        </div>
        <div className="flex justify-end mt-10">
          <Button onClick={handleSubmit(onSubmit)}>Guardar</Button>
        </div>
      </form>
    }

    <ModalComponent show={showMap} setShow={() => setShowMap(false)}
      disableClose={false}
      statusModal={
        ScreenStatus.success
      }
      title='Seleccionar ubicación de tú negocio'
      messageError='Ocurrio algo inesperado'
    >
      <div className="w-full h-full">
        <GoogleMapSelector onLocationSelect={onLocationSelect} initalLocation={[Number(user.business?.latitude), Number(user.business?.longitude)]} />
      </div>
    </ModalComponent>
  </>)
}

export default BusinessContactForm