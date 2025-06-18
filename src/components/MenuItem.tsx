import React, { useState, useEffect } from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Minus, ShoppingCart, Settings2 } from 'lucide-react';

interface CustomizationOption {
  id: string;
  label: string;
  priceModifier?: number; // e.g., +1.00
}

interface CustomizationGroup {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  options: CustomizationOption[];
  required?: boolean;
}

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  customizationOptions?: CustomizationGroup[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  customizationOptions,
}) => {
  console.log('MenuItem component loaded for item:', name, 'ID:', id);

  const [quantity, setQuantity] = useState(1);
  const [isCustomizationSheetOpen, setIsCustomizationSheetOpen] = useState(false);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const initialCustomizations: Record<string, string | string[]> = {};
    customizationOptions?.forEach(group => {
      if (group.type === 'radio' && group.required && group.options.length > 0) {
        // Default to first option for required radio groups
        initialCustomizations[group.id] = group.options[0].id;
      } else if (group.type === 'checkbox') {
        initialCustomizations[group.id] = []; // Initialize checkboxes as empty array
      }
    });
    setSelectedCustomizations(initialCustomizations);
  }, [customizationOptions]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleCustomizationChange = (groupId: string, value: string | string[]) => {
    setSelectedCustomizations(prev => ({ ...prev, [groupId]: value }));
  };

  const handleCheckboxChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedCustomizations(prev => {
      const currentGroupSelection = (prev[groupId] as string[]) || [];
      let newGroupSelection: string[];
      if (checked) {
        newGroupSelection = [...currentGroupSelection, optionId];
      } else {
        newGroupSelection = currentGroupSelection.filter(id => id !== optionId);
      }
      return { ...prev, [groupId]: newGroupSelection };
    });
  };

  const calculateTotalPrice = (basePrice: number, currentQuantity: number, customizations: Record<string, string | string[]>, options?: CustomizationGroup[]) => {
    let finalItemPrice = basePrice;
    options?.forEach(group => {
      const selection = customizations[group.id];
      if (selection) {
        group.options.forEach(opt => {
          const isSelected = group.type === 'radio' ? opt.id === selection : (selection as string[]).includes(opt.id);
          if (isSelected && opt.priceModifier) {
            finalItemPrice += opt.priceModifier;
          }
        });
      }
    });
    return finalItemPrice * currentQuantity;
  };
  
  const performAddToCart = (customizationsToApply: Record<string, string | string[]>) => {
    let missingRequired = false;
    if (customizationOptions) {
      for (const group of customizationOptions) {
        if (group.required) {
          const selection = customizationsToApply[group.id];
          if (!selection || (Array.isArray(selection) && selection.length === 0)) {
            missingRequired = true;
            toast.error(`Please select an option for ${group.title}.`);
            break; 
          }
        }
      }
    }

    if (missingRequired) return;

    const totalOrderPrice = calculateTotalPrice(price, quantity, customizationsToApply, customizationOptions);

    toast.success(`${name} (x${quantity}) added to cart!`, {
      description: `Total: $${totalOrderPrice.toFixed(2)}. Customizations: ${JSON.stringify(customizationsToApply)}`,
    });
    console.log('Adding to cart:', { id, name, quantity, unitPrice: price, selectedCustomizations: customizationsToApply, totalOrderPrice });
    setIsCustomizationSheetOpen(false); // Close sheet if it was open
    // Reset quantity to 1 after adding to cart, if desired
    // setQuantity(1); 
    // Reset customizations to initial defaults, if desired
    // initializeCustomizations(); 
  };

  const handleAddToCartFromCard = () => {
    // If customizations are available and any are required, prompt to customize first.
    const hasRequiredOptions = customizationOptions?.some(group => group.required);
    if (hasRequiredOptions) {
        const allRequiredMet = customizationOptions.every(group => {
            if (!group.required) return true;
            const selection = selectedCustomizations[group.id];
            return selection && (!Array.isArray(selection) || selection.length > 0);
        });

        if(!allRequiredMet) {
            toast.info(`"${name}" requires customization.`, {
                action: {
                  label: "Customize",
                  onClick: () => setIsCustomizationSheetOpen(true),
                },
              });
              return;
        }
    }
    performAddToCart(selectedCustomizations);
  };

  const handleAddToCartFromSheet = () => {
    performAddToCart(selectedCustomizations);
  };

  return (
    <Card className="flex overflow-hidden shadow-sm hover:shadow-md transition-shadow w-full">
      <div className="w-1/3 md:w-1/4 flex-shrink-0">
        <AspectRatio ratio={1}>
          <img
            src={imageUrl || 'https://via.placeholder.com/300x300?text=Food+Item'}
            alt={name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <CardTitle className="text-base md:text-lg mb-1 line-clamp-1">{name}</CardTitle>
        <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2 flex-grow min-h-[2.5em] md:min-h-[3em]">
          {description}
        </p>
        <p className="text-base md:text-lg font-semibold mb-2 md:mb-3">${price.toFixed(2)}</p>
        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-8 w-8 md:h-9 md:w-9">
              <Minus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <span className="w-6 md:w-8 text-center text-sm md:text-base">{quantity}</span>
            <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8 md:h-9 md:w-9">
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
          <div className="flex gap-2 flex-col xs:flex-row">
            {customizationOptions && customizationOptions.length > 0 && (
              <Button variant="outline" onClick={() => setIsCustomizationSheetOpen(true)} className="text-xs md:text-sm px-2 py-1 h-8 md:h-9">
                <Settings2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Customize
              </Button>
            )}
            <Button onClick={handleAddToCartFromCard} className="text-xs md:text-sm px-2 py-1 h-8 md:h-9">
              <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      {customizationOptions && customizationOptions.length > 0 && (
        <Sheet open={isCustomizationSheetOpen} onOpenChange={setIsCustomizationSheetOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Customize: {name}</SheetTitle>
              <SheetDescription>
                Make your selections below. Price will be updated upon adding to cart.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              {customizationOptions.map((group) => (
                <div key={group.id} className="space-y-2 border-b pb-4 last:border-b-0">
                  <h4 className="font-medium text-sm">{group.title}{group.required && <span className="text-red-500">*</span>}</h4>
                  {group.type === 'radio' && (
                    <RadioGroup
                      value={selectedCustomizations[group.id] as string || ''}
                      onValueChange={(value) => handleCustomizationChange(group.id, value)}
                      required={group.required}
                      className="space-y-1"
                    >
                      {group.options.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.id} id={`${group.id}-${opt.id}`} />
                          <Label htmlFor={`${group.id}-${opt.id}`} className="font-normal text-sm">
                            {opt.label} {opt.priceModifier ? `(${opt.priceModifier > 0 ? '+' : ''}$${opt.priceModifier.toFixed(2)})` : ''}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {group.type === 'checkbox' && (
                    <div className="space-y-1">
                      {group.options.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${group.id}-${opt.id}`}
                            checked={((selectedCustomizations[group.id] as string[]) || []).includes(opt.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(group.id, opt.id, !!checked)}
                          />
                          <Label htmlFor={`${group.id}-${opt.id}`} className="font-normal text-sm">
                            {opt.label} {opt.priceModifier ? `(${opt.priceModifier > 0 ? '+' : ''}$${opt.priceModifier.toFixed(2)})` : ''}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <SheetFooter>
              <Button onClick={() => setIsCustomizationSheetOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleAddToCartFromSheet}>Apply & Add to Cart</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </Card>
  );
};

export default MenuItem;