type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
};

export function FormLabel({
  htmlFor,
  children,
  required,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-b1">
      {children}

      {required && (
        <span className="ml-1 text-000">*</span>
      )}
    </label>
  );
}