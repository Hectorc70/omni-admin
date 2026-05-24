// import ModalComponent from "@/common/components/modal";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import type { ITab } from "@/models/tab.model";
import StockPage from "./views/Stock";
import CategoriesPage from "./views/Categories";
import TabsComponent from "@/common/components/tabs-component";
import { useCategories } from "@/hooks/use-categories";

const CatalogPage: React.FC = () => {
  const { fetchCategories } = useCategories()

  useEffect(() => {
    void fetchCategories({ page: 1, text_search: '' }).catch(() => undefined)
  }, [fetchCategories])

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
