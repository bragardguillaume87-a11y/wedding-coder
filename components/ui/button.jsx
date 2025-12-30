import React from 'react';

const Button = React.forwardRef(({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900 focus-visible:ring-slate-900',
    ghost: 'hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-900',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-8 text-lg',
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
