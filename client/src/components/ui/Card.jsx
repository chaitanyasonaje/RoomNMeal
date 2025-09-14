import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: '',
    elevated: 'shadow-lg',
    flat: 'shadow-none border-0'
  };

  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${interactive ? 'card-interactive' : ''}
    ${className}
  `.trim();

  const CardComponent = interactive ? motion.div : 'div';
  const motionProps = interactive ? {
    whileHover: { y: -2 },
    whileTap: { y: 0 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
