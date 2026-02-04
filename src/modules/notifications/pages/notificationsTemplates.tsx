// import ModalComponent from "@/common/components/modal";
import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
import { changeTitle } from "@/redux/global.slice";
import type { AppDispatch } from "@/redux/store";
import { useEffect, useLayoutEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { TableComponent } from "@/common/components/table";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import { limitTableRegistersPerPage } from "@/common/constants";
import { AiFillEdit } from "react-icons/ai";
import { useForm } from "react-hook-form";
import ModalComponent from "@/common/components/modal";
import FormInput from "@/common/components/input";
import FormTextarea from "@/common/components/text-area";
import { Button } from "@/common/components/button";
import FormFileInput from "@/common/components/input-file";
import type { INotificationTemplate } from "@/models/Notifications/notification-template.model";
import NotificationsService from "../services/notifications.service";
import { BsFillSendCheckFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import FormSelect from "@/common/components/select";

const NotificationsTemplatesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreen, setMessageScreen] = useState<string>('')

  const [pageSelected, setPageSelected] = useState(1)
  const [data, setData] = useState<IResponsePaginate>({
    count: 0, next_page: 0, results: []
  })
  const [itemSelected, setItemSelected] = useState<INotificationTemplate>()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<INotificationTemplate>()
  const [statusScreenDetail, setStatusScreenDetail] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreenDetail, setMessageScreenDetail] = useState<string>('')
  const [shoDetail, setShowDetail] = useState(false)
  const wtachTypeNotification = watch('type_notification_device')


  const getData = async (page?: number | undefined) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const response = await NotificationsService.listNotificationsTemplates(
        {
          page: page ? page : 1,
          text_search: '',
        }
      )
      setData(response)
      setStatusScreen(ScreenStatus.success)
    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.error)
        setMessageScreen(error.toString())
        toast.error(error.toString())
      }
    }
  }
  useEffect(() => {
    getData()
  }, [])
  useLayoutEffect(() => {
    dispatch(changeTitle("Stock"));
  }, [])

  const onChangePage = (page: number) => {
    setPageSelected(page)
    getData(page)
  }

  const columns = [
    { Header: 'UUID', accessor: 'uuid' },
    { Header: 'Nombre', accessor: 'name_template' },
    { Header: 'Titulo', accessor: 'title' },
    { Header: 'Descripción', accessor: 'body' },
    { Header: 'Tipo de notificacion', accessor: 'type_notification_device' },
  ];

  const actions = [
    {
      icon: AiFillEdit,
      label: 'Ver detalle',
      onClick: (row: any) => {
        onGetDetail(row)
      }
    },
    {
      icon: BsFillSendCheckFill,
      label: 'Enviar notificacion',
      onClick: async (row: any) => {
        await onSend(row)
      }
    },
    {
      icon: MdDelete,
      label: 'Eliminar plantilla',
      onClick: async (row: any) => {
        await onDelete(row)
      }
    }
  ]
  const onGetDetail = (row: INotificationTemplate) => {
    setItemSelected(row)
    setShowDetail(true)
  }
  const onSubmit = async (data: INotificationTemplate) => {
    try {
      setStatusScreenDetail(ScreenStatus.loading)
      await NotificationsService.createTemplate({ data })
      setStatusScreenDetail(ScreenStatus.success)
      setShowDetail(false)
      toast.success('Plantilla de Notificacion creada exitosamente')
      await getData()
    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreenDetail(ScreenStatus.error)
        setMessageScreenDetail(error.toString())
      }
    }
  }
  const onSend = async (data: INotificationTemplate) => {
    try {
      await NotificationsService.sendNotification({ uuidTemplate: data?.uuid || '' })
      toast.success('Notificacion enviada exitosamente')
    } catch (error: any) {
      debugger
      if (error !== CANCELLED_REQUEST) {
        toast.error(error.toString())
      }
    }
  }

  const onDelete = async (row: INotificationTemplate) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      await NotificationsService.deleteTemplateNotification({ uuidTemplate: row.uuid || '' })
      await getData()
      setStatusScreen(ScreenStatus.success)
    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.error)
        setMessageScreen(error.toString())
      }
    }
  }

  useEffect(() => {
    if (wtachTypeNotification) {
      // reset(itemSelected)
    }
  }, [wtachTypeNotification])
  return (<>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <TableComponent data={data.results}
      columns={columns} actions={actions}
      page={pageSelected}
      status={statusScreen}
      total={data.count}
      limit={limitTableRegistersPerPage}
      messageError={messageScreen}
      onPageChange={(newPage: number) => onChangePage(newPage)}
      headerRightComponent={<Button type="button" onClick={() => setShowDetail(true)}>Crear nueva notificación</Button>}
    />

    <ModalComponent show={shoDetail} setShow={() => setShowDetail(false)}
      disableClose={false}
      statusModal={statusScreenDetail}
      title={itemSelected ? `Editar ${itemSelected.name_template}` : 'Crear nueva plantilla de notificación'}
      messageError={messageScreenDetail}
      onReintent={() => setStatusScreenDetail(ScreenStatus.success)}
      childConfirmButton={<Button type="button" onClick={handleSubmit(onSubmit)} >Guardar</Button>}
      children={
        <>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-top">
            <FormInput label="Nombre de la plantilla"
              name="name"
              placeholder="Nombre de la plantilla"
              maxLength={80}
              error={errors.name_template} register={register('name_template',
                {
                  required: {
                    value: true,
                    message: "El nombre es requerido"
                  },
                })} />
            <FormInput label="Titulo de la notificación"
              name="title"
              placeholder="Titulo de la notificación"
              maxLength={80}
              error={errors.title} register={register('title',
                {
                  required: {
                    value: true,
                    message: "El titulo es requerido"
                  },
                })} />
            <FormTextarea label="Cuerpo de la notificación" placeholder="El cuerpo de la notificación"
              name="Body"
              maxLength={220}
              error={errors.body} register={register('body',
                {
                  required: {
                    value: true,
                    message: "Cuerpo de la notificación"
                  },
                })} />
            <FormSelect label="Tipo de notificacion"
              name="type_notification_device"
              error={errors.type_notification_device}
              register={register('type_notification_device')} options={[{
                label: 'Envio de push notificación con imagen',
                value: 'app_push_notification_customer'
              }, {
                label: 'Envio de push notificación con video',
                value: 'app_push_notification_customer_video'
              }]} />
            {/* <div className="flex">
              <FormInput label="Programar envio de notificación"
                name="date_schedule"
                placeholder=""
                type="date"
                error={errors.date_schedule} register={register('date_schedule',
                  {
                    required: {
                      value: false,
                      message: ""
                    },
                  })} />
              <FormInput
                label=""
                name="date_schedule"
                placeholder=""
                type="time"
                error={errors.date_schedule} register={register('date_schedule',
                  {
                    required: {
                      value: false,
                      message: ""
                    },
                  })} />
            </div> */}

            {wtachTypeNotification === 'app_push_notification_customer' && <FormFileInput label="Imagen de la notificación"
              name="file"
              error={errors.file} register={register('file',
                {
                  required: {
                    value: false,
                    message: ""
                  },
                })} />}
            {wtachTypeNotification === 'app_push_notification_customer_video' && <FormFileInput
              label="Video de la notificación"
              name="file"
              buttonText="Seleccionar video"
              accept="video/*"
              maxSizeMB={20}
              error={errors.file} register={register('file',
                {
                  required: {
                    value: true,
                    message: "El video es requerido"
                  },
                })} />}
          </div>
        </>}
    >
    </ModalComponent>

  </>)
}

export default NotificationsTemplatesPage


