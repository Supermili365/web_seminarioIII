import React, { type InputHTMLAttributes } from "react";
import {
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from "react-hook-form";

type RHFError = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | RHFError;
}

function InputField({ label, error, type = "text", ...rest }: InputProps) {
  // sacamos el mensaje según el tipo
  const errorMessage =
    typeof error === "string"
      ? error
      : (error as FieldError | undefined)?.message;

  return (
    <div className="form-label">
      <label>{label}</label>

      <input type={type} {...rest} />

      {errorMessage && <span className="error-text">{errorMessage}</span>}
    </div>
  );
}

export default InputField;
