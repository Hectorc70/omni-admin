/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';

interface FormTextareaProps {
  label: string; // Etiqueta del textarea
  name: string; // Nombre del campo (clave para `react-hook-form`)
  placeholder?: string; // Placeholder opcional
  rows?: number; // Número de filas del textarea
  register: UseFormRegisterReturn<any>; // Registro de React Hook Form
  error?: FieldError; // Manejo de errores
  className?: string; // Clases CSS opcionales
  maxLength?: number | undefined;

}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  placeholder = '',
  rows = 4,
  register,
  error,
  className = '',
  maxLength = 400
}) => {
  return (
    <div className={`mb-4 flex flex-col ${className}`}>
      <label htmlFor={name} className="text-primary text-lg font-bold">
        {label}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register}
        className="text-colorText hover:border-primary mt-1 p-2 w-full border bg-hintColor border-hintColor rounded-md focus:outline-none resize-y"
        maxLength={maxLength}
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};

export default FormTextarea;