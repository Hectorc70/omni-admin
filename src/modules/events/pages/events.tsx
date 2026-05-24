import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
import { changeTitle } from "@/redux/global.slice";
import type { AppDispatch } from "@/redux/store";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { TableComponent } from "@/common/components/table";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import { limitTableRegistersPerPage } from "@/common/constants";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useForm } from "react-hook-form";
import ModalComponent from "@/common/components/modal";
import FormInput from "@/common/components/input";
import FormTextarea from "@/common/components/text-area";
import FormFileInput from "@/common/components/input-file";
import { Button } from "@/common/components/button";
import type { IEvent } from "@/models/Events/event.model";
import EventsService from "../services/events.service";
import { useConfirm } from "@/common/providers/confirm-provider";

const getErrorMessage = (error: unknown) => error instanceof Error ? error.toString() : String(error)

const formatDateTimeLocal = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return date.toISOString().slice(0, 16);
}

const EventsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const confirm = useConfirm()

  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreen, setMessageScreen] = useState<string>('')
  const [pageSelected, setPageSelected] = useState(1)
  const [data, setData] = useState<IResponsePaginate>({
    count: 0, next_page: 0, results: []
  })
  const [itemSelected, setItemSelected] = useState<IEvent>()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IEvent>()
  const [statusScreenDetail, setStatusScreenDetail] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreenDetail, setMessageScreenDetail] = useState<string>('')
  const [shoDetail, setShowDetail] = useState(false)

  const getData = useCallback(async (page?: number | undefined) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const response = await EventsService.listEvents(
        {
          page: page ? page : 1,
          text_search: '',
        }
      )
      setData(response)
      setStatusScreen(ScreenStatus.success)
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.error)
        setMessageScreen(getErrorMessage(error))
        toast.error(getErrorMessage(error))
      }
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getData(1)
  }, [getData])

  useLayoutEffect(() => {
    dispatch(changeTitle("Eventos"));
  }, [dispatch])

  const onChangePage = (page: number) => {
    setPageSelected(page)
    getData(page)
  }

  const columns = [
    { Header: 'UUID', accessor: 'uuid' },
    { Header: 'Nombre', accessor: 'name' },
    { Header: 'Fecha de inicio', accessor: 'date_time_start', cell: (value: string) => value ? new Date(value).toLocaleString() : '' },
    { Header: 'Activo', accessor: 'is_active', cell: (value: boolean) => value ? 'Sí' : 'No' },
  ];

  const actions = [
    {
      icon: AiFillEdit,
      label: 'Editar',
      onClick: (row: IEvent) => {
        onGetDetail(row)
      }
    },
    {
      icon: AiFillDelete,
      label: 'Eliminar',
      color: 'text-red-400',
      disabled: (row: IEvent) => row.is_active === false,
      onClick: (row: IEvent) => {
        onDelete(row)
      }
    },
  ]

  const onGetDetail = (row: IEvent) => {
    setStatusScreenDetail(ScreenStatus.success)
    setMessageScreenDetail('')
    setItemSelected(row)
    setShowDetail(true)
    reset({
      ...row,
      date_time_start: formatDateTimeLocal(row.date_time_start)
    })
  }

  const onCreate = () => {
    reset({
      name: '',
      description: '',
      image: '',
      date_time_start: '',
    });
    setMessageScreenDetail('')
    setStatusScreenDetail(ScreenStatus.success)
    setItemSelected(undefined)
    setShowDetail(true)
  }

  const onSubmit = async (data: IEvent) => {
    try {
      const selectedNewImage = !data.imageFile || data.imageFile.length === 0;
      const notContentOldImage = !itemSelected || !itemSelected.image;
      if (selectedNewImage && notContentOldImage) {
        toast.error('Debes subir una imagen del evento')
        return
      }
      setStatusScreenDetail(ScreenStatus.loading)
      if (itemSelected) {
        if (!itemSelected.uuid) {
          toast.error('No se encontró el identificador del evento')
          setStatusScreenDetail(ScreenStatus.success)
          return
        }
        await EventsService.updateEvent({ uuid_event: itemSelected.uuid, data })
        toast.success('Evento actualizado exitosamente')
      } else {
        await EventsService.createEvent({ data })
        toast.success('Evento creado exitosamente')
      }
      setShowDetail(false)
      await getData(pageSelected)
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreenDetail(ScreenStatus.error)
        setMessageScreenDetail(getErrorMessage(error))
      }
    }
  }

  const onDelete = async (row: IEvent) => {
    try {
      if (!row.uuid) {
        toast.error('No se encontró el identificador del evento')
        return
      }
      const accepted = await confirm({
        title: "¿Seguro que quiere borrar?",
        content: (
          <span>
            Esto eliminará el evento {row.name}
          </span>
        )
      })
      if (!accepted) return

      await EventsService.deleteEvent({ uuid_event: row.uuid })
      toast.success('Evento eliminado exitosamente')
      await getData(pageSelected)
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        toast.error(getErrorMessage(error))
      }
    }
  }

  const onSearch = async (value: string) => {
    try {
      setPageSelected(1)
      setStatusScreen(ScreenStatus.loading)
      const response = await EventsService.listEvents(
        {
          page: 1,
          text_search: value,
        }
      )
      setData(response)
      setStatusScreen(ScreenStatus.success)
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.error)
        setMessageScreen(getErrorMessage(error))
      }
    }
  }

  return (<>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <TableComponent data={data.results}
      columns={columns}
      actions={actions}
      page={pageSelected}
      status={statusScreen}
      total={data.count}
      limit={limitTableRegistersPerPage}
      messageError={messageScreen}
      onReintent={() => getData(pageSelected)}
      onPageChange={(newPage: number) => onChangePage(newPage)}
      onSearch={onSearch}
      headerRightComponent={<Button type="button" onClick={onCreate}>Nuevo Evento</Button>}
    />

    <ModalComponent show={shoDetail} setShow={() => setShowDetail(false)}
      disableClose={false}
      statusModal={statusScreenDetail}
      title={itemSelected ? `Editar ${itemSelected.name}` : 'Crear nuevo evento'}
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
            <FormInput label="Nombre"
              name="name"
              placeholder="Nombre"
              maxLength={120}
              error={errors.name} register={register('name',
                {
                  required: {
                    value: true,
                    message: "El nombre es requerido"
                  },
                })} />
            <FormInput label="Fecha del evento"
              name="date_time_start"
              type="datetime-local"
              maxLength={80}
              error={errors.date_time_start} register={register('date_time_start',
                {
                  required: {
                    value: true,
                    message: "La fecha de evento es requerida"
                  },
                })} />
            <FormFileInput label="Imagen"
              name="imageFile"
              error={errors.imageFile} register={register('imageFile',
                {
                  required: {
                    value: !itemSelected?.image,
                    message: "La imagen es requerida"
                  },
                })} />
            <FormTextarea label="Descripción" placeholder=""
              name="description"
              maxLength={500}
              error={errors.description} register={register('description', {
                required: {
                  value: true,
                  message: "La descripción es requerida"
                },
              })} />
          </div>
          { itemSelected?.image && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen existente
              </label>
              <div className="relative w-full h-32 border rounded-lg overflow-hidden group md:w-48">
                <img
                  src={itemSelected.image}
                  alt="event"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </>}
    >
    </ModalComponent>
  </>)
}

export default EventsPage
