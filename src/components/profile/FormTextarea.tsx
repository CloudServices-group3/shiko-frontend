import { FormLabel } from "./FormLabel";

type FormTextareaProps = {
  id: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function FormTextarea({
  id,
  placeholder,
  required = false,
  rows = 5,
  error,
  value,
  onChange,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">

      <textarea
        id={id}
        required={required}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        className={`w-full resize-none rounded-xl border p-4 outline-none transition ${
          error
            ? "border-red-500"
            : "border-ddd focus:border-p2"
        }`}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}