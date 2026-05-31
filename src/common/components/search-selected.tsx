import type { IOptionSelect } from '@/types/forms.model';
import { useState, useRef, useEffect } from 'react';
import { Controller, type Control, type FieldError, type FieldValues, type Path, type RegisterOptions } from 'react-hook-form';

interface FormSelectWithSearchProps<TFieldValues extends FieldValues> {
  label: string;
  name: Path<TFieldValues>;
  options: IOptionSelect[];
  placeholder?: string;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: FieldError;
  className?: string;
}

const FormSelectWithSearch = <TFieldValues extends FieldValues>({
  label,
  name,
  options,
  placeholder = 'Seleccione una opción',
  control,
  rules,
  error,
  className = '',
}: FormSelectWithSearchProps<TFieldValues>) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`mb-4 relative ${className}`} ref={containerRef}>
      <label htmlFor={name} className="text-colorText">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => {
          const selectedOption = options.find(opt => opt.value === field.value);

          return (
            <>
              <div
                className="mt-1 p-2 py-3 w-full border border-background bg-hintColor rounded-md focus:outline-none hover:border-primary cursor-pointer"
                onClick={() => setShowDropdown(prev => !prev)}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </div>

              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-background border border-hintColor rounded-md shadow-lg max-h-60 overflow-auto">
                  <input
                    type="text"
                    className="w-full p-2 border-b border-hintColor focus:outline-none"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        className="p-2 hover:bg-hintColor cursor-pointer"
                        onClick={() => {
                          field.onChange(option.value);
                          setSearch('');
                          setShowDropdown(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-400">Sin resultados</div>
                  )}
                </div>
              )}
            </>
          );
        }}
      />

      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};

export default FormSelectWithSearch;
