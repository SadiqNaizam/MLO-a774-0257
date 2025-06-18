import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from 'lucide-react';

interface Customization {
  label: string;
  value: string;
}

interface OrderSummaryItemProps {
  id: string | number;
  imageUrl: string;
  name: string;
  customizations?: Customization[];
  quantity: number;
  price: number; // Price of a single unit
  onQuantityChange: (itemId: string | number, newQuantity: number) => void;
  onRemoveItem: (itemId: string | number) => void;
  // Optional: maxQuantity can be added if specific stock limits per item are needed
  // maxQuantity?: number; 
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  id,
  imageUrl,
  name,
  customizations,
  quantity,
  price,
  onQuantityChange,
  onRemoveItem,
}) => {
  console.log(`OrderSummaryItem loaded for: ${name} (ID: ${id})`);

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    // Assuming a practical upper limit, e.g., 99, can be made a prop (maxQuantity)
    if (quantity < 99) { 
      onQuantityChange(id, quantity + 1);
    }
  };

  const subtotal = price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border-b last:border-b-0">
      {/* Image */}
      <Avatar className="h-20 w-20 rounded-md shrink-0">
        <AvatarImage src={imageUrl} alt={name} className="object-cover" />
        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Details (Name & Customizations) */}
      <div className="flex-grow text-center sm:text-left">
        <p className="font-semibold text-md sm:text-lg">{name}</p>
        {customizations && customizations.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
            {customizations.map((cust, index) => (
              <p key={index} className="truncate" title={`${cust.label}: ${cust.value}`}>
                {cust.label}: {cust.value}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        <span className="w-10 text-center font-medium text-sm sm:text-base tabular-nums">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={quantity >= 99} // Example max quantity
          aria-label="Increase quantity"
          className="h-8 w-8 sm:h-9 sm:w-9"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Subtotal */}
      <p className="w-20 sm:w-24 text-center sm:text-right font-semibold text-sm sm:text-base tabular-nums shrink-0">
        ${subtotal.toFixed(2)}
      </p>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemoveItem(id)}
        className="text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-9 sm:w-9 shrink-0"
        aria-label="Remove item"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};

export default OrderSummaryItem;