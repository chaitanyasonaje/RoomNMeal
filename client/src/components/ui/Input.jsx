import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  success,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const inputClasses = `
    form-input
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${error ? 'border-red-500' : ''}
    ${success ? 'border-green-500' : ''}
    ${className}
  `.trim();

  const iconElement = icon && (
    <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
      <span className="text-gray-400">{icon}</span>
    </div>
  );

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {iconElement}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}
      {success && (
        <div className="form-success">
          {success}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
