import React from 'react';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost', size?: string }>(({ className = '', variant = 'default', size, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-label-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-900/90',
    outline: 'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900',
    ghost: 'hover:bg-slate-100 hover:text-slate-900',
  };
  const variantStyles = variants[variant] || variants.default;

  return (
    <button ref={ref} className={`${baseStyles} ${variantStyles} ${className}`} {...props} />
  );
});
Button.displayName = 'Button';
