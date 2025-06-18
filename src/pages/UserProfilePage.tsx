import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Custom Components
import LiveOrderTracker from '@/components/LiveOrderTracker';

// Shadcn/UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Label is used directly sometimes, FormLabel via FormItem
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

// Lucide Icons
import {
  User, Mail, Phone, MapPin, CreditCard, ShoppingBag as HistoryIcon, HelpCircle, LogOut,
  Edit2, Trash2, PlusCircle, Home, Utensils, ShoppingCart, UserCircle as UserCircleIcon, ChevronRight
} from 'lucide-react';

// Profile Form Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^(\+\d{1,3}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/, "Invalid phone number format. (e.g., 555-123-4567 or +1 555-123-4567)").or(z.literal("")),
});
type ProfileFormData = z.infer<typeof profileSchema>;

// Placeholder Data Types
interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

interface PaymentMethod {
  id: string;
  type: string; // e.g., 'Visa', 'MasterCard'
  last4: string;
  expiry: string; // MM/YYYY
  isDefault?: boolean;
}

interface PastOrder {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Cancelled' | 'Processing';
  restaurantName: string;
  itemCount: number;
}

// Placeholder User Data
const initialUser = {
  id: 'user123',
  name: 'Alex Ryder',
  email: 'alex.ryder@example.com',
  phone: '555-123-4567',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexryder',
};

const UserProfilePage = () => {
  console.log('UserProfilePage loaded');
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUser);
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'addr1', type: 'Home', street: '123 Willow Creek Rd', city: 'Springfield', state: 'IL', zip: '62704', isDefault: true },
    { id: 'addr2', type: 'Work', street: '456 Business Hub', city: 'Springfield', state: 'IL', zip: '62701', isDefault: false },
  ]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'pay1', type: 'Visa', last4: '4242', expiry: '12/2025', isDefault: true },
    { id: 'pay2', type: 'MasterCard', last4: '5555', expiry: '06/2026', isDefault: false },
  ]);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([
    { id: 'orderX1', date: '2024-07-25', total: 35.99, status: 'Delivered', restaurantName: 'Luigi\'s Pizza', itemCount: 3 },
    { id: 'orderY2', date: '2024-07-20', total: 22.50, status: 'Delivered', restaurantName: 'Sushi Express', itemCount: 2 },
    { id: 'orderZ3', date: '2024-06-15', total: 15.75, status: 'Cancelled', restaurantName: 'Burger Joint', itemCount: 1 },
  ]);

  const activeOrder = {
    id: "LIVE456",
    stage: 'preparing' as 'placed' | 'preparing' | 'out-for-delivery' | 'delivered',
    estimatedTime: "Approx. 25 mins",
  };

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    setUser(prevUser => ({ ...prevUser, ...data }));
    toast.success("Profile updated successfully!");
    console.log("Profile data submitted:", data);
  };

  const handleLogout = () => {
    console.log("Logout action triggered");
    toast.info("You have been logged out (simulated).");
    // In a real app, you would clear auth state and redirect.
    // navigate('/login'); // No /login route in provided App.tsx
    navigate('/'); // Navigate to home as a fallback
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* AppHeader Placeholder */}
      <header className="bg-white dark:bg-slate-800 border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            FoodDash
          </Link>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart" aria-label="View Cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>

      <ScrollArea className="flex-grow">
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
            My Profile & Settings
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Profile Info & Active Order */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                    <CardDescription>Manage your personal information.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 555-123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {activeOrder && (
                <Card>
                  <CardHeader>
                    <CardTitle>Active Order</CardTitle>
                    <CardDescription>Track your current food delivery.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LiveOrderTracker
                      orderId={activeOrder.id}
                      currentStageId={activeOrder.stage}
                      estimatedDeliveryTime={activeOrder.estimatedTime}
                      onContactRider={() => toast.info("Contact rider feature coming soon!")}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Addresses, Payment, History, etc. */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" />Delivery Addresses</CardTitle>
                  <CardDescription>Manage your saved addresses.</CardDescription>
                </CardHeader>
                <CardContent>
                  {addresses.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {addresses.map((address) => (
                        <AccordionItem value={address.id} key={address.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-medium">{address.type} - {address.street.substring(0,25)}{address.street.length > 25 ? "..." : ""}</span>
                              {address.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-2 text-sm">
                            <p>{address.street}, {address.city}, {address.state} {address.zip}</p>
                            <div className="flex space-x-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => toast.info(`Edit address ${address.id} (not implemented)`)}><Edit2 className="mr-1 h-3 w-3" /> Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => toast.error(`Delete address ${address.id} (not implemented)`)}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-muted-foreground">No saved addresses.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Add new address (not implemented)")}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary" />Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment options.</CardDescription>
                </CardHeader>
                <CardContent>
                   {paymentMethods.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {paymentMethods.map((method) => (
                        <AccordionItem value={method.id} key={method.id}>
                           <AccordionTrigger className="hover:no-underline">
                             <div className="flex justify-between items-center w-full">
                               <span className="font-medium">{method.type} ending in {method.last4}</span>
                               {method.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                             </div>
                           </AccordionTrigger>
                           <AccordionContent className="space-y-2 text-sm">
                            <p>Expires: {method.expiry}</p>
                            <div className="flex space-x-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => toast.info(`Edit payment ${method.id} (not implemented)`)}><Edit2 className="mr-1 h-3 w-3" /> Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => toast.error(`Delete payment ${method.id} (not implemented)`)}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                     <p className="text-muted-foreground">No saved payment methods.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Add new payment method (not implemented)")}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Payment Method
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><HistoryIcon className="mr-2 h-5 w-5 text-primary" />Order History</CardTitle>
                  <CardDescription>View your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                  {pastOrders.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {pastOrders.map(order => (
                        <AccordionItem value={order.id} key={order.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex justify-between items-center w-full text-sm">
                                <div>Order <span className="font-semibold text-primary">#{order.id.toUpperCase()}</span> from {order.restaurantName}</div>
                                <div className="text-xs text-muted-foreground">{order.date}</div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm">
                            <p>Status: <span className={`font-medium ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{order.status}</span></p>
                            <p>Items: {order.itemCount}</p>
                            <p>Total: <span className="font-semibold">${order.total.toFixed(2)}</span></p>
                            <Button variant="link" size="sm" className="p-0 h-auto mt-1" onClick={() => toast.info(`View details for order ${order.id} (not implemented)`)}>
                              View Details <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-muted-foreground">You have no past orders.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                   <CardTitle className="flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-primary" />Help & Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>Having trouble? Contact us at <a href="mailto:support@fooddash.app" className="text-primary hover:underline">support@fooddash.app</a>.</p>
                    <p>Or call us at <a href="tel:+18001234567" className="text-primary hover:underline">+1 (800) 123-4567</a>.</p>
                    <Button variant="outline" className="w-full mt-2" onClick={() => toast.info("FAQ page (not implemented)")}>View FAQs</Button>
                </CardContent>
              </Card>

              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </main>
      </ScrollArea>

      {/* AppFooter Placeholder (typically for mobile) */}
      <footer className="bg-white dark:bg-slate-800 border-t sticky bottom-0 z-50 lg:hidden">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-around">
          <Link to="/" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
            <Home className="h-5 w-5 mb-0.5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/restaurant-listing" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
            <Utensils className="h-5 w-5 mb-0.5" />
            <span className="text-xs">Restaurants</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5 mb-0.5" />
            <span className="text-xs">Cart</span>
          </Link>
          <Link to="/user-profile" className="flex flex-col items-center text-primary transition-colors"> {/* Active Link */}
            <UserCircleIcon className="h-5 w-5 mb-0.5" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default UserProfilePage;