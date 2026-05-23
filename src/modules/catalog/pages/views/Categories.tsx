// import ModalComponent from "@/common/components/modal";
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
import { useForm } from "react-hook-form";
import ModalComponent from "@/common/components/modal";
import FormInput from "@/common/components/input";
import { Button } from "@/common/components/button";
import type { IBusinessCategory } from "@/models/Business/business-category.model";
import CatalogService from "../../services/catalog.service";

const getErrorMessage = (error: unknown) => error instanceof Error ? error.toString() : String(error)

const CategoriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreen, setMessageScreen] = useState<string>('')

  const [pageSelected, setPageSelected] = useState(1)
  const [data, setData] = useState<IResponsePaginate>({
    count: 0, next_page: 0, results: []
  })
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IBusinessCategory>()
  const [statusScreenDetail, setStatusScreenDetail] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreenDetail, setMessageScreenDetail] = useState<string>('')
  const [shoDetail, setShowDetail] = useState(false)

  const getData = useCallback(async (page?: number | undefined) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const response = await CatalogService.listAllCategories(
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
    dispatch(changeTitle("Categorias"));
  }, [dispatch])

  const onChangePage = (page: number) => {
    setPageSelected(page)
    getData(page)
  }

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nombre', accessor: 'name' },
    { Header: 'Descripción', accessor: 'description' },
  ];

  const onCreate = () => {
    reset({
      name: '',
      description: '',
    });
    setMessageScreenDetail('')
    setStatusScreenDetail(ScreenStatus.success)
    setShowDetail(true)
  }
  const onSubmit = async (data: IBusinessCategory) => {
    try {
      setStatusScreenDetail(ScreenStatus.loading)
      await CatalogService.createCategory({ data })
      toast.success('Categoría creada exitosamente')
      setShowDetail(false)
      await getData()
    } catch (error: unknown) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreenDetail(ScreenStatus.error)
        setMessageScreenDetail(getErrorMessage(error))
      }
    }
  }


  const onSearch = async (value: string) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const response = await CatalogService.listAllCategories(
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
      page={pageSelected}
      status={statusScreen}
      total={data.count}
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
      title="Crear nueva categoría"
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
