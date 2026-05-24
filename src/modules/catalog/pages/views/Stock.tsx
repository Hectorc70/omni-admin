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
import { useForm, useWatch } from "react-hook-form";
import ModalComponent from "@/common/components/modal";
import FormInput from "@/common/components/input";
import FormTextarea from "@/common/components/text-area";
import { Button } from "@/common/components/button";
import FormFileInput from "@/common/components/input-file";
import FormSelect from "@/common/components/select";
import type { IBusinessProduct } from "@/models/Business/business-product.model";
import CatalogService from "../../services/catalog.service";
import { useCategories } from "@/hooks/use-categories";

const getErrorMessage = (error: unknown) => error instanceof Error ? error.toString() : String(error)

const StockPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useCategories()
  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreen, setMessageScreen] = useState<string>('')

  const [pageSelected, setPageSelected] = useState(1)
  const [data, setData] = useState<IResponsePaginate>({
    count: 0, next_page: 0, results: []
  })
  const [itemSelected, setItemSelected] = useState<IBusinessProduct>()
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<IBusinessProduct>()
  const [statusScreenDetail, setStatusScreenDetail] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreenDetail, setMessageScreenDetail] = useState<string>('')
  const [shoDetail, setShowDetail] = useState(false)
  const watchTypeProduct = useWatch({ control, name: 'type_product' })


  const getData = async (page?: number | undefined) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const response = await CatalogService.listAllProducts(
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
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getData(1)
  }, [])
  useLayoutEffect(() => {
    dispatch(changeTitle("Stock"));
  }, [dispatch])

  const onChangePage = (page: number) => {
    setPageSelected(page)
    getData(page)
  }

  const columns = [
    { Header: 'UUID', accessor: 'uuid' },
    { Header: 'Nombre', accessor: 'name' },
    { Header: 'Precio', accessor: 'price' },
    { Header: 'Stock', accessor: 'stock' },
    { Header: 'Tipo de product', accessor: 'type_product' },
  ];

  const actions = [
    {
      icon: AiFillEdit,
      label: 'Ver detalle',
      onClick: (row: IBusinessProduct) => {
        onGetDetail(row)
      }
    },
  ]
  const onGetDetail = (row: IBusinessProduct) => {
    setStatusScreenDetail(ScreenStatus.success)
    setItemSelected(row)
    setShowDetail(true)
    reset(row)
  }
  const onCreate = () => {
    reset({
      name: '',
      description: '',
    });
    setMessageScreenDetail('')
    setStatusScreenDetail(ScreenStatus.success)
    setItemSelected(undefined)
    setShowDetail(true)
  }
  const onSubmit = async (data: IBusinessProduct) => {
    try {
      let uuidProduct = ''
      if (itemSelected) {
        uuidProduct = itemSelected.uuid ?? ''
      }
      if(data.category===''){
        toast.error('Debes seleccionar una categoría')
        return
      }
      const selectedNewImages = !data.imagesFile || data.imagesFile.length === 0;
      const notContentOldImages = !itemSelected || !itemSelected.images_product || itemSelected.images_product.length === 0;
      if (selectedNewImages && notContentOldImages) {
        toast.error('Debes subir al menos una imagen del producto')
        return
      }
      setStatusScreenDetail(ScreenStatus.loading)
      if (!itemSelected) {
        const prod = await CatalogService.createProducts({ data })
        uuidProduct = prod.uuid ?? ''
        toast.success('Producto creado exitosamente')
      } else {
        if (!itemSelected.uuid) {
          toast.error('No se encontró el identificador del producto')
          setStatusScreenDetail(ScreenStatus.success)
          return
        }
        await CatalogService.updateProduct({ uuid_product: itemSelected.uuid, data })
        toast.success('Producto actualizado exitosamente')
      }
      try {
        if (data.imagesFile && data.imagesFile.length > 0) {
          const imagesFile = data.imagesFile
          for (let index = 0; index < imagesFile.length; index++) {
            const element = imagesFile[index];
            await CatalogService.addImageProduct({ uuid_product: uuidProduct, file: element })
          }
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error))
      }
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
      const response = await CatalogService.listAllProducts(
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
      columns={columns} actions={actions}
      page={pageSelected}
      status={statusScreen}
      total={data.count}
      limit={limitTableRegistersPerPage}
      messageError={messageScreen}
      onReintent={() => getData(pageSelected)}
      onPageChange={(newPage: number) => onChangePage(newPage)}
      onSearch={onSearch}
      headerRightComponent={<Button type="button" onClick={onCreate}>Nuevo Producto</Button>}
    />

    <ModalComponent show={shoDetail} setShow={() => setShowDetail(false)}
      disableClose={false}
      statusModal={statusScreenDetail}
      title={itemSelected ? `Editar ${itemSelected.name}` : 'Crear nuevo producto o servicio'}
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
            <FormTextarea label="Descripción" placeholder=""
              name="description"
              maxLength={300}
              error={errors.description} register={register('description',
                {
                  required: {
                    value: false,
                    message: ""
                  },
                })} />
            <FormSelect label="Tipo de producto"
              name="type_product"
              error={errors.type_product}
              register={register('type_product')} options={[{
                label: 'Producto',
                value: 1
              }, {
                label: 'Comida',
                value: 2
              }, {
                label: 'Servicio',
                value: 3
              }]} />
            <FormSelect label="Categoría"
              name="category"
              error={errors.category}
              register={register('category')} options={[
                {
                  label: 'Seleccione una opción',
                  value: ''
                },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.uuid ?? `${category.id}`
                }))
              ]} />
            {
              watchTypeProduct == 1 && <FormInput label="Stock"
                name="Stock"
                placeholder="1"
                type="number"
                error={errors.stock} register={register('stock',
                  {
                    required: {
                      value: true,
                      message: "El stock es requerido"
                    },
                  })} />
            }
            <FormInput label="Precio"
              name="Precio"
              placeholder="1"
              type="float"
              error={errors.price} register={register('price',
                {
                  required: {
                    value: true,
                    message: "El precio es requerido"
                  },
                })} />
            <FormSelect label="Tipo de moneda"
              name="currency"
              error={errors.currency}

              register={register('currency')} options={[{
                label: 'MXN',
                value: 'MXN'
              }, {
                label: 'USD',
                value: 'USD'
              }]} />
            {<FormFileInput label="Imagen del producto"
              name="imagesFile"
              multiple
              error={errors.imagesFile} register={register('imagesFile',
                {
                  required: {
                    value: itemSelected && itemSelected.images_product && itemSelected.images_product.length > 0 ? false : true,
                    message: "La imagen es requerida"
                  },
                })} />}
          </div>
          {itemSelected?.images_product && itemSelected.images_product.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes existentes
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {itemSelected.images_product.map((img) => (
                  <div
                    key={img.id ?? img.image}
                    className="relative w-full h-32 border rounded-lg overflow-hidden group"
                  >
                    <img
                      src={img.image}
                      alt="product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>}
    >
    </ModalComponent>

  </>)
}

export default StockPage
