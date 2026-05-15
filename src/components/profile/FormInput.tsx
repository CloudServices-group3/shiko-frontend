import { FormLabel } from "./FormLabel";

type FormInputProps = {
  id: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

export default function FormInput({
  id,
  type = "text",
  placeholder,
  required = false,
  error,
}: FormInputProps) {
  return (
    <div className="space-y-2">

      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className={`w-full rounded-xl border p-4 outline-none transition ${
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