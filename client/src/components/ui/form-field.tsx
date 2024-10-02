import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}
export const FormField = ({ label, children }: FormFieldProps) => {
  return (
    <div className="flex items-center justify-between space-x-2 ">
      <span>{label}</span>

      {children}
    </div>
  );
};
