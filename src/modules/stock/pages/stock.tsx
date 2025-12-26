// import ModalComponent from "@/common/components/modal";
import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { ScreenStatus } from "@/types/enums";
import { changeTitle } from "@/redux/global.slice";
import type { AppDispatch } from "@/redux/store";
import { useEffect, useLayoutEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { TableComponent } from "@/common/components/table";
import StockService from "../services/stock.service";
import type { IResponsePaginate } from "@/types/response-paginate.model";
import { limitTableRegistersPerPage } from "@/common/constants";
import { AiFillEdit } from "react-icons/ai";
import type { IProduct } from "@/models/Stock/product.model";
import { useForm } from "react-hook-form";
import ModalComponent from "@/common/components/modal";
import FormInput from "@/common/components/input";
import FormTextarea from "@/common/components/text-area";
import { Button } from "@/common/components/button";
import FormSelect from "@/common/components/select";
import FormFileInput from "@/common/components/input-file";


const StockPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const [pageSelected, setPageSelected] = useState(1)
  const [dataStock, setDataStock] = useState<IResponsePaginate>({
    count: 0, next_page: 0, results: []
  })
  const [productSelected, setProductSelected] = useState<IProduct>()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IProduct>()
  const [statusScreenDetail, setStatusScreenDetail] = useState<ScreenStatus>(ScreenStatus.success)
  const [messageScreenDetail, setMessageScreenDetail] = useState<string>('')
  const [showProductDetail, setShowProductDetail] = useState(false)


  const getData = async (page?: number | undefined) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const response = await StockService.listProducts(
        {
          page: page ? page : 1,
          text_search: '',
          type_product: '1,2'
        }
      )
      setDataStock(response)
      setStatusScreen(ScreenStatus.success)
    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreen(ScreenStatus.error)
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
    // { Header: 'UUID', accessor: 'uuid' },
    { Header: 'Nombre', accessor: 'name' },
    { Header: 'Descripción', accessor: 'description' },
    { Header: 'Tipo de producto', accessor: 'type_product' },
    { Header: 'Precio', accessor: 'price' },
  ];



  const newProduct = () => {
    setProductSelected(undefined)
    setShowProductDetail(true)
    setTimeout(() => {
      reset({
        name: "",
        description: "",
        stock: 0,
        price: 0,
        type: undefined,
        imagesFile: undefined,
      })
    }, 0)
    setStatusScreenDetail(ScreenStatus.success)
    setMessageScreenDetail('')
  }
  const detailProduct = async (product: IProduct) => {
    setProductSelected(product)
    setShowProductDetail(true)
    if (product.uuid) {
      setStatusScreenDetail(ScreenStatus.loading)
      const response = await StockService.detailProduct({ uuid: product.uuid })
      setProductSelected(response)
    }
    setStatusScreenDetail(ScreenStatus.success)
    setMessageScreenDetail('')
    reset(product)
  }
  const actions = [
    {
      icon: AiFillEdit,
      label: 'Ver detalle',
      onClick: (row: any) => {
        detailProduct(row)
      }
    }
  ]

  const onSubmit = async (data: IProduct) => {
    try {
      const selectedNewImages = !data.imagesFile || data.imagesFile.length === 0;
      const notContentOldImages = !productSelected || !productSelected.images_product || productSelected.images_product.length === 0;
      if (selectedNewImages && notContentOldImages) {
        toast.error('Debes subir al menos una imagen del producto')
        return
      }
      setStatusScreenDetail(ScreenStatus.loading)
      if (!productSelected) {
        debugger
        const responseProd = await StockService.createProduct(data)

        await StockService.updateImageProduct(responseProd.uuid ?? '', data.imagesFile![0])
        setStatusScreenDetail(ScreenStatus.success)
      } else {
        await StockService.updateProduct(data)
        setStatusScreenDetail(ScreenStatus.success)
      }
      toast.success('Producto creado exitosamente')
      setShowProductDetail(false)
      getData()
    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusScreenDetail(ScreenStatus.error)
        setMessageScreenDetail(error.toString())
      }
    }
  }
  return (<>
    <TableComponent data={dataStock.results} columns={columns} actions={actions}
      page={pageSelected}
      status={statusScreen}
      total={dataStock.count}
      limit={limitTableRegistersPerPage}
      onPageChange={(newPage: number) => onChangePage(newPage)}
      headerRightComponent={<><Button type="button" onClick={() => newProduct()}>Crear producto</Button></>}
    />

    <ModalComponent show={showProductDetail} setShow={() => setShowProductDetail(false)}
      disableClose={false}
      statusModal={statusScreenDetail}
      title={productSelected ? `Editar ${productSelected.name}` : 'Crear producto'}
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
            <FormInput label="Nombre del producto o servicio"
              name="name"
              placeholder="Nombre del producto"
              maxLength={100}
              error={errors.name} register={register('name',
                {
                  required: {
                    value: true,
                    message: "El nombre es requerido"
                  },
                })} />
            <FormTextarea label="Descripción del producto o servicio"
              name="description"
              placeholder="Describe el contenido, características y beneficios de tu producto o servicio"
              maxLength={100}
              error={errors.description} register={register('description',
                {
                  required: {
                    value: true,
                    message: "La descripción es requerido"
                  },
                })} />
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-top">
            <FormInput label="Piezas disponibles"
              name="name"
              type="number"
              step="0"
              placeholder="Número de piezas disponibles ejemplo: 10"
              error={errors.stock} register={register('stock',
                {
                  required: {
                    value: true,
                    message: "El número de piezas es requerido"
                  },
                })} />
            <FormInput label="Precio por piezas del producto"
              name="price"
              type="number"
              step="0"
              placeholder="En pesos mexicanos ejemplo: 10.0"
              error={errors.price} register={register('price',
                {
                  required: {
                    value: true,
                    message: "El precio es requerido"
                  },
                })} />
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-top">
            <FormSelect label="Tipo de producto"
              options={
                [
                  { label: 'Servicio', value: 1 },
                  { label: 'Producto', value: 2 },
                ]
              }
              name="type"
              placeholder="Seleccione el tipo de producto"
              error={errors.type} register={register('type',
                {
                  required: {
                    value: true,
                    message: "El tipo es requerido"
                  },
                })} />
            {<FormFileInput label="Imagen del producto"
              name="imagesFile"
              error={errors.imagesFile} register={register('imagesFile',
                {
                  required: {
                    value: false,
                    message: "La imagen es requerida"
                  },
                })} />}
          </div>
          {productSelected?.images_product && productSelected.images_product.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes existentes
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {productSelected.images_product.map((img) => (
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