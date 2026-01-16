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
// import type { ICustomer } from "@/models/Customers/customer.model";
import CustomerService from "../services/customers.service";


const CustomersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [statusScreen, setStatusScreen] = useState<ScreenStatus>(ScreenStatus.success)
  const [pageSelected, setPageSelected] = useState(1)
  const [data, setData] = useState<IResponsePaginate>({
    count: 0, next_page: 0, results: []
  })
  // const [productSelected, setProductSelected] = useState<ICustomer>()
  // const { register, handleSubmit, formState: { errors }, reset } = useForm<ICustomer>()
  // const [statusScreenDetail, setStatusScreenDetail] = useState<ScreenStatus>(ScreenStatus.success)
  // const [messageScreenDetail, setMessageScreenDetail] = useState<string>('')
  // const [showProductDetail, setShowProductDetail] = useState(false)


  const getData = async (page?: number | undefined) => {
    try {
      setStatusScreen(ScreenStatus.loading)
      const response = await CustomerService.listCustomers(
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
    { Header: 'Correo', accessor: 'email' },
    { Header: 'Número de telefono', accessor: 'phone_number' },
  ];

  const actions = [
    {
      icon: AiFillEdit,
      label: 'Ver detalle',
      onClick: (row: any) => {
      }
    }
  ]

  // const onSubmit = async (data: ICustomer) => {
  //   try {
  //   } catch (error: any) {
  //     if (error !== CANCELLED_REQUEST) {
  //       setStatusScreenDetail(ScreenStatus.error)
  //       setMessageScreenDetail(error.toString())
  //     }
  //   }
  // }
  return (<>
    <TableComponent data={data.results} columns={columns} actions={actions}
      page={pageSelected}
      status={statusScreen}
      total={data.count}
      limit={limitTableRegistersPerPage}
      onPageChange={(newPage: number) => onChangePage(newPage)}
    />

  </>)
}

export default CustomersPage