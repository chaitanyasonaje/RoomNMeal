import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error'
  };
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-2'
  };

  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;
