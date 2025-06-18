import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Standard shadcn/ui utility

interface CuisineChipProps {
  cuisineName: string;
  onClick?: (cuisineName: string) => void;
  isActive?: boolean;
  className?: string;
}

const CuisineChip: React.FC<CuisineChipProps> = ({
  cuisineName,
  onClick,
  isActive = false,
  className,
}) => {
  console.log(`CuisineChip loaded for: ${cuisineName}, isActive: ${isActive}`);

  const handleClick = () => {
    if (onClick) {
      onClick(cuisineName);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick();
    }
  };

  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        "cursor-pointer select-none transition-all duration-150 ease-in-out",
        "hover:shadow-md",
        isActive 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`Filter by ${cuisineName}`}
    >
      {cuisineName}
    </Badge>
  );
};

export default CuisineChip;