import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const baseClasses =
  "rounded-lg font-bold cursor-pointer transition-colors disabled:bg-gray-300 min-w-[120px] disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#7695EC] text-white hover:bg-blue-600",
  secondary:
    "bg-[#FFFFFF] border border-[#999999] text-black hover:bg-gray-100",
  danger: "bg-[#FF5151] text-white hover:bg-red-600",
  success: "bg-[#47B960] text-white hover:bg-green-700",
};

const sizeClasses: Record<ButtonVariant, string> = {
  primary: "px-6 py-1",
  secondary: "px-6 py-1",
  danger: "px-6 py-1",
  success: "px-6 py-1",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      className = "",
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[variant]} ${className}`;

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
