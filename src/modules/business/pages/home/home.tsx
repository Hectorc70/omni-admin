import ModalComponent from "@/common/components/modal";
import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import BusinessForm from "./components/business-form";
import { useUser } from "@/hooks/use-user";
import CardContainerComponent from "@/common/components/card-container";
import BusinessContactForm from "./components/business-contact-form";


const HomePage: React.FC = () => {
  const [showBusinessModal, setShowBusinessModal] = useState(false)
  const [showBusinessContactModal, setShowBusinessContactModal] = useState(false)

  const { user, fetchUser } = useUser()

  const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error)

  const getData = useCallback(async () => {
    try {
      const userResponse = await fetchUser()
      if (!userResponse.business) {
        setShowBusinessModal(true)
      }
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        toast.error(getErrorMessage(error))
      }
    }
  }, [fetchUser])

  useEffect(() => {
    queueMicrotask(() => {
      void getData()
    })
  }, [getData])

  const closeBussinessModal = async () => {
    await getData()
    setShowBusinessModal(false)
  }
  const onSubmitContact = async () => {
    await getData()
    setShowBusinessContactModal(false)
  }
  return (<>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <div className="w-full h-full grid gap-5 grid-cols-1 sm:grid-cols-2 max-h-[400px]">
      <CardContainerComponent title="Datos de tú negocio" onEditAction={() => setShowBusinessModal(true)}>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Logo */}
          <div className="flex flex-col">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
              <img
                src={user?.business?.logo || "/images/default-avatar.png"}
                alt="valanza comunidad"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="mt-2 text-lg font-bold text-colorText">{user?.business?.name}</span>
          </div>
          {/* Banner */}
          {/* <div className="flex flex-col">
            <div className="w-60 h-36 rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
              <img
                src={user?.business?.banner || "/images/default-avatar.png"}
                alt="valanza comunidad"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <span className="mt-2 text-lg font-bold text-colorText">Banner de tu negocio</span>
          </div> */}
          {/* Description */}
          <div className="w-full col-span-2">
            <span className="font-bold text-colorText text-lg">Descripción</span>
            <p className="text-colorGrey text-sm">
              {user?.business?.description || "Sin descripción"}
            </p>
          </div>
        </div>
      </CardContainerComponent>
      <CardContainerComponent title='Datos de de contacto' onEditAction={() => setShowBusinessContactModal(true)} >
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-colorText text-lg">Teléfono</span>
            <p className="text-colorGrey text-sm">
              {user?.business?.phone_number || "Sin teléfono"}
            </p>
          </div>
          {/* Address */}
          <div className="flex flex-col">
            <span className="font-bold text-colorText text-lg">Dirección</span>
            <p className="text-colorGrey text-sm">
              {user?.business?.full_address || "Sin dirección"}
            </p>
          </div>
        </div>
      </CardContainerComponent>
    </div>
    <ModalComponent show={showBusinessModal} setShow={() => setShowBusinessModal(false)}
      statusModal={ScreenStatus.success}
      disableClose={true}
      title='Crear negocio'
      subtitle='Crea tu negocio para poder usar la plataforma'
      messageError='Ocurrio algo inesperado'
      onReintent={getData}
      children={<><BusinessForm onBeforeSubmit={closeBussinessModal} /></>}
    >
    </ModalComponent>
    <ModalComponent show={showBusinessContactModal} setShow={() => setShowBusinessContactModal(false)}
      disableClose={false}
      statusModal={
        ScreenStatus.success
      }
      title='Editar datos de contacto de tú negocio'
      subtitle='Edita teléfonos, dirección y email'
      messageError='Ocurrio algo inesperado'
      children={<><BusinessContactForm onBeforeSubmit={onSubmitContact} uuidBusiness={user?.business?.uuid || ""} /></>}
    >
    </ModalComponent>
  </>)
}

export default HomePage
