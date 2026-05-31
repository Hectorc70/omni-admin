

import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
// import { changeTitle } from "@/redux/globalSlice";
// import type { AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import type { IBusiness } from "@/models/Business/business.model";
import FormInput from "@/common/components/input";
import { Button } from "@/common/components/button";
import BusinessService from "@/modules/business/services/business.service";
import LoaderComponent from "@/common/components/loader";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useUser } from "@/hooks/use-user";
import ModalComponent from "@/common/components/modal";
import GoogleMapSelector from "@/common/components/map-selector";
import FormSelectWithSearch from "@/common/components/search-selected";
interface BussinessFormProps {
  onBeforeSubmit: () => Promise<void>;
  uuidBusiness: string
}

interface IBusinessContactFormValues extends IBusiness {
  phone_lada?: string;
  phone_local?: string;
}

const phoneLadaOptions = [
  { label: 'Estados Unidos / Caribe (+1)', value: '1' },
  { label: 'México (+52)', value: '52' },
  { label: 'Argentina (+54)', value: '54' },
  { label: 'Bolivia (+591)', value: '591' },
  { label: 'Brasil (+55)', value: '55' },
  { label: 'Chile (+56)', value: '56' },
  { label: 'Colombia (+57)', value: '57' },
  { label: 'Costa Rica (+506)', value: '506' },
  { label: 'Cuba (+53)', value: '53' },
  { label: 'Ecuador (+593)', value: '593' },
  { label: 'El Salvador (+503)', value: '503' },
  { label: 'Guatemala (+502)', value: '502' },
  { label: 'Honduras (+504)', value: '504' },
  { label: 'Nicaragua (+505)', value: '505' },
  { label: 'Panamá (+507)', value: '507' },
  { label: 'Paraguay (+595)', value: '595' },
  { label: 'Perú (+51)', value: '51' },
  { label: 'Uruguay (+598)', value: '598' },
  { label: 'Venezuela (+58)', value: '58' },
]

const phoneLadas = phoneLadaOptions.map((option) => option.value)

const getPhoneParts = (phoneNumber?: string) => {
  const digits = phoneNumber?.replace(/\D/g, '') || ''

  if (digits.length <= 10) {
    return {
      lada: '52',
      local: digits,
    }
  }

  const lada = [...phoneLadas]
    .sort((a, b) => b.length - a.length)
    .find((code) => digits.startsWith(code) && digits.length - code.length >= 6)

  if (lada) {
    return {
      lada,
      local: digits.slice(lada.length),
    }
  }

  return {
    lada: '52',
    local: digits,
  }
}

const BusinessContactForm: React.FC<BussinessFormProps> = ({ onBeforeSubmit, uuidBusiness }) => {
  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<IBusinessContactFormValues>({
    defaultValues: {
      phone_lada: '52',
    },
  })
  const { user } = useUser()

  const [showMap, setShowMap] = useState(false)

  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)

  const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error)

  useEffect(() => {
    if (user.business) {
      const phoneParts = getPhoneParts(user.business.phone_number)
      setValue('full_address', user.business.full_address)
      setValue('phone_lada', phoneParts.lada)
      setValue('phone_local', phoneParts.local)
      setValue('latitude', user.business.latitude)
      setValue('longitude', user.business.longitude)
    }
  }, [setValue, user.business])

  const onSubmit = async (data: IBusinessContactFormValues) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const requestData: IBusiness = { business_hours: [] };
      requestData.full_address = data.full_address?.toLowerCase()
      requestData.phone_number = `${data.phone_lada}${data.phone_local}`
      requestData.latitude = data.latitude
      requestData.longitude = data.longitude
      requestData.uuid = uuidBusiness
      await BusinessService.updateBusiness(requestData)
      toast.success('Datos editados correctamente')
      await onBeforeSubmit()

      setStatusScreen(ScreenStatus.success)

    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.success)
        toast.error(getErrorMessage(error))
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
          <div>
            <FormSelectWithSearch
              label="Lada"
              name="phone_lada"
              options={phoneLadaOptions}
              placeholder="Buscar país o lada"
              error={errors.phone_lada}
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "La lada es requerida"
                },
                validate: (value) => phoneLadas.includes(String(value || '')) || 'Seleccione una lada válida',
              }}
            />
            <FormInput label="Número de teléfono"
              name="phone_local"
              type="tel"
              placeholder="Ingrese el número"
              maxLength={12}
              error={errors.phone_local} register={register('phone_local', {
              required: {
                value: true,
                message: "El número de teléfono es requerido"
              },
                pattern: {
                  value: /^\d{6,12}$/,
                  message: "El número debe tener entre 6 y 12 dígitos"
                },
              })} />
          </div>
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
