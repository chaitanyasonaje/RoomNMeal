# RoomNMeal Design System

## Overview
This design system provides a unified set of components, tokens, and guidelines to ensure consistency across the RoomNMeal application.

## Design Tokens

### Colors
- **Primary**: Blue palette (primary-50 to primary-950)
- **Secondary**: Orange palette (secondary-50 to secondary-950)
- **Success**: Green palette (success-50 to success-950)
- **Error**: Red palette (error-50 to error-950)
- **Warning**: Yellow palette (warning-50 to warning-950)
- **Neutral**: Gray palette (gray-50 to gray-950)

### Typography
- **Font Families**:
  - Sans: Inter (body text)
  - Heading: Poppins (headings)
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- **Font Weights**: light, normal, medium, semibold, bold, extrabold

### Spacing
- **Scale**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32
- **Units**: rem-based (4px = 0.25rem)

### Border Radius
- **Scale**: none, sm, base, md, lg, xl, 2xl, 3xl, full

### Shadows
- **Scale**: sm, base, md, lg, xl, 2xl
- **Special**: glow, glow-lg

## Components

### Button
```jsx
<Button
  variant="primary" // primary, secondary, outline, ghost, success, error
  size="md" // sm, md, lg, xl
  loading={false}
  disabled={false}
  icon={<Icon />}
  iconPosition="left" // left, right
>
  Button Text
</Button>
```

### Card
```jsx
<Card
  variant="default" // default, elevated, flat
  interactive={false}
  onClick={handleClick}
>
  <Card.Header>Header Content</Card.Header>
  <Card.Body>Body Content</Card.Body>
  <Card.Footer>Footer Content</Card.Footer>
</Card>
```

### Input
```jsx
<Input
  label="Label"
  type="text"
  placeholder="Placeholder"
  icon={<Icon />}
  iconPosition="left" // left, right
  error="Error message"
  success="Success message"
  required
/>
```

### Typography
```jsx
<Typography
  variant="heading-1" // display-1, display-2, heading-1, heading-2, heading-3, heading-4, body-lg, body, body-sm, caption
  as="h1" // HTML element override
>
  Text Content
</Typography>
```

### Badge
```jsx
<Badge
  variant="primary" // primary, secondary, success, warning, error
  size="md" // sm, md, lg
>
  Badge Text
</Badge>
```

### Layout
```jsx
<Layout.Container size="default"> // sm, default, lg, full
  <Layout.Section size="default"> // sm, default, lg
    <Layout.Grid cols={3}>
      <Layout.Flex direction="row" align="center" justify="between">
        Content
      </Layout.Flex>
    </Layout.Grid>
  </Layout.Section>
</Layout.Container>
```

## Usage Guidelines

### Theme Support
The design system supports both light and dark themes using CSS custom properties:

```css
[data-theme="light"] {
  --color-background: var(--color-gray-50);
  --color-text-primary: var(--color-gray-900);
}

[data-theme="dark"] {
  --color-background: var(--color-gray-900);
  --color-text-primary: var(--color-gray-100);
}
```

### Responsive Design
All components are mobile-first and include responsive variants:

```jsx
<Layout.Grid cols={1} className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* Content */}
</Layout.Grid>
```

### Accessibility
- All interactive elements have proper focus states
- Color contrast meets WCAG AA standards
- Screen reader support with proper ARIA labels
- Keyboard navigation support

### Animation
Components include subtle animations using Framer Motion:
- Hover effects with scale transforms
- Smooth transitions
- Loading states
- Micro-interactions

## Migration Guide

### From Old Components
1. Replace custom button classes with `<Button>` component
2. Replace custom card classes with `<Card>` component
3. Replace custom input classes with `<Input>` component
4. Replace custom typography with `<Typography>` component
5. Use `<Layout>` components for consistent spacing

### CSS Classes
- Use design system classes instead of custom Tailwind classes
- Leverage CSS custom properties for theming
- Use utility classes for spacing and layout

## Best Practices

1. **Consistency**: Always use design system components
2. **Theming**: Use CSS custom properties for theme-aware styling
3. **Responsive**: Design mobile-first with progressive enhancement
4. **Accessibility**: Ensure all components meet accessibility standards
5. **Performance**: Use CSS custom properties for dynamic theming
6. **Maintainability**: Keep component APIs simple and consistent

## File Structure
```
src/
├── styles/
│   └── design-system.css
├── components/
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       ├── Typography.jsx
│       ├── Badge.jsx
│       └── Layout.jsx
└── context/
    └── ThemeContext.jsx
```
