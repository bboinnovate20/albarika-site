import React from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  placeholder = '',
  required = false,
  onChange,
  name,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
      />
    </div>
  );
};

export default FormInput;
