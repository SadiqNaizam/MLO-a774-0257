import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrderSummaryItem from '@/components/OrderSummaryItem'; // Custom component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Home, User, ShoppingCart, UtensilsCrossed, Ticket, Percent, FileText, CreditCard, Info } from 'lucide-react';

// Placeholder AppHeader component (as AppHeader is in layout_info but not custom_component_code)
const AppHeader = () => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <nav className="container mx-auto flex flex-wrap justify-between items-center p-4">
      <Link to="/" className="text-2xl font-bold text-primary">FoodApp</Link>
      <div className="space-x-2 sm:space-x-4 flex items-center flex-wrap">
        <Button variant="ghost" asChild><Link to="/"><Home className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Home</span></Link></Button>
        <Button variant="ghost" asChild><Link to="/restaurant-listing"><UtensilsCrossed className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Restaurants</span></Link></Button>
        <Button variant="ghost" asChild><Link to="/cart"><ShoppingCart className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Cart</span></Link></Button>
        <Button variant="ghost" asChild><Link to="/user-profile"><User className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Profile</span></Link></Button>
      </div>
    </nav>
  </header>
);

// Placeholder AppFooter component
const AppFooter = () => (
  <footer className="bg-gray-100 border-t p-6 text-center">
    <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} FoodApp. All rights reserved.</p>
    <div className="mt-2 space-x-4">
        <Link to="/" className="text-xs text-gray-500 hover:text-primary">Home</Link>
        <Link to="/user-profile" className="text-xs text-gray-500 hover:text-primary">My Account</Link>
    </div>
  </footer>
);

interface CartItemType {
  id: string;
  name: string;
  imageUrl: string;
  customizations?: { label: string; value: string }[];
  quantity: number;
  price: number; // Price of a single unit
}

const initialCartItems: CartItemType[] = [
  {
    id: 'item1',
    name: 'Spicy Chicken Burger Deluxe',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60',
    customizations: [
      { label: 'Spice Level', value: 'Extra Hot' },
      { label: 'Extra Cheese', value: 'Yes (+1.00)' }, // Example: price could be adjusted based on customization in a real app
    ],
    quantity: 1,
    price: 12.99,
  },
  {
    id: 'item2',
    name: 'Large Pepperoni Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1593560704563-f176a2eb61db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    quantity: 1,
    price: 18.50,
  },
  {
    id: 'item3',
    name: 'Cola Classic (Can)',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c29kYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60',
    quantity: 4,
    price: 1.75,
  },
];

const DELIVERY_FEE = 5.00;
const TAX_RATE = 0.08; // 8%
const VALID_PROMO_CODE = "SAVE15";
const PROMO_CODE_DISCOUNT_PERCENTAGE = 0.15; // 15%

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
  }, []);

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.info("Item removed from cart.");
  };

  const handleApplyPromoCode = () => {
    if (promoCode === VALID_PROMO_CODE) {
      setAppliedPromo(VALID_PROMO_CODE);
      toast.success(`Promo code "${VALID_PROMO_CODE}" applied! You get ${PROMO_CODE_DISCOUNT_PERCENTAGE * 100}% off.`);
    } else {
      setAppliedPromo(null);
      toast.error("Invalid or expired promo code.");
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (appliedPromo === VALID_PROMO_CODE) {
      return subtotal * PROMO_CODE_DISCOUNT_PERCENTAGE;
    }
    return 0;
  }, [subtotal, appliedPromo]);

  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxes = subtotalAfterDiscount * TAX_RATE;
  const totalAmount = subtotalAfterDiscount + (cartItems.length > 0 ? DELIVERY_FEE : 0) + taxes;

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before proceeding.");
      return;
    }
    console.log("Proceeding to checkout with:", {
      cartItems,
      subtotal,
      discountAmount,
      deliveryFee: DELIVERY_FEE,
      taxes,
      totalAmount,
      specialInstructions,
      appliedPromo,
    });
    toast.success("Proceeding to Checkout!", {
      description: "You will be redirected to the payment page shortly. (Simulation)"
    });
    // In a real app, navigate to a checkout page: navigate('/checkout');
    // For now, simulate or navigate home after a delay
    // setTimeout(() => navigate('/'), 2000); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto py-6 sm:py-8 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Your Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <Card className="text-center py-12 shadow-sm">
              <CardContent className="flex flex-col items-center">
                <ShoppingCart className="mx-auto h-20 w-20 sm:h-24 sm:w-24 text-gray-300 mb-4" />
                <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-700">Your cart is currently empty</h2>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Add some delicious meals from our restaurants to get started!
                </p>
                <Button asChild className="mt-6">
                  <Link to="/restaurant-listing">
                    <UtensilsCrossed className="mr-2 h-4 w-4" /> Browse Restaurants
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="lg:flex lg:gap-6 xl:gap-8">
              {/* Cart Items List */}
              <section className="lg:w-2/3 space-y-4">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Order Items ({cartItems.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {cartItems.map(item => (
                      <OrderSummaryItem
                        key={item.id}
                        id={item.id}
                        imageUrl={item.imageUrl}
                        name={item.name}
                        customizations={item.customizations}
                        quantity={item.quantity}
                        price={item.price}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                      />
                    ))}
                  </CardContent>
                </Card>
              </section>

              {/* Order Summary Card */}
              <aside className="lg:w-1/3 mt-6 lg:mt-0 space-y-6 sticky top-24 self-start"> {/* Sticky for desktop */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end space-x-2">
                      <div className="flex-grow">
                        <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                          <Ticket className="inline-block h-4 w-4 mr-1 text-primary" /> Promo Code
                        </label>
                        <Input
                          id="promoCode"
                          type="text"
                          placeholder="Enter code (e.g. SAVE15)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={!!appliedPromo}
                          className="text-sm"
                        />
                      </div>
                      <Button onClick={handleApplyPromoCode} disabled={!!appliedPromo || !promoCode} size="sm" className="whitespace-nowrap text-xs">
                        <Percent className="h-3.5 w-3.5 mr-1" /> Apply
                      </Button>
                    </div>

                    <div>
                      <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                        <FileText className="inline-block h-4 w-4 mr-1 text-primary" /> Special Instructions
                      </label>
                      <Textarea
                        id="specialInstructions"
                        placeholder="Any notes for the restaurant or delivery driver?"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({PROMO_CODE_DISCOUNT_PERCENTAGE*100}%):</span>
                          <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span className="font-medium">${DELIVERY_FEE.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes ({ (TAX_RATE * 100).toFixed(0) }%):</span>
                        <span className="font-medium">${taxes.toFixed(2)}</span>
                      </div>
                      <hr className="my-1" />
                      <div className="flex justify-between text-base font-semibold">
                        <span>Total Amount:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="lg" className="w-full" onClick={handleProceedToCheckout}>
                      <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
                 <p className="text-xs text-gray-500 text-center px-4">
                    <Info className="inline h-3 w-3 mr-1" /> For support, please contact us at support@foodapp.com.
                  </p>
              </aside>
            </div>
          )}
        </main>
      </ScrollArea>
      <AppFooter />
    </div>
  );
};

export default CartPage;