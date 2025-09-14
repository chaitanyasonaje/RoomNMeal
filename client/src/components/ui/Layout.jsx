import React from 'react';

const Container = ({ children, className = '', size = 'default', ...props }) => {
  const sizeClasses = {
    sm: 'max-w-4xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-2xl',
    full: 'max-w-none'
  };

  const containerClasses = `
    container
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

const Section = ({ children, className = '', size = 'default', ...props }) => {
  const sizeClasses = {
    sm: 'section-sm',
    default: 'section',
    lg: 'section-lg'
  };

  const sectionClasses = `
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <section className={sectionClasses} {...props}>
      {children}
    </section>
  );
};

const Grid = ({ children, cols = 1, className = '', ...props }) => {
  const gridClasses = `
    grid
    grid-cols-${cols}
    ${className}
  `.trim();

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

const Flex = ({ 
  children, 
  direction = 'row', 
  align = 'start', 
  justify = 'start', 
  wrap = false,
  gap = 'default',
  className = '',
  ...props 
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    default: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const flexClasses = `
    flex
    ${directionClasses[direction]}
    ${alignClasses[align]}
    ${justifyClasses[justify]}
    ${wrap ? 'flex-wrap' : ''}
    ${gapClasses[gap]}
    ${className}
  `.trim();

  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  );
};

Layout.Container = Container;
Layout.Section = Section;
Layout.Grid = Grid;
Layout.Flex = Flex;

export default Layout;
