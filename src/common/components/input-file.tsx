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
  maxSizeMB?: number;
  multiple?: boolean
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
  buttonText = 'Seleccionar archivo',
  maxSizeMB,
  multiple = false,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreviews([]);
    setFileNames([]);
  };


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      setPreviews([]);
      setFileNames([]);
      return;
    }

    const newPreviews: string[] = [];
    const newFileNames: string[] = [];

    for (const file of files) {
      if (maxSizeMB) {
        const sizeMB = file.size / (1024 * 1024);

        if (sizeMB > maxSizeMB) {
          setLocalError(`Máximo permitido: ${maxSizeMB} MB`);
          resetInput();
          return;
        }
      }

      newFileNames.push(file.name);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onloadend = () => {
          newPreviews.push(reader.result as string);

          if (newPreviews.length === files.filter(f => f.type.startsWith('image/')).length) {
            setPreviews([...newPreviews]);
          }
        };

        reader.readAsDataURL(file);
      }
    }

    setLocalError(null);
    setFileNames(newFileNames);
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
        multiple={multiple}
        className="hidden"
        disabled={disabled}
      />

      {/* Custom button style */}
      <div className="flex items-center gap-2">
        <Button size="sm" type='button' onClick={() => fileInputRef.current?.click()}  >{buttonText}</Button>
        {fileNames && (
          <span className="text-sm text-colorText truncate max-w-xs">
            {fileNames}
          </span>
        )}
      </div>

      {/* Image preview */}
      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index}`}
              className="h-24 w-24 object-cover border rounded-md"
            />
          ))}
        </div>
      )}

      {(error || localError) && <span className="text-red-500 text-sm mt-1">{error?.message || localError}</span>}
      {!error && helperText && (
        <span className="text-colorText text-xs mt-1">{helperText}</span>
      )}
    </div>
  );
};

export default FormFileInput;