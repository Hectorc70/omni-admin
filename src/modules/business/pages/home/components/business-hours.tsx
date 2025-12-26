import CardContainerComponent from "@/common/components/card-container";
import Chip from "@/common/components/chip";
import ModalComponent from "@/common/components/modal";
import { CANCELLED_REQUEST } from "@/common/utils/errors.util";
import { useUser } from "@/hooks/use-user";
import type { IBusinessHours } from "@/models/Business/business-hours.model";
import { ScreenStatus } from "@/types/enums";
import BusinessService from "@/modules/business/services/business.service";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Props {
  businessHours: IBusinessHours[];
  onBeforeSubmit: () => Promise<void>;
}

interface FormData {
  hours: IBusinessHours[];
}

export const BusinessHoursComponent = ({ businessHours, onBeforeSubmit }: Props) => {
  const { user } = useUser()
  const { register, handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: {
      hours: businessHours.map((b) => ({
        id: b.id,
        day_name: b.day_name,
        open_hour: b.open_hour || "",
        closed_hour: b.closed_hour || "",
      })),
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "hours",
  });
  const [showForm, setShowForm] = useState(false);
  const [statusForm, setStatusForm] = useState(ScreenStatus.success);
  const totalClosedDays = useMemo(() => {
    return businessHours.filter((b) => !b.open_hour || !b.closed_hour).length;
  }, [businessHours]);
  const formatHour = (hour?: string) => {
    if (!hour) {
      return "--:--";
    }
    // convierte "08:00:00" → "8:00 a.m."
    const [h, m] = hour.split(":");
    const hourNum = parseInt(h);
    const period = hourNum >= 12 ? "p.m." : "a.m.";
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${m} ${period}`;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setStatusForm(ScreenStatus.loading)
      console.log("🕓 Datos listos para enviar:", data.hours);
      await BusinessService.updateHours(data.hours)
      onBeforeSubmit()
      setStatusForm(ScreenStatus.success)
      setShowForm(false);
      toast.success("Horarios actualizados exitosamente")
    } catch (error: any) {
      if (error !== CANCELLED_REQUEST) {
        setStatusForm(ScreenStatus.success)
        toast.error(error.toString())
      }
    }

  };
  return (
    <>
      <CardContainerComponent title="Horarios" titleChildren={user.business?.is_24_hours ? <Chip text="Abierto 24/7"></Chip> : <></>} onEditAction={() => setShowForm(true)}>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {businessHours.map((item) => (
            <div key={item.day_number} className="flex justify-between items-center border-b border-gray-100 pb-1">
              <span className="font-semibold text-colorText text-lg">{item.day_name}</span>
              {item.open_hour && item.closed_hour ? (
                <span className="text-colorGrey">
                  {formatHour(item.open_hour)} - {formatHour(item.closed_hour)}
                </span>
              ) : (
                <span className="text-colorGrey">--:-- - --:--</span>
              )}
            </div>
          ))}
        </div>
        {
          (
            <div className="w-full flex justify-center items-center mt-3">
              <span className="text-red-400 text-lg font-semibold">
                {totalClosedDays == 7 && "Asigna tus horarios"}
              </span>
            </div>
          )
        }
      </CardContainerComponent>

      <ModalComponent show={showForm} setShow={() => setShowForm(false)}
        disableClose={false}
        statusModal={statusForm}
        title='Configuración de horarios'
        subtitle='Agrega tus horarios de atención'
        onCancelAction={() => setShowForm(false)}
        onConfirmAction={handleSubmit(onSubmit)}
        messageError='Ocurrio algo inesperado'
      >
        <form className="p-3">
          <div className="grid grid-cols-1 gap-4">
            {fields.map((field, index) => {
              const openHour = watch(`hours.${index}.open_hour`);
              const closedHour = watch(`hours.${index}.closed_hour`);

              // Validación inline
              const invalid =
                openHour && closedHour && closedHour <= openHour;

              return (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-2"
                >
                  <span className="font-semibold w-24">{field.day_name}</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="time"
                      {...register(`hours.${index}.open_hour`)}
                      className="border border-gray-300 rounded p-1 text-sm"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      {...register(`hours.${index}.closed_hour`)}
                      className={`border rounded p-1 text-sm ${invalid
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                        }`}
                    />
                  </div>
                  {invalid && (
                    <span className="text-xs text-red-500 mt-1 sm:ml-2">
                      La hora de cierre debe ser mayor a la de apertura
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </form>
      </ModalComponent></>
  );
};
