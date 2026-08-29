import React from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ className, containerClassName, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-text-muted" />
      </div>
      <input
        type="text"
        className={cn(
          "block w-full pl-10 pr-4 py-2 h-9 border border-border rounded-md leading-5 bg-surface placeholder-text-muted text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-body-sm transition-shadow shadow-subtle",
          className
        )}
        {...props}
      />
    </div>
  );
}
