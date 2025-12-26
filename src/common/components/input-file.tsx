/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';
import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from './button';

interface FormFileInputProps {
  label: string;
  name: string;
  register: UseFormRegisterReturn<any>;
  error?: FieldError;
  className?: string;
  disabled?: boolean;
  helperText?: string;
  accept?: string;
  buttonText?: string;
}

const FormFileInput: React.FC<FormFileInputProps> = ({
  label,
  name,
  register,
  error,
  className = '',
  disabled = false,
  helperText,
  accept = 'image/*',
  buttonText = 'Seleccionar archivo'
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
      setFileName('');
    }
  };

  return (
    <div className={`mb-4 flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className="text-colorText mb-1">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        id={name}
        type="file"
        accept={accept}
        {...register}
        onChange={(e) => {
          register.onChange(e);
          handleFileChange(e);
        }}
        ref={(e) => {
          register.ref(e);
          fileInputRef.current = e;
        }}
        className="hidden"
        disabled={disabled}
      />

      {/* Custom button style */}
      <div className="flex items-center gap-2">
        <Button size="sm" type='button' onClick={() => fileInputRef.current?.click()}  >{buttonText}</Button>
        {fileName && (
          <span className="text-sm text-colorText truncate max-w-xs">
            {fileName}
          </span>
        )}
      </div>

      {/* Image preview */}
      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 max-w-full object-contain border rounded-md"
          />
        </div>
      )}

      {error && <span className="text-red-500 text-sm mt-1">{error.message}</span>}
      {!error && helperText && (
        <span className="text-colorText text-xs mt-1">{helperText}</span>
      )}
    </div>
  );
};

export default FormFileInput;