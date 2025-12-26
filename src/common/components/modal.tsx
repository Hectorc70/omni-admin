import React from 'react';
import { ScreenStatus } from '@/types/enums';
import LoaderComponent from './loader';
import { IoCloseCircle } from "react-icons/io5";
import { Button } from './button';
import { motion } from "framer-motion"

interface ModalComponentProps {
  children: React.ReactNode;
  title: string
  subtitle?: string
  onCancelAction?: () => void;
  onConfirmAction?: () => void;
  childConfirmButton?: React.ReactNode;
  cancelButton?: boolean
  statusModal?: ScreenStatus
  messageError?: string
  onReintent?: () => void;
  show?: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  disableClose:boolean
}


const ModalComponent: React.FC<ModalComponentProps> = ({ show = false, disableClose=false,
  children, setShow,
  title, subtitle, childConfirmButton,
  onCancelAction, onConfirmAction,
  statusModal = ScreenStatus.error,
  messageError = 'Ocurrio algo inesperado', onReintent }) => {

  const closeModal = () => {
    setShow(false)
    onCancelAction && onCancelAction()
  }


  return (<>
    {show && <div className="min-h-screen absolute ">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20
          }}
          className="bg-background rounded-lg text-colorText shadow-2xl w-full sm:w-1/2 max-h-[90vh] flex flex-col overflow-auto"
        >
          {/* Encabezado */}
          <div className='px-4 pt-5 flex justify-between'>
            <div className='flex flex-col items-start'>
              <span className='font-bold text-colorText text-lg '>{title}</span>
              {subtitle &&
                <span className='text-colorText text-sm'>{subtitle}</span>
              }
            </div>
            {!disableClose && <IoCloseCircle className='cursor-pointer text-3xl hover:text-primary' onClick={closeModal} />}
          </div>
          {/* Encabezado */}



          {/* Contenido scrolleable */}
          <div className="px-4 py-6 rounded-md m-5 overflow-y-auto flex-1">
            {statusModal === ScreenStatus.success && children}
            {statusModal === ScreenStatus.error && (
              <div className="w-full py-10 flex flex-col justify-center items-center">
                <span className="text-colorText text-sm text-center mt-5">{messageError}</span>
                <Button type="button" onClick={onReintent} children="Reintentar" />
              </div>
            )}
            {statusModal === ScreenStatus.loading && <div className="w-full"> <LoaderComponent /></div>}
          </div>

          {/* Footer */}
          {statusModal !== ScreenStatus.loading && (
            <div className="flex justify-end px-4 py-2 space-x-1">
              {onCancelAction && (
                <Button type="button" onClick={onCancelAction} variant="secondary">
                  Cerrar
                </Button>
              )}
              {onConfirmAction && childConfirmButton === undefined ? (
                <Button type="button" onClick={onConfirmAction} variant="primary">
                  Aceptar
                </Button>
              ) : childConfirmButton}
            </div>
          )}
        </motion.div>
      </div>
    </div>}
  </>
  );
};

export default ModalComponent;