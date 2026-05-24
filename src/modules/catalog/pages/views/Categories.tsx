// import ModalComponent from "@/common/components/modal";
import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
import { changeTitle } from "@/redux/global.slice";
import type { AppDispatch } from "@/redux/store";
import { useCallback, useLayoutEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { TableComponent } from "@/common/components/table";
import { limitTableRegistersPerPage } from "@/common/constants";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useForm } from "react-hook-form";
import ModalComponent from "@/common/components/modal";
import FormInput from "@/common/components/input";
import { Button } from "@/common/components/button";
import type { IBusinessCategory } from "@/models/Business/business-category.model";
import CatalogService from "../../services/catalog.service";
import { useConfirm } from "@/common/providers/confirm-provider";
import { useCategories } from "@/hooks/use-categories";

const getErrorMessage = (error: unknown) => error instanceof Error ? error.toString() : String(error)

const CategoriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const confirm = useConfirm()
  const { categoriesData, statusScreen, messageScreen, fetchCategories } = useCategories()

  const [pageSelected, setPageSelected] = useState(1)
  const [itemSelected, setItemSelected] = useState<IBusinessCategory>()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IBusinessCategory>()
  const [statusScreenDetail, setStatusScreenDetail] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreenDetail, setMessageScreenDetail] = useState<string>('')
  const [shoDetail, setShowDetail] = useState(false)

  const getData = useCallback(async (page?: number | undefined) => {
    try {
      await fetchCategories({
        page: page ? page : 1,
        text_search: '',
      })
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        toast.error(getErrorMessage(error))
      }
    }
  }, [fetchCategories])
  useLayoutEffect(() => {
    dispatch(changeTitle("Categorias"));
  }, [dispatch])

  const onChangePage = (page: number) => {
    setPageSelected(page)
    getData(page)
  }

  const columns = [
    { Header: 'ID', accessor: 'uuid' },
    { Header: 'Nombre', accessor: 'name' },
  ];

  const actions = [
    {
      icon: AiFillEdit,
      label: 'Editar',
      onClick: (row: IBusinessCategory) => {
        onGetDetail(row)
      }
    },
    {
      icon: AiFillDelete,
      label: 'Eliminar',
      color: 'text-red-400',
      onClick: (row: IBusinessCategory) => {
        onDelete(row)
      }
    },
  ]
  const onGetDetail = (row: IBusinessCategory) => {
    setStatusScreenDetail(ScreenStatus.success)
    setMessageScreenDetail('')
    setItemSelected(row)
    setShowDetail(true)
    reset(row)
  }

  const onCreate = () => {
    reset({
      name: '',
    });
    setMessageScreenDetail('')
    setStatusScreenDetail(ScreenStatus.success)
    setItemSelected(undefined)
    setShowDetail(true)
  }
  const onSubmit = async (data: IBusinessCategory) => {
    try {
      setStatusScreenDetail(ScreenStatus.loading)
      if (itemSelected) {
        if (!itemSelected.uuid) {
          toast.error('No se encontró el identificador de la categoría')
          setStatusScreenDetail(ScreenStatus.success)
          return
        }
        if (data.name === itemSelected!.name) {
          toast.error('No se puede actualizar la categoría con el mismo nombre')
          setStatusScreenDetail(ScreenStatus.success)
          return
        }
        await CatalogService.updateCategory({ uuid_category: itemSelected.uuid, data })
        toast.success('Categoría actualizada exitosamente')
      } else {
        await CatalogService.createCategory({ data })
        toast.success('Categoría creada exitosamente')
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

  const onDelete = async (row: IBusinessCategory) => {
    try {
      if (!row.uuid) {
        toast.error('No se encontró el identificador de la categoría')
        return
      }
      const accepted = await confirm({
        title: "¿Seguro que quiere borrar?",
        content: (
          <span>
            Esto eliminará la categoría {row.name}
          </span>
        )
      })
      if (!accepted) return

      await CatalogService.deleteCategory({ uuid_category: row.uuid })
      toast.success('Categoría eliminada exitosamente')
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
      await fetchCategories({
        page: 1,
        text_search: value,
      })
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        toast.error(getErrorMessage(error))
      }
    }
  }

  return (<>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <TableComponent data={categoriesData.results}
      columns={columns}
      actions={actions}
      page={pageSelected}
      status={statusScreen}
      total={categoriesData.count}
      limit={limitTableRegistersPerPage}
      messageError={messageScreen}
      onReintent={() => getData(pageSelected)}
      onPageChange={(newPage: number) => onChangePage(newPage)}
      onSearch={onSearch}
      headerRightComponent={<Button type="button" onClick={onCreate}>Nueva Categoría</Button>}
    />

    <ModalComponent show={shoDetail} setShow={() => setShowDetail(false)}
      disableClose={false}
      statusModal={statusScreenDetail}
      title={itemSelected ? `Editar ${itemSelected.name}` : 'Crear nueva categoría'}
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
              maxLength={80}
              error={errors.name} register={register('name',
                {
                  required: {
                    value: true,
                    message: "El nombre es requerido"
                  },
                })} />
          </div>
        </>}
    >
    </ModalComponent>

  </>)
}

export default CategoriesPage
