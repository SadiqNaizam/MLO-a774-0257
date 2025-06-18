import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number; // e.g. 4.5
  deliveryTimeEstimate: string; // e.g. "20-30 min"
  isInitiallyFavorite?: boolean;
  onToggleFavorite?: (id: string, newFavoriteStatus: boolean) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTimeEstimate,
  isInitiallyFavorite = false,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);

  useEffect(() => {
    console.log(`RestaurantCard loaded for: ${name} (id: ${id})`);
  }, [name, id]);

  useEffect(() => {
    setIsFavorite(isInitiallyFavorite);
  }, [isInitiallyFavorite]);

  const handleToggleFavorite = (event: React.MouseEvent) => {
    // Prevent Link navigation if the button is somehow part of it, and stop propagation
    event.preventDefault(); 
    event.stopPropagation(); 
    
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    if (onToggleFavorite) {
      onToggleFavorite(id, newFavoriteStatus);
    }
    // console.log(`Toggled favorite for restaurant ${id} to ${newFavoriteStatus}`);
  };

  return (
    <Card className="w-full overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group relative rounded-lg">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 bg-white/80 hover:bg-white rounded-full p-0 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center"
        onClick={handleToggleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={18} // Adjusted size for smaller button
          className={`transition-all duration-200 ease-in-out ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500 hover:scale-110'
          }`}
        />
      </Button>

      <Link 
        to={`/restaurant-menu?restaurantId=${id}`} 
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        aria-label={`View menu for ${name}`}
      >
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || `https://via.placeholder.com/400x225.png?text=${encodeURIComponent(name)}`}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
            />
          </AspectRatio>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 space-y-2">
          <h3 className="text-base sm:text-lg font-semibold truncate group-hover:text-primary transition-colors" title={name}>
            {name}
          </h3>
          
          {cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {cuisineTypes.slice(0, 2).map((cuisine) => ( // Show max 2-3 cuisines for brevity
                <Badge key={cuisine} variant="secondary" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 font-normal">
                  {cuisine}
                </Badge>
              ))}
              {cuisineTypes.length > 2 && (
                 <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 font-normal">
                  +{cuisineTypes.length - 2} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-1">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 mr-1" fill="currentColor" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              <span>{deliveryTimeEstimate}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default RestaurantCard;