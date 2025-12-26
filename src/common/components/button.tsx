import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-hoverPrimary hover:opacity-80",
        secondary: "bg-hintColor border border-primary text-primary hover:border-2",
        danger: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base w-full",
      },
      loadingPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      loadingPosition: "left",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant,
  size,
  isLoading = false,
  loadingPosition,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, loadingPosition }), className)}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="w-4 h-4 mr-2 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      <span className={isLoading ? "opacity-80" : ""}>{children}</span>
    </button>
  );
};

export { Button, buttonVariants };
