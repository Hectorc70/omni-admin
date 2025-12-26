/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/common/components/button";

interface ErrorComponentProps {
  title?: string;                // Título en rojo
  subtitle?: string;            // Descripción opcional
  stacktrace?: any;             // Texto o JSON de error
  onRetry?: () => void;         // Acción del botón Retry
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  title="Oh no!, algo salió mal",
  subtitle,
  stacktrace,
  onRetry
}) => {
  return (
    <div className="w-full h-full py-10 flex flex-col justify-center items-center bg-background rounded-lg text-center px-5">

      {/* Título (rojo) */}
      <span className="text-red-400 font-bold text-2xl">{title}</span>

      {/* Subtítulo */}
      {subtitle && (
        <span className="text-colorText text-base mt-3 max-w-xl">
          {subtitle}
        </span>
      )}

      {/* Stacktrace opcional */}
      {stacktrace && (
        <pre className="mt-5 bg-gray-800 text-gray-200 text-xs p-4 rounded-lg max-w-xl overflow-auto text-left">
          {typeof stacktrace === "string"
            ? stacktrace
            : JSON.stringify(stacktrace, null, 2)}
        </pre>
      )}

      {/* Botón Retry */}
      {onRetry && (
        <div className="mt-8">
          <Button type="button" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorComponent;
