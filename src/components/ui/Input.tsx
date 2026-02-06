import { forwardRef } from "react";
import { Label } from "./Label";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  textarea?: false;
}

interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> {
  label?: string;
  error?: string;
  textarea: true;
}

type CombinedProps = InputProps | TextareaProps;

const InputInner = (
  { label, error, className = "", textarea = false, ...props }: CombinedProps,
  ref: React.Ref<HTMLInputElement | HTMLTextAreaElement>,
) => {
  const baseClasses =
    "w-full px-2.5 py-1 border max-h-8 border-[#777777] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7695EC] placeholder-[#CCCCCC]";
  const textareaClasses = "resize-none";
  const finalClasses = `${baseClasses} ${textarea ? textareaClasses : ""} ${className}`;

  if (textarea) {
    return (
      <div className="flex flex-col gap-2">
        {label && <Label>{label}</Label>}
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={finalClasses}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        className={finalClasses}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const Input = forwardRef(InputInner);
Input.displayName = "Input";
