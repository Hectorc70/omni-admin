/* eslint-disable @typescript-eslint/no-explicit-any */
import { type IOptionSelect } from '@/types/forms.model';
import React from 'react';
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';

interface FormSelectProps {
  label: string; // Etiqueta del select
  name: string; // Nombre del campo (clave para `react-hook-form`)
  options: IOptionSelect[]; // Opciones del select
  placeholder?: string; // Placeholder opcional
  register: UseFormRegisterReturn<any>; // Registro de React Hook Form
  error?: FieldError; // Manejo de errores
  className?: string; // Clases CSS opcionales
  helperText?: string; // Texto de ayuda
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  placeholder = 'Seleccione una opción',
  register,
  error,
  className = '',
  helperText
}) => {
  return (
    <div className={`mb-4 flex flex-col ${className}`}>
      <label htmlFor={name} className="text-primary text-lg font-bold">
        {label}
      </label>
      <select
        id={name}
        {...register}
        className="h-12 mt-1 p-2 py-3 w-full text-colorText border border-hintColor bg-hintColor  rounded-lg focus:outline-none hover:border-primary"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
      {!error && helperText && <span className="text-colorText text-xs">{helperText}</span>}
    </div>
  );
};

export default FormSelect;