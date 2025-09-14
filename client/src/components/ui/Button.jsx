import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    success: 'btn-success',
    error: 'btn-error'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${loading ? 'loading' : ''}
    ${className}
  `.trim();

  const iconElement = icon && (
    <span className={loading ? 'opacity-0' : ''}>
      {icon}
    </span>
  );

  const loadingElement = loading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loadingElement}
      {iconPosition === 'left' && iconElement}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      {iconPosition === 'right' && iconElement}
    </motion.button>
  );
};

export default Button;
