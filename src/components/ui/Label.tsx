interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = ({ className = "", children, ...props }: LabelProps) => {
  return (
    <label className={`block ${className}`} {...props}>
      {children}
    </label>
  );
};
