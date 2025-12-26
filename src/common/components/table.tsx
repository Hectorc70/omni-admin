
import { type IconType } from "react-icons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "./button";
import { FaFilter } from "react-icons/fa";
import { ScreenStatus } from "@/types/enums";
import LoaderComponent from "./loader";


/* eslint-disable @typescript-eslint/no-explicit-any */

interface FiltersPopoverProps {
  triggerLabel?: string;
  children: React.ReactNode;
  actionAccept?: () => void;
  actionReset?: () => void;
  activeFilters?: boolean;        // ← cuántos filtros activos
  disabled?: boolean;
}

const FiltersPopover: React.FC<FiltersPopoverProps> = ({
  triggerLabel = "Filtros",
  children,
  actionAccept,
  actionReset,
  activeFilters = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverId = "filters-popover";

  // Cerrar al hacer click fuera / ESC
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const cleanFilters = () => {
    setOpen(false);
    actionReset?.();
  };

  const handleAccept = () => {
    actionAccept?.();
    setOpen(false);
  };

  const hasActive = activeFilters;
  const activeStyles = hasActive || open
    ? "bg-primary text-white hover:bg-hoverPrimary"
    : "bg-background text-colorText hover:bg-hintColor";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`relative flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition
                    focus:outline-none focus:ring-2 focus:ring-primary/60 ${activeStyles}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-expanded={open}
        aria-controls={popoverId}
        aria-pressed={hasActive}
        title={hasActive ? `${activeFilters} filtros activos` : "Abrir filtros"}
      >
        <FaFilter className={`text-sm transition-transform ${open ? "rotate-12" : ""}`} />
        {triggerLabel}
        {hasActive && (
          <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center bg-red-600 text-white">
          </span>
        )}
      </button>

      {open && (
        <div
          id={popoverId}
          className="absolute z-[9999] mt-2 w-full sm:w-[600px] rounded-xl border border-onBackground bg-background shadow-2xl"
          style={{ left: 0, top: "100%" }}
          role="dialog"
          aria-label="Filtros"
        >
          {/* Flechita */}
          <div className="absolute -top-2 left-4 h-4 w-4 rotate-45 bg-background border-l border-t border-onBackground" />

          {/* Contenido */}
          <div className="max-h-80 overflow-auto p-3">
            {children ?? <p className="text-colorText text-sm">No hay filtros configurados.</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-onBackground p-2">
            <Button type="button" onClick={cleanFilters} variant="secondary" >Borrar</Button>
            <Button type="button" onClick={handleAccept}>Aceptar</Button>
          </div>
        </div>
      )}
    </div>
  );
};


type AccessorFn = (row: any) => React.ReactNode;

interface RowAction {
  icon: IconType;
  label: string;
  onClick: (row: any) => void;
  color?: string
}
interface Column {
  Header: string;
  accessor: string | AccessorFn;
  cell?: (value: any, row: any, index: number) => React.ReactNode;
  className?: string;
}

interface TableComponentProps {
  columns: Column[];
  data: any[];
  status?: ScreenStatus,
  messageError?: string
  actions?: RowAction[];
  onSearch?: (value: string) => void;
  placeholderSearch?: string
  headerRightComponent?: ReactNode;
  onReintent?: () => void;
  page?: number;
  total?: number;
  limit?: number;
  onPageChange?: (newPage: number) => void;
  filtersComponent?: ReactNode;
  applyFilters?: () => void
  resetFilters?: () => void
  activeFilters?: boolean
}

const getPageNumbers = (current: number, totalPages: number, maxVisible: number = 5) => {
  const pages = [];
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(totalPages, current + half);

  if (end - start < maxVisible - 1) {
    if (start === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else if (end === totalPages) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

const TableComponent: React.FC<TableComponentProps> = ({ columns,
  data, status = ScreenStatus.loading,
  messageError = 'Ocurrio algo inesperado',
  actions, onSearch,
  placeholderSearch = 'Buscar ...',
  headerRightComponent, onReintent, page, total = 0, limit,
  onPageChange,
  filtersComponent, applyFilters, resetFilters, activeFilters
}) => {
  return (
    <div className="relative overflow-x-auto p-2 w-full  py-5 bg-background">
      {/* HEADER TABLE */}
      <div className="flex flex-row flex-wrap justify-between bg-background p-3 rounded-lg">
        {/* Buscador */}
        <div className="w-full sm:w-1/3 flex gap-2 items-start">
          <div>
            <input
              type="text"
              placeholder={placeholderSearch}
              onChange={(e) => {
                const value = e.target.value;
                if(value === '') onSearch?.(value)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch?.((e.target as HTMLInputElement).value);
                }
              }}
              className="block p-2 ps-2 text-sm bg-hintColor text-colorText placeholder-colorTex border border-hintColor rounded-lg w-80  focus:ring-primary focus:outline-none  "
            />
            <span className="text-xs text-colorText">
              Presiona <kbd className="bg-gray-200 px-1 rounded font-bold">Enter</kbd> para buscar
            </span>
          </div>

          {/* Popover flotante */}
          {filtersComponent && <FiltersPopover
            actionAccept={applyFilters}
            actionReset={resetFilters}
            activeFilters={activeFilters}
            triggerLabel="Filtros">
            {filtersComponent}
          </FiltersPopover>}
        </div>
        {/* Componente del lado derecho */}
        {headerRightComponent && (
          <div className="w-full sm:w-2/3 flex justify-end">
            {headerRightComponent}
          </div>
        )}
      </div>
      {/* TABLE */}
      <section className="bg-background rounded-lg mt-2 py-1">
        <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-colorText mt-0 mb-5 rounded-lg">
            <thead className="sticky top-0 z-0 text-sm text-colorText uppercase bg-background rounded-lg">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    {/* Aquí podrías agregar un checkbox global si lo necesitas */}
                  </div>
                </th>
                {columns.map((column) => (
                  <th key={column.accessor.toString()} scope="col" className="px-6 py-3">
                    {column.Header}
                  </th>
                ))}
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            {status === ScreenStatus.success &&
              <tbody className="text-colorGrey">
                {data && data?.length === 0 && (
                  <tr>
                    <td colSpan={columns.length + 2} className="text-center p-10">
                      No hay datos para mostrar
                    </td>
                  </tr>
                )}
                {data.map((row, index) => (
                  <tr key={index} className="bg-background border-b mb-5   border-hintColor hover:bg-hintColor ">
                    <td className="w-4 p-2 rounded-md">
                      <div className="flex items-center">
                      </div>
                    </td>
                    {columns.map((column) => {
                      const rawValue = typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor];
                      // si hay renderer, úsalo; si no, muestra el valor tal cual
                      const content = column.cell
                        ? column.cell(rawValue, row, index)
                        : rawValue;
                      return (
                        <td
                          key={typeof column.accessor === 'string' ? column.accessor : column.Header}
                          className={`px-6 py-4 ${column.className ?? ''}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                    <td className="px-6 p-2 rounded-md">
                      <div className="flex items-center space-x-4 text-lg">
                        {actions?.map((action, idx) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => action.onClick(row)}

                              className={`cursor-pointer hover:opacity-75 ${action.color ?? "text-primary"}`}
                              title={action.label}
                            >
                              <Icon />
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            }

          </table>
        </div>
        {status === ScreenStatus.loading && (
          <div className="w-full py-10 flex justify-center items-center">
            <LoaderComponent />
          </div>
        )}
        {status === ScreenStatus.error && (
          <div className="w-full py-10 flex  flex-col justify-center items-center">
            <span className="text-colorText text-sm text-center mt-5">{messageError}</span>
            <Button type="button" onClick={onReintent} children="Reintentar" />
          </div>
        )}
      </section>
      {/* PAGINATION */}
      {status === ScreenStatus.success &&
        total !== undefined &&
        limit !== undefined &&
        onPageChange &&
        page !== undefined && (
          <section className="mt-4 w-full">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {page > 1 && (
                <button
                  onClick={() => onPageChange(page - 1)}
                  className="cursor-pointer px-3 py-1 bg-backgroundSecond text-colorText hover:bg-primary hover:text-white rounded"
                >
                  Anterior
                </button>
              )}

              {getPageNumbers(page, Math.ceil(total / limit)).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`px-3 py-1 rounded cursor-pointer ${page === p
                    ? "bg-primary text-white"
                    : "bg-backgroundSecond text-colorText hover:bg-primary hover:text-white"
                    }`}
                >
                  {p}
                </button>
              ))}

              {page < Math.ceil(total / limit) && (
                <button
                  onClick={() => onPageChange(page + 1)}
                  className="cursor-pointer px-3 py-1 bg-backgroundSecond text-colorText hover:bg-primary hover:text-white rounded"
                >
                  Siguiente
                </button>
              )}
            </div>
          </section>
        )}
    </div>
  );
};


export { FiltersPopover, TableComponent };