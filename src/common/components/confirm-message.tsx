import { ScreenStatus, TypeModalMessage } from "@/types/enums";
import { motion } from "framer-motion"
import { Button } from "./button";
import LoaderComponent from "./loader";
import { IoWarning } from "react-icons/io5";

export

  interface ModalMessageComponentProps {
  children: React.ReactNode;
  title: string
  onCancelAction?: () => void;
  onConfirmAction?: () => void;
  statusModal?: ScreenStatus
  messageError?: string
  onReintent?: () => void;
  typeMessageModal?: TypeModalMessage
}


const ConfirmMessage: React.FC<ModalMessageComponentProps> = ({ children,
  title,
  onCancelAction, onConfirmAction,
  statusModal = ScreenStatus.error,
  messageError = 'Ocurrio algo inesperado', onReintent, typeMessageModal = TypeModalMessage.warning }) => {

  return (
    <div className="min-h-screen absolute">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        < motion.div initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20
          }} className={`bg-background rounded-2xl text-colorText  shadow-lg p-5 w-full mx-5 overflow-auto  sm:w-96 `}>
          {/* Encabezado */}
          <div className='px-4  text-lg font-semibold text-colorText  flex justify-between'>
            <span className='font-bold text-colorText text-center text-2xl'>{title}</span>
          </div>

          {/* Contenido */}
          <div className="px-4 py-6 bg-hintColor rounded-md my-5">
            {statusModal === ScreenStatus.success &&
              <div className='w-full flex flex-col justify-center items-center'>
                {typeMessageModal === TypeModalMessage.warning && <div className='mb-5 rounded-full bg-backgroundSecond  w-24 h-24 flex justify-center items-center'><IoWarning className='text-6xl text-yellow-500' /></div>}
                {children}
              </div>}
            {statusModal === ScreenStatus.error && <div className="w-full py-10 flex  flex-col justify-center items-center">
              <span className="text-colorText text-sm text-center mt-5">{messageError}</span>
              <Button type="button" onClick={onReintent} children="Reintentar" />
            </div>}
            {statusModal === ScreenStatus.loading && <div className={`w-full`}> <LoaderComponent /></div>}

          </div>
          {/* Footer */}
          {statusModal !== ScreenStatus.loading && <div className="flex justify-end px-4 py-2 space-x-1 items-end gap-5">
            <div>
              <Button type="button"  onClick={onCancelAction} variant='secondary' >Cerrar</Button>
            </div>
            {onConfirmAction && <div>
              <Button type="button"
                onClick={onConfirmAction}>Aceptar</Button>
            </div>}
          </div>}
        </motion.div>




      </div>
    </div>
  );
};

export default ConfirmMessage;
