import React from 'react'

interface FormInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  options?: { value: string; label: string }[]
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  rows,
  options
}) => {
  const baseClasses = "w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm font-poppins"

  if (type === 'select' && options) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 font-poppins">
          {label} {required && <span className="text-pink-500">*</span>}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
          required={required}
        >
          <option value="">Pilih {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 font-poppins">
          {label} {required && <span className="text-pink-500">*</span>}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows || 4}
          className={baseClasses}
          required={required}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 font-poppins">
        {label} {required && <span className="text-pink-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={baseClasses}
        required={required}
      />
    </div>
  )
}

export default FormInput