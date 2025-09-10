# CSS Structure Guide - RoomNMeal

## Overview
This document outlines the CSS structure and organization for the RoomNMeal project, which uses Tailwind CSS with custom components and utilities.

## File Structure

### Main CSS Files
- `src/index.css` - Main CSS file with Tailwind imports and custom components
- `tailwind.config.js` - Tailwind configuration with custom theme extensions

## CSS Architecture

### 1. Tailwind CSS Base
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Custom Font Imports
- **Inter** - Primary font for body text
- **Poppins** - Display font for headings

### 3. Base Layer Customizations
- Global font family settings
- Smooth scrolling behavior
- Body background and text colors

### 4. Component Layer Classes

#### Button Components
- `.btn-primary` - Primary action buttons with gradient background
- `.btn-secondary` - Secondary buttons with white background
- `.btn-outline` - Outlined buttons with primary color border
- `.btn-accent` - Accent colored buttons
- `.btn-success` - Success state buttons
- `.btn-warning` - Warning state buttons

#### Card Components
- `.card` - Basic card with subtle shadow and hover effects
- `.card-hover` - Interactive card with enhanced hover effects
- `.card-glass` - Glassmorphism effect card
- `.card-gradient` - Gradient background card

#### Form Components
- `.input-field` - Standard input styling
- `.input-field-error` - Error state input styling
- `.form-label` - Form label styling
- `.form-group` - Form group container
- `.form-error` - Error message styling
- `.form-success` - Success message styling

#### Badge Components
- `.badge` - Base badge styling
- `.badge-primary` - Primary colored badge
- `.badge-secondary` - Secondary colored badge
- `.badge-success` - Success colored badge
- `.badge-warning` - Warning colored badge
- `.badge-accent` - Accent colored badge

#### Loading Components
- `.skeleton` - Base skeleton loading animation
- `.skeleton-text` - Text skeleton
- `.skeleton-avatar` - Avatar skeleton
- `.skeleton-card` - Card skeleton
- `.loading-overlay` - Full overlay loading state

#### Navigation Components
- `.nav-link` - Navigation link styling
- `.nav-link-active` - Active navigation link styling

#### Layout Utilities
- `.grid-auto-fit` - Responsive grid that auto-fits columns
- `.grid-feature` - Feature grid layout
- `.section-padding` - Standard section padding
- `.container-padding` - Container padding
- `.container-responsive` - Responsive container

#### Typography
- `.heading-1` - Large heading (4xl-6xl)
- `.heading-2` - Medium heading (3xl-4xl)
- `.heading-3` - Small heading (2xl-3xl)
- `.text-body` - Body text styling
- `.text-caption` - Caption text styling
- `.text-responsive` - Responsive text sizing
- `.heading-responsive` - Responsive heading sizing

#### Animation Classes
- `.animate-on-scroll` - Scroll-triggered animation
- `.animate-fade-in-up` - Fade in from bottom
- `.animate-fade-in-left` - Fade in from left
- `.animate-fade-in-right` - Fade in from right

#### Mobile-First Utilities
- `.mobile-first` - Mobile-first responsive width
- `.touch-friendly` - Touch-friendly minimum size

#### Glassmorphism
- `.glass` - Light glassmorphism effect
- `.glass-dark` - Dark glassmorphism effect

#### Shadow Utilities
- `.shadow-soft` - Soft shadow
- `.shadow-medium` - Medium shadow
- `.shadow-large` - Large shadow
- `.shadow-glow` - Glowing shadow effect
- `.shadow-glow-lg` - Large glowing shadow
- `.shadow-t` - Top shadow

#### Safe Area Utilities
- `.pb-safe` - Safe area bottom padding
- `.pt-safe` - Safe area top padding
- `.pl-safe` - Safe area left padding
- `.pr-safe` - Safe area right padding

#### Accessibility
- `.sr-only` - Screen reader only content
- `.focus-visible` - Enhanced focus styling

## Color System

### Primary Colors
- `primary-50` to `primary-900` - Sky blue color palette
- Used for main brand elements, buttons, and accents

### Secondary Colors
- `secondary-50` to `secondary-900` - Slate color palette
- Used for secondary elements and text

### Accent Colors
- `accent-50` to `accent-900` - Pink color palette
- Used for highlights and special elements

### Status Colors
- `success-50` to `success-900` - Green color palette
- `warning-50` to `warning-900` - Yellow color palette

## Animation System

### Built-in Animations
- `fade` - Fade in animation
- `slide` - Slide up animation
- `bounceIn` - Bounce in animation
- `shimmer` - Shimmer loading animation
- `float` - Floating animation

### Custom Keyframes
- `fadeIn` - Custom fade in keyframe
- `slideUp` - Custom slide up keyframe
- `bounce-in` - Custom bounce in keyframe
- `shimmer` - Custom shimmer keyframe
- `float` - Custom float keyframe

## Responsive Design

### Breakpoints
- `sm` - 640px and up
- `md` - 768px and up
- `lg` - 1024px and up
- `xl` - 1280px and up

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement for larger screens.

## Best Practices

### 1. Component Usage
- Use semantic component classes (`.btn-primary`, `.card-hover`)
- Avoid inline styles in favor of Tailwind classes
- Use CSS custom properties for dynamic values

### 2. Animation Guidelines
- Use `[animation-delay:value]` for dynamic delays
- Prefer CSS custom properties for JavaScript-controlled animations
- Include `motion-reduce` classes for accessibility

### 3. Responsive Design
- Always start with mobile styles
- Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Test on multiple screen sizes

### 4. Accessibility
- Use `.sr-only` for screen reader content
- Include `.focus-visible` for enhanced focus states
- Ensure sufficient color contrast

### 5. Performance
- Use Tailwind's purge feature to remove unused styles
- Prefer utility classes over custom CSS
- Use CSS custom properties for dynamic values

## Installation Notes

### Required Dependencies
```bash
npm install tailwindcss autoprefixer postcss
```

### Optional Plugins
```bash
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

Note: These plugins are commented out in the config but can be enabled if needed.

## Maintenance

### Adding New Components
1. Add component classes to the `@layer components` section
2. Follow the existing naming convention
3. Include responsive variants
4. Add hover and focus states
5. Document in this guide

### Modifying Colors
1. Update the color palette in `tailwind.config.js`
2. Update component classes that use the colors
3. Test across all components
4. Update documentation

### Performance Optimization
1. Regularly audit unused CSS
2. Use Tailwind's purge feature
3. Monitor bundle size
4. Optimize animations for performance
