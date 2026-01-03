

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
interface BussinessFormProps {
  onBeforeSubmit: () => Promise<void>;
  uuidBusiness: string
}

const BusinessContactForm: React.FC<BussinessFormProps> = ({ onBeforeSubmit, uuidBusiness }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IBusiness>()
  const { user } = useUser()

  const [showMap, setShowMap] = useState(false)

  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const init = async () => {
    if (user.business) {
      setValue('full_address', user.business.full_address)
      setValue('latitude', user.business.latitude)
      setValue('longitude', user.business.longitude)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const onSubmit = async (data: IBusiness) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const requestData: IBusiness = { business_hours: [] };
      requestData.full_address = data.full_address?.toLowerCase()
      requestData.latitude = data.latitude
      requestData.longitude = data.longitude
      requestData.uuid = uuidBusiness
      await BusinessService.updateBusiness(requestData)
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