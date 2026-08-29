import React from "react";
import { Filter } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeFiltersCount?: number;
  onFilterClick?: () => void;
}

export function FilterBar({ activeFiltersCount = 0, onFilterClick, className, children, ...props }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)} {...props}>
      <Button variant="outline" size="sm" onClick={onFilterClick} className="flex items-center gap-2 h-9 text-text-secondary hover:text-text-primary">
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-1 bg-primary text-white text-caption rounded-full w-4 h-4 flex items-center justify-center font-semibold">
            {activeFiltersCount}
          </span>
        )}
      </Button>
      {children}
    </div>
  );
}
