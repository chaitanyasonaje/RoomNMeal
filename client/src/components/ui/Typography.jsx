import React from 'react';

const Typography = ({
  variant = 'body',
  children,
  className = '',
  as: Component,
  ...props
}) => {
  const variantClasses = {
    'display-1': 'text-display-1',
    'display-2': 'text-display-2',
    'heading-1': 'text-heading-1',
    'heading-2': 'text-heading-2',
    'heading-3': 'text-heading-3',
    'heading-4': 'text-heading-4',
    'body-lg': 'text-body-lg',
    'body': 'text-body',
    'body-sm': 'text-body-sm',
    'caption': 'text-caption'
  };

  const defaultComponents = {
    'display-1': 'h1',
    'display-2': 'h1',
    'heading-1': 'h1',
    'heading-2': 'h2',
    'heading-3': 'h3',
    'heading-4': 'h4',
    'body-lg': 'p',
    'body': 'p',
    'body-sm': 'p',
    'caption': 'span'
  };

  const Element = Component || defaultComponents[variant];
  const classes = `${variantClasses[variant]} ${className}`.trim();

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
};

export default Typography;
