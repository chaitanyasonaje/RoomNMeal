// Design System Migration Utilities
// This file provides utilities to help migrate components to the unified design system

export const componentMappings = {
  // Button mappings
  'btn-primary': 'Button variant="primary"',
  'btn-secondary': 'Button variant="secondary"',
  'btn-outline': 'Button variant="outline"',
  'btn-ghost': 'Button variant="ghost"',
  'btn-success': 'Button variant="success"',
  'btn-error': 'Button variant="error"',
  
  // Card mappings
  'card': 'Card',
  'card-hover': 'Card interactive',
  'card-glass': 'Card variant="elevated"',
  'card-gradient': 'Card variant="elevated"',
  
  // Input mappings
  'input-field': 'Input',
  'form-label': 'Input label prop',
  'form-group': 'Input wrapper',
  
  // Typography mappings
  'heading-1': 'Typography variant="heading-1"',
  'heading-2': 'Typography variant="heading-2"',
  'heading-3': 'Typography variant="heading-3"',
  'text-body': 'Typography variant="body"',
  'text-caption': 'Typography variant="caption"',
  
  // Layout mappings
  'container': 'Layout.Container',
  'section-padding': 'Layout.Section',
  'grid-auto-fit': 'Layout.Grid',
  
  // Badge mappings
  'badge': 'Badge',
  'badge-primary': 'Badge variant="primary"',
  'badge-secondary': 'Badge variant="secondary"',
  'badge-success': 'Badge variant="success"',
  'badge-warning': 'Badge variant="warning"',
  'badge-error': 'Badge variant="error"'
};

export const spacingMappings = {
  'p-1': 'p-1',
  'p-2': 'p-2',
  'p-3': 'p-3',
  'p-4': 'p-4',
  'p-5': 'p-5',
  'p-6': 'p-6',
  'p-8': 'p-8',
  'px-1': 'px-1',
  'px-2': 'px-2',
  'px-3': 'px-3',
  'px-4': 'px-4',
  'px-5': 'px-5',
  'px-6': 'px-6',
  'px-8': 'px-8',
  'py-1': 'py-1',
  'py-2': 'py-2',
  'py-3': 'py-3',
  'py-4': 'py-4',
  'py-5': 'py-5',
  'py-6': 'py-6',
  'py-8': 'py-8',
  'm-1': 'm-1',
  'm-2': 'm-2',
  'm-3': 'm-3',
  'm-4': 'm-4',
  'm-5': 'm-5',
  'm-6': 'm-6',
  'm-8': 'm-8',
  'mb-1': 'mb-1',
  'mb-2': 'mb-2',
  'mb-3': 'mb-3',
  'mb-4': 'mb-4',
  'mb-5': 'mb-5',
  'mb-6': 'mb-6',
  'mb-8': 'mb-8',
  'mt-1': 'mt-1',
  'mt-2': 'mt-2',
  'mt-3': 'mt-3',
  'mt-4': 'mt-4',
  'mt-5': 'mt-5',
  'mt-6': 'mt-6',
  'mt-8': 'mt-8'
};

export const colorMappings = {
  // Text colors
  'text-gray-900': 'text-gray-900',
  'text-gray-800': 'text-gray-800',
  'text-gray-700': 'text-gray-700',
  'text-gray-600': 'text-gray-600',
  'text-gray-500': 'text-gray-500',
  'text-gray-400': 'text-gray-400',
  'text-gray-300': 'text-gray-300',
  'text-gray-200': 'text-gray-200',
  'text-gray-100': 'text-gray-100',
  'text-white': 'text-white',
  'text-primary-600': 'text-primary-600',
  'text-primary-700': 'text-primary-700',
  'text-primary-800': 'text-primary-800',
  'text-success-600': 'text-success-600',
  'text-error-600': 'text-error-600',
  'text-warning-600': 'text-warning-600',
  
  // Background colors
  'bg-gray-50': 'bg-gray-50',
  'bg-gray-100': 'bg-gray-100',
  'bg-gray-200': 'bg-gray-200',
  'bg-gray-300': 'bg-gray-300',
  'bg-gray-400': 'bg-gray-400',
  'bg-gray-500': 'bg-gray-500',
  'bg-gray-600': 'bg-gray-600',
  'bg-gray-700': 'bg-gray-700',
  'bg-gray-800': 'bg-gray-800',
  'bg-gray-900': 'bg-gray-900',
  'bg-white': 'bg-white',
  'bg-primary-50': 'bg-primary-50',
  'bg-primary-100': 'bg-primary-100',
  'bg-primary-200': 'bg-primary-200',
  'bg-primary-300': 'bg-primary-300',
  'bg-primary-400': 'bg-primary-400',
  'bg-primary-500': 'bg-primary-500',
  'bg-primary-600': 'bg-primary-600',
  'bg-primary-700': 'bg-primary-700',
  'bg-primary-800': 'bg-primary-800',
  'bg-primary-900': 'bg-primary-900',
  'bg-success-50': 'bg-success-50',
  'bg-success-100': 'bg-success-100',
  'bg-success-500': 'bg-success-500',
  'bg-success-600': 'bg-success-600',
  'bg-error-50': 'bg-error-50',
  'bg-error-100': 'bg-error-100',
  'bg-error-500': 'bg-error-500',
  'bg-error-600': 'bg-error-600',
  'bg-warning-50': 'bg-warning-50',
  'bg-warning-100': 'bg-warning-100',
  'bg-warning-500': 'bg-warning-500',
  'bg-warning-600': 'bg-warning-600'
};

export const sizeMappings = {
  'text-xs': 'text-xs',
  'text-sm': 'text-sm',
  'text-base': 'text-base',
  'text-lg': 'text-lg',
  'text-xl': 'text-xl',
  'text-2xl': 'text-2xl',
  'text-3xl': 'text-3xl',
  'text-4xl': 'text-4xl',
  'text-5xl': 'text-5xl',
  'text-6xl': 'text-6xl'
};

export const responsiveMappings = {
  'sm:': 'sm:',
  'md:': 'md:',
  'lg:': 'lg:',
  'xl:': 'xl:',
  '2xl:': '2xl:'
};

// Helper function to migrate className strings
export const migrateClassName = (className) => {
  if (!className) return '';
  
  const classes = className.split(' ');
  const migratedClasses = classes.map(cls => {
    // Check for component mappings
    if (componentMappings[cls]) {
      return `/* ${componentMappings[cls]} */`;
    }
    
    // Check for spacing mappings
    if (spacingMappings[cls]) {
      return spacingMappings[cls];
    }
    
    // Check for color mappings
    if (colorMappings[cls]) {
      return colorMappings[cls];
    }
    
    // Check for size mappings
    if (sizeMappings[cls]) {
      return sizeMappings[cls];
    }
    
    // Check for responsive mappings
    const responsivePrefix = Object.keys(responsiveMappings).find(prefix => 
      cls.startsWith(prefix)
    );
    if (responsivePrefix) {
      const baseClass = cls.substring(responsivePrefix.length);
      if (componentMappings[baseClass]) {
        return `/* ${responsivePrefix}${componentMappings[baseClass]} */`;
      }
      if (spacingMappings[baseClass]) {
        return `${responsivePrefix}${spacingMappings[baseClass]}`;
      }
      if (colorMappings[baseClass]) {
        return `${responsivePrefix}${colorMappings[baseClass]}`;
      }
      if (sizeMappings[baseClass]) {
        return `${responsivePrefix}${sizeMappings[baseClass]}`;
      }
    }
    
    // Return original class if no mapping found
    return cls;
  });
  
  return migratedClasses.join(' ');
};

// Helper function to generate migration suggestions
export const generateMigrationSuggestions = (componentName, className) => {
  const suggestions = [];
  const classes = className.split(' ');
  
  classes.forEach(cls => {
    if (componentMappings[cls]) {
      suggestions.push({
        type: 'component',
        original: cls,
        suggestion: componentMappings[cls],
        description: `Replace ${cls} with ${componentMappings[cls]} component`
      });
    }
  });
  
  return suggestions;
};

// Helper function to check for design system compliance
export const checkDesignSystemCompliance = (componentName, props) => {
  const issues = [];
  
  // Check for hardcoded colors
  if (props.className && props.className.includes('text-') && !props.className.includes('text-gray-') && !props.className.includes('text-primary-')) {
    issues.push({
      type: 'color',
      message: 'Consider using design system color tokens instead of hardcoded colors',
      suggestion: 'Use CSS custom properties or design system color classes'
    });
  }
  
  // Check for hardcoded spacing
  if (props.className && props.className.match(/[mp][tblrxy]?-\d+/)) {
    issues.push({
      type: 'spacing',
      message: 'Consider using design system spacing tokens',
      suggestion: 'Use CSS custom properties for consistent spacing'
    });
  }
  
  // Check for missing accessibility attributes
  if (componentName === 'Button' && !props['aria-label'] && !props.children) {
    issues.push({
      type: 'accessibility',
      message: 'Button should have accessible text or aria-label',
      suggestion: 'Add children or aria-label prop'
    });
  }
  
  return issues;
};

export default {
  componentMappings,
  spacingMappings,
  colorMappings,
  sizeMappings,
  responsiveMappings,
  migrateClassName,
  generateMigrationSuggestions,
  checkDesignSystemCompliance
};
