import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Custom Components
import CuisineChip from '@/components/CuisineChip';
import RestaurantCard from '@/components/RestaurantCard';

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Lucide Icons
import { MapPin, User, ShoppingCart, Search, ListFilter, Star, ChevronRight, Utensils, Smile, Percent, ChevronLeft } from 'lucide-react';

// Placeholder data
const promotionItems = [
  { id: 'promo1', title: '50% Off Weekend Special!', description: 'On all Pizza orders over $20', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80', link: '/restaurant-listing?promo=weekend50', Icon: Percent },
  { id: 'promo2', title: 'Free Delivery Bonanza', description: 'No delivery charges on orders above $15', imageUrl: 'https://images.unsplash.com/photo-1580959375944-abd75991f982?auto=format&fit=crop&w=1200&q=80', link: '/restaurant-listing?promo=freedelivery', Icon: Utensils },
  { id: 'promo3', title: 'New User? Get $10 Off!', description: 'Your first order comes with a tasty discount', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80', link: '/restaurant-listing?promo=newuser10', Icon: Smile },
];

const cuisines = ['Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'Thai', 'Vegan', 'Burgers', 'Pizza', 'Sushi', 'Desserts'];

const featuredRestaurantsData = [
  { id: 'r1', name: 'The Pizza Place Deluxe', imageUrl: 'https://images.unsplash.com/photo-1593504049358-74330755d055?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Italian', 'Pizza'], rating: 4.5, deliveryTimeEstimate: '25-35 min', isInitiallyFavorite: true },
  { id: 'r2', name: 'Dragon Wok Express', imageUrl: 'https://images.unsplash.com/photo-1585850604105-f685b29b030a?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Chinese', 'Asian'], rating: 4.2, deliveryTimeEstimate: '30-40 min' },
  { id: 'r3', name: 'Taco Fiesta Central', imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Mexican', 'Tex-Mex'], rating: 4.7, deliveryTimeEstimate: '20-30 min', isInitiallyFavorite: false },
  { id: 'r4', name: 'Royal Curry House', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Indian', 'Curry'], rating: 4.6, deliveryTimeEstimate: '35-45 min' },
];

const nearbyRestaurantsData = [
  { id: 'r5', name: 'Green Leaf Vegan Cafe', imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17021?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Vegan', 'Salads', 'Healthy'], rating: 4.8, deliveryTimeEstimate: '15-25 min' },
  { id: 'r6', name: 'Burger Barn & Grille', imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Burgers', 'American', 'Fries'], rating: 4.3, deliveryTimeEstimate: '20-30 min', isInitiallyFavorite: true },
  { id: 'r7', name: 'Ocean Sushi Express', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Japanese', 'Sushi'], rating: 4.9, deliveryTimeEstimate: '30-40 min' },
  { id: 'r8', name: 'Nonna\'s Pasta Bella', imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', cuisineTypes: ['Italian', 'Pasta', 'Classic'], rating: 4.4, deliveryTimeEstimate: '25-35 min' },
];


const HomePage: React.FC = () => {
  console.log('HomePage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleToggleFavorite = (id: string, newStatus: boolean) => {
    // In a real app, this would update backend/state management
    console.log(`Toggled favorite for restaurant ${id} to ${newStatus}`);
    // Example: Update local state if managing favorites here (not done for brevity)
  };

  const handleCuisineChipClick = (cuisineName: string) => {
    setActiveCuisine(cuisineName);
    navigate(`/restaurant-listing?cuisine=${encodeURIComponent(cuisineName.toLowerCase())}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurant-listing?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  useEffect(() => {
    // Potentially fetch initial data or set up listeners
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* AppHeader Section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary dark:text-sky-400 flex items-center">
            <Utensils className="h-7 w-7 mr-2" />
            FoodFleet
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center text-sm text-muted-foreground dark:text-gray-400">
              <MapPin className="inline-block h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
              <span>New York, NY</span> {/* Placeholder Location */}
            </div>
            <Link to="/user-profile">
              <Button variant="ghost" size="icon" aria-label="User Profile">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {/* Placeholder for cart item count */}
                <span className="absolute -top-1 -right-1 bg-primary dark:bg-sky-500 text-primary-foreground dark:text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Prominent Search Bar */}
          <section aria-labelledby="search-restaurants-heading" className="mb-8 sm:mb-10 text-center">
            <h1 id="search-restaurants-heading" className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Discover delicious food
            </h1>
            <p className="text-muted-foreground dark:text-gray-400 mb-6 max-w-xl mx-auto">
              Explore thousands of local restaurants and dishes, delivered right to your door.
            </p>
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <Input
                type="search"
                placeholder="Search restaurants, cuisines, or specific dishes..."
                className="w-full p-3 sm:p-4 pl-10 text-base sm:text-lg rounded-lg shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary dark:focus:ring-sky-500 focus:border-primary dark:focus:border-sky-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search for restaurants or food"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
              <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm h-auto hidden sm:flex" size="sm">Search</Button>
            </form>
          </section>

          {/* Promotions Carousel */}
          <section aria-labelledby="promotions-heading" className="mb-8 sm:mb-12">
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full -mx-2 sm:mx-0" // Negative margin for edge-to-edge feel on small screens
            >
              <CarouselContent className="py-1">
                {promotionItems.map((promo) => (
                  <CarouselItem key={promo.id} className="px-2 md:basis-1/2 lg:basis-1/3">
                    <Link to={promo.link} className="block group">
                      <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
                        <AspectRatio ratio={16 / 9}>
                          <img src={promo.imageUrl} alt={promo.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                        </AspectRatio>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary dark:group-hover:text-sky-400 transition-colors flex items-center">
                            {promo.Icon && <promo.Icon className="h-5 w-5 mr-2 text-primary dark:text-sky-400" />}
                            {promo.title}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">{promo.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 disabled:opacity-50 hidden sm:flex" />
              <CarouselNext className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 disabled:opacity-50 hidden sm:flex" />
            </Carousel>
          </section>

          {/* Cuisine Chips Section */}
          <section aria-labelledby="cuisine-categories-heading" className="mb-8 sm:mb-12">
            <h2 id="cuisine-categories-heading" className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <ListFilter className="h-6 w-6 mr-2 text-primary dark:text-sky-400" />
              Explore Cuisines
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {cuisines.map((cuisine) => (
                <CuisineChip
                  key={cuisine}
                  cuisineName={cuisine}
                  onClick={() => handleCuisineChipClick(cuisine)}
                  isActive={activeCuisine === cuisine}
                  className="text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                />
              ))}
            </div>
          </section>

          {/* Featured Restaurants Section */}
          <section aria-labelledby="featured-restaurants-heading" className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 id="featured-restaurants-heading" className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                <Star className="h-6 w-6 mr-2 text-yellow-400 fill-yellow-400" />
                Featured Restaurants
              </h2>
              <Link to="/restaurant-listing?filter=featured">
                <Button variant="link" className="text-primary dark:text-sky-400 dark:hover:text-sky-300 px-0 sm:px-2">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
              {featuredRestaurantsData.map(restaurant => (
                <RestaurantCard key={restaurant.id} {...restaurant} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
          </section>
          
          {/* Nearby Restaurants Section */}
          <section aria-labelledby="nearby-restaurants-heading">
            <div className="flex justify-between items-center mb-4">
              <h2 id="nearby-restaurants-heading" className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-red-500" />
                Restaurants Near You
              </h2>
              <Link to="/restaurant-listing?sort=distance">
                <Button variant="link" className="text-primary dark:text-sky-400 dark:hover:text-sky-300 px-0 sm:px-2">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
              {nearbyRestaurantsData.map(restaurant => (
                <RestaurantCard key={restaurant.id} {...restaurant} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
          </section>

        </main>
      </ScrollArea>

      {/* AppFooter Section */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-4">
            <Link to="/" className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-sky-400 transition-colors">Home</Link>
            <Link to="/restaurant-listing" className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-sky-400 transition-colors">All Restaurants</Link>
            <Link to="/user-profile" className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-sky-400 transition-colors">My Profile</Link>
            <Link to="/user-profile#order-history" className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-sky-400 transition-colors">Order History</Link>
             {/* Assuming terms and privacy pages might exist */}
            <Link to="/terms" className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-sky-400 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-sky-400 transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-xs text-muted-foreground dark:text-gray-500">&copy; {new Date().getFullYear()} FoodFleet Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;