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
import FormSelect from "@/common/components/select";
import type { IBusinessProduct } from "@/models/Business/business-product.model";
import CatalogService from "../services/catalog.service";
import type { ITab } from "@/models/tab.model";
import StockPage from "./views/Stock";
import CategoriesPage from "./views/Categories";
import TabsComponent from "@/common/components/Tabs";

const CatalogPage: React.FC = () => {
  const tabs: ITab[] = [
    { id: 1, label: 'Stock', isSelect: true, content: <StockPage /> },
    { id: 2, label: 'Categorias', isSelect: false, content: <CategoriesPage /> },
  ]
  return (<>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <div className="h-full w-full p-0">
      <TabsComponent tabs={tabs} />
    </div>
  </>)
}

export default CatalogPage


