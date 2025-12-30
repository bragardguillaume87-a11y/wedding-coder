import React from 'react';

const Badge = React.forwardRef(({
  className = '',
  variant = 'default',
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    default: 'border-transparent bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border-slate-300 text-slate-900',
    success: 'border-transparent bg-green-100 text-green-800',
    warning: 'border-transparent bg-yellow-100 text-yellow-800',
    danger: 'border-transparent bg-red-100 text-red-800',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <div
      ref={ref}
      className={`${baseStyles} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = 'Badge';

export { Badge };
