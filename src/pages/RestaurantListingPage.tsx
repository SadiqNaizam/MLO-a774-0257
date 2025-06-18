import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Shadcn/UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card'; // Used for filter section background

// Custom Components
import RestaurantCard from '@/components/RestaurantCard'; // Assuming this path is correct as per project structure

// Lucide Icons
import { Filter, Search, ShoppingCart, UserCircle, Home, Utensils } from 'lucide-react';

// Types for restaurant data
interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTimeEstimate: string; // e.g. "20-30 min"
}

const ITEMS_PER_PAGE = 8; // Number of restaurants per page

// Placeholder Sample Data
const sampleRestaurantsData: Restaurant[] = [
  {
    id: '1',
    name: 'Italiano Delight',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.5,
    deliveryTimeEstimate: '25-35 min',
  },
  {
    id: '2',
    name: 'Sushi Central',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.8,
    deliveryTimeEstimate: '30-40 min',
  },
  {
    id: '3',
    name: 'Burger Barn',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['American', 'Burgers', 'Fries'],
    rating: 4.2,
    deliveryTimeEstimate: '20-30 min',
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    imageUrl: 'https://images.unsplash.com/photo-1565299715199-866c917206bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Mexican', 'Tacos', 'Burritos'],
    rating: 4.6,
    deliveryTimeEstimate: '20-30 min',
  },
  {
    id: '5',
    name: 'Curry House',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Indian', 'Curry', 'Spicy'],
    rating: 4.7,
    deliveryTimeEstimate: '35-45 min',
  },
  {
    id: '6',
    name: 'Vegan Vibes',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Vegan', 'Healthy', 'Salads'],
    rating: 4.4,
    deliveryTimeEstimate: '25-35 min',
  },
  {
    id: '7',
    name: 'Seafood Shack',
    imageUrl: 'https://images.unsplash.com/photo-1574969901107-d4153c978094?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Seafood', 'Fish', 'Coastal'],
    rating: 4.3,
    deliveryTimeEstimate: '30-40 min',
  },
  {
    id: '8',
    name: 'Breakfast Nook',
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Breakfast', 'Brunch', 'Coffee'],
    rating: 4.9,
    deliveryTimeEstimate: '15-25 min',
  },
  {
    id: '9',
    name: 'Desert Delights',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Desserts', 'Cakes', 'Ice Cream'],
    rating: 4.7,
    deliveryTimeEstimate: '15-20 min',
  },
  {
    id: '10',
    name: 'Pizza Planet',
    imageUrl: 'https://images.unsplash.com/photo-1593504049359-69a9902a9299?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60',
    cuisineTypes: ['Pizza', 'Italian', 'Fast Food'],
    rating: 4.1,
    deliveryTimeEstimate: '25-35 min',
  },
];

// Placeholder for AppHeader (as described in thought process)
const AppHeaderPlaceholder: React.FC = () => (
  <header className="bg-white shadow-sm p-4 sticky top-0 z-50 border-b">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-primary flex items-center">
        <Utensils className="h-7 w-7 mr-2" /> FoodApp
      </Link>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">New York, NY</span>
        <Link to="/cart">
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </Link>
        <Link to="/user-profile">
          <Button variant="ghost" size="icon" aria-label="User Profile">
            <UserCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </Link>
      </div>
    </div>
  </header>
);

// Placeholder for AppFooter (as described in thought process)
const AppFooterPlaceholder: React.FC = () => (
  <footer className="bg-gray-50 border-t p-6 mt-auto">
    <div className="container mx-auto text-center">
      <div className="flex justify-center space-x-6 mb-4">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center text-sm">
          <Home className="h-5 w-5 mb-1" /> Home
        </Link>
        <Link to="/restaurant-listing" className="text-primary hover:text-primary/80 transition-colors flex flex-col items-center text-sm font-medium">
          <Search className="h-5 w-5 mb-1" /> Restaurants
        </Link>
        <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center text-sm">
          <ShoppingCart className="h-5 w-5 mb-1" /> Cart
        </Link>
        <Link to="/user-profile" className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center text-sm">
          <UserCircle className="h-5 w-5 mb-1" /> Profile
        </Link>
      </div>
      <p className="text-xs text-gray-500">
        &copy; {new Date().getFullYear()} FoodApp Inc. All rights reserved.
      </p>
    </div>
  </footer>
);


const RestaurantListingPage: React.FC = () => {
  useEffect(() => {
    console.log('RestaurantListingPage loaded');
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rating'); // 'rating', 'deliveryTime', 'name'
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<Set<string>>(new Set(['2', '5'])); // Pre-favorite some

  const handleToggleFavorite = (id: string, newFavoriteStatus: boolean) => {
    setFavoriteRestaurantIds(prevIds => {
      const newSet = new Set(prevIds);
      if (newFavoriteStatus) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
    // In a real app, you might show a toast notification here
    // toast(`${newFavoriteStatus ? 'Added to' : 'Removed from'} favorites!`);
  };
  
  const filteredRestaurants = useMemo(() => {
    return sampleRestaurantsData.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineTypes.some(cuisine => cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const sortedRestaurants = useMemo(() => {
    let tempSorted = [...filteredRestaurants];
    if (sortOption === 'rating') {
      tempSorted.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'deliveryTime') {
      // Simplified: assumes "X-Y min" format, sorts by the first number
      tempSorted.sort((a, b) => 
        parseInt(a.deliveryTimeEstimate.split('-')[0]) - parseInt(b.deliveryTimeEstimate.split('-')[0])
      );
    } else if (sortOption === 'name') {
      tempSorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return tempSorted;
  }, [filteredRestaurants, sortOption]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedRestaurants, currentPage]);

  const totalPages = Math.ceil(sortedRestaurants.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0,0); // Scroll to top on page change
    }
  };
  
  // Function to render pagination items with ellipsis logic
  const renderPaginationItems = () => {
    const items = [];
    const MAX_VISIBLE_PAGES = 5; // Max visible page numbers (e.g., 1 ... 4 5 6 ... 10)
    
    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, MAX_VISIBLE_PAGES - 2);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - MAX_VISIBLE_PAGES + 3);
      }

      if (startPage > 2) {
        items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages - 1) {
        items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeaderPlaceholder />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <section aria-labelledby="restaurant-listing-title" className="mb-6 sm:mb-8">
          <h1 id="restaurant-listing-title" className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            Explore Restaurants
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Find your next favorite meal from our curated list of restaurants.
          </p>
        </section>

        {/* Filters and Sorters */}
        <Card className="p-3 sm:p-4 mb-6 sm:mb-8 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search by name or cuisine..." 
                className="pl-10 w-full" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
              />
            </div>
            <Select value={sortOption} onValueChange={(value) => { setSortOption(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Sort by Rating (High to Low)</SelectItem>
                <SelectItem value="deliveryTime">Sort by Delivery Time (Fastest)</SelectItem>
                <SelectItem value="name">Sort by Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto" onClick={() => alert('Advanced filters functionality to be implemented.')}>
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </Card>
        
        <ScrollArea className="flex-grow" style={{ minHeight: '400px' }}> {/* Ensure ScrollArea has space */}
          {paginatedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id} 
                  {...restaurant} 
                  isInitiallyFavorite={favoriteRestaurantIds.has(restaurant.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p className="text-xl mb-2">No Restaurants Found</p>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </ScrollArea>

        {totalPages > 1 && (
          <Pagination className="mt-8 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} 
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : undefined}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} 
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : undefined}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
      
      <AppFooterPlaceholder />
    </div>
  );
};

export default RestaurantListingPage;