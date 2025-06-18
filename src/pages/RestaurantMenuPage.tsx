import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MenuItem from '@/components/MenuItem'; // Custom component
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, ShoppingCart, UserCircle, ListOrdered, Utensils, Search, Star, MapPin, ClockIcon, Info, ThumbsUp } from 'lucide-react';

// Interfaces for Restaurant Data (based on page_type_info and MenuItem props)
interface CustomizationOption {
  id: string;
  label: string;
  priceModifier?: number;
}

interface CustomizationGroup {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  options: CustomizationOption[];
  required?: boolean;
}

interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  customizationOptions?: CustomizationGroup[];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItemData[];
}

interface Restaurant {
  id: string;
  name: string;
  heroImageUrl: string;
  logoUrl?: string;
  address: string;
  rating: number;
  reviewsCount: number;
  openingHours: string;
  cuisine: string;
  description: string;
  detailedInfo?: {
    phoneNumber?: string;
    website?: string;
    fullOpeningHours?: Record<string, string>; // e.g., { Monday: "10-8", Tuesday: "10-8" }
    amenities?: string[]; // e.g., ["Outdoor Seating", "WiFi"]
  };
  menu: {
    categories: MenuCategory[];
  };
}

// Placeholder AppHeader component
const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Utensils className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FoodDash</span>
        </Link>
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-md">
            <Input type="search" placeholder="Search restaurants or dishes..." className="w-full pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="h-4 w-4 mr-1" /> Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/restaurant-listing">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <ListOrdered className="h-4 w-4 mr-1" /> Restaurants
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/cart">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <ShoppingCart className="h-4 w-4 mr-1" /> Cart
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/user-profile">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <UserCircle className="h-4 w-4 mr-1" /> Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

// Placeholder AppFooter component
const AppFooter: React.FC = () => {
  return (
    <footer className="border-t bg-muted/40 py-6 md:py-8">
      <div className="container text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} FoodDash Inc. All rights reserved.
        <div className="mt-2">
          <Link to="/about" className="hover:underline px-2">About Us</Link> |
          <Link to="/contact" className="hover:underline px-2">Contact</Link> |
          <Link to="/privacy" className="hover:underline px-2">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

// ShadCN Input component for AppHeader (not typically defined in page, but for self-containment of example)
// In a real app, this would be imported from '@/components/ui/input'
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


// Mock data fetching function
const fetchRestaurantDetails = (id: string): Promise<Restaurant> => {
  console.log(`Fetching details for restaurant ID: ${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const commonCustomizations: CustomizationGroup[] = [
        {
          id: 'spice', title: 'Spice Level', type: 'radio', required: true,
          options: [ { id: 'mild', label: 'Mild' }, { id: 'medium', label: 'Medium' }, { id: 'hot', label: 'Hot' } ],
        },
        {
          id: 'extra', title: 'Extras', type: 'checkbox',
          options: [
            { id: 'cheese', label: 'Extra Cheese', priceModifier: 1.00 },
            { id: 'sauce', label: 'Extra Sauce', priceModifier: 0.50 },
          ],
        },
      ];

      const mockData: Record<string, Restaurant> = {
        "1": {
          id: '1',
          name: 'The Gourmet Kitchen',
          heroImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          logoUrl: 'https://via.placeholder.com/80x80.png?text=GK',
          address: '123 Culinary Ave, Foodie City, FC 12345',
          rating: 4.8,
          reviewsCount: 520,
          openingHours: '10:00 AM - 11:00 PM',
          cuisine: 'Modern European',
          description: 'Experience exquisite Modern European cuisine crafted with passion and the freshest local ingredients. Perfect for any occasion.',
          detailedInfo: {
            phoneNumber: "555-0101",
            website: "https://gourmetkitchen.example.com",
            fullOpeningHours: { Monday: "10am-11pm", Tuesday: "10am-11pm", Wednesday: "10am-11pm", Thursday: "10am-11pm", Friday: "10am-12am", Saturday: "9am-12am", Sunday: "9am-10pm" },
            amenities: ["Free WiFi", "Outdoor Seating", "Valet Parking", "Accepts Credit Cards"]
          },
          menu: {
            categories: [
              { id: 'cat1', name: 'Appetizers', items: [
                { id: 'item101', name: 'Bruschetta Trio', description: 'Tomato & basil, mushroom & truffle, olive tapenade.', price: 12.50, imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                { id: 'item102', name: 'Crispy Calamari', description: 'Served with a zesty lemon aioli.', price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1600395098059-228150fca62f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', customizationOptions: [{ id: 'dip', title: 'Dip Choice', type: 'radio', options: [{id: 'aioli', label: 'Lemon Aioli'}, {id: 'marinara', label: 'Spicy Marinara'}]}] },
              ]},
              { id: 'cat2', name: 'Main Courses', items: [
                { id: 'item201', name: 'Grilled Salmon', description: 'With asparagus and hollandaise sauce.', price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', customizationOptions: commonCustomizations },
                { id: 'item202', name: 'Filet Mignon', description: '8oz prime cut, served with potato gratin.', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1600891964091-bab69b547603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80', customizationOptions: commonCustomizations },
                { id: 'item203', name: 'Risotto ai Funghi', description: 'Creamy mushroom risotto with parmesan.', price: 22.00, imageUrl: 'https://images.unsplash.com/photo-1598866774053-6b73d0993e08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
              ]},
              { id: 'cat3', name: 'Desserts', items: [
                { id: 'item301', name: 'Chocolate Lava Cake', description: 'Warm molten chocolate cake with vanilla ice cream.', price: 10.00, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                { id: 'item302', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert.', price: 9.50, imageUrl: 'https://images.unsplash.com/photo-1571877275904-8d3403577899?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
              ]},
              { id: 'cat4', name: 'Drinks', items: [
                { id: 'item401', name: 'Fresh Lemonade', description: 'House-made, refreshing.', price: 4.00, imageUrl: 'https://images.unsplash.com/photo-1575596511433-d7572a5d5021?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                { id: 'item402', name: 'Sparkling Water', description: 'Perrier or San Pellegrino.', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1607685652808-04ad2f0f151a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
              ]},
            ]
          }
        },
        // Add more mock restaurants if needed for testing different IDs
      };
      resolve(mockData[id] || mockData["1"]); // Default to "1" if ID not found
    }, 1000);
  });
};


const RestaurantMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('RestaurantMenuPage loaded');
    if (restaurantId) {
      setIsLoading(true);
      setError(null);
      fetchRestaurantDetails(restaurantId)
        .then(data => {
          setRestaurant(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch restaurant details:", err);
          setError("Failed to load restaurant information.");
          setIsLoading(false);
        });
    } else {
      setError("No restaurant ID provided.");
      setIsLoading(false);
    }
  }, [restaurantId]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <ScrollArea className="flex-1 bg-gray-50">
          <main className="container mx-auto py-8 px-4">
            {/* Skeleton for Hero Section */}
            <Card className="mb-8 overflow-hidden shadow-lg">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <Skeleton className="h-full w-full" />
              </AspectRatio>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
            {/* Skeleton for Tabs */}
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-64 w-full" />
          </main>
        </ScrollArea>
        <AppFooter />
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="container mx-auto py-8 px-4 flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md text-center p-6">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button asChild className="mt-4">
                <Link to="/restaurant-listing">Back to Restaurants</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (!restaurant) {
    // Should be covered by error state, but as a fallback
    return (
       <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="container mx-auto py-8 px-4 flex-1 flex items-center justify-center">
             <p>Restaurant not found.</p>
        </main>
        <AppFooter />
      </div>
    );
  }
  
  const defaultTab = restaurant.menu.categories.length > 0 ? restaurant.menu.categories[0].id : "";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <AppHeader />
      <ScrollArea className="flex-1">
        <main className="container mx-auto py-6 md:py-10 px-2 sm:px-4">
          {/* Restaurant Hero and Info Section */}
          <Card className="mb-6 md:mb-8 overflow-hidden shadow-lg dark:bg-slate-800">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img
                src={restaurant.heroImageUrl}
                alt={`Hero image for ${restaurant.name}`}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-background shadow-md">
                    <AvatarImage src={restaurant.logoUrl} alt={`${restaurant.name} logo`} />
                    <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{restaurant.name}</h1>
                    <p className="text-sm text-muted-foreground dark:text-slate-400">{restaurant.cuisine}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <Badge variant="default" className="text-sm px-2 py-1 bg-amber-400 text-amber-900 hover:bg-amber-500">
                        <Star className="h-3.5 w-3.5 mr-1" /> {restaurant.rating.toFixed(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground dark:text-slate-400">({restaurant.reviewsCount} reviews)</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{restaurant.description}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <ClockIcon className="h-4 w-4 mr-2 text-primary" />
                  <span>{restaurant.openingHours}</span>
                </div>
              </div>
              {restaurant.detailedInfo && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Info className="mr-2 h-4 w-4" /> View More Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{restaurant.name} - Details</DialogTitle>
                      <DialogDescription>
                        More information about {restaurant.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3 text-sm">
                      {restaurant.detailedInfo.phoneNumber && <p><strong>Phone:</strong> {restaurant.detailedInfo.phoneNumber}</p>}
                      {restaurant.detailedInfo.website && <p><strong>Website:</strong> <a href={restaurant.detailedInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{restaurant.detailedInfo.website}</a></p>}
                      {restaurant.detailedInfo.fullOpeningHours && (
                        <div>
                          <strong>Full Hours:</strong>
                          <ul className="list-disc list-inside ml-4">
                            {Object.entries(restaurant.detailedInfo.fullOpeningHours).map(([day, hours]) => (
                              <li key={day}><strong>{day}:</strong> {hours}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {restaurant.detailedInfo.amenities && restaurant.detailedInfo.amenities.length > 0 && (
                        <div>
                          <strong>Amenities:</strong>
                          <ul className="list-disc list-inside ml-4">
                            {restaurant.detailedInfo.amenities.map(amenity => <li key={amenity}>{amenity}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {/* Menu Section with Tabs */}
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:w-auto lg:justify-start mb-4 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
              {restaurant.menu.categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {restaurant.menu.categories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {category.items.map(item => (
                    <MenuItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      customizationOptions={item.customizationOptions}
                    />
                  ))}
                   {category.items.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground py-8">
                        No items in this category yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
            {restaurant.menu.categories.length === 0 && (
                <Card className="mt-6">
                    <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                        <ThumbsUp className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-muted-foreground">Menu Coming Soon!</h3>
                        <p className="text-muted-foreground">This restaurant is working on their menu. Check back later!</p>
                    </CardContent>
                </Card>
            )}
        </main>
      </ScrollArea>
      <AppFooter />
    </div>
  );
};

export default RestaurantMenuPage;