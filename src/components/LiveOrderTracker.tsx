import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CookingPot, Bike, CheckCircle2, MapPin, Clock, Phone } from 'lucide-react';

interface LiveOrderTrackerProps {
  orderId: string;
  /** The ID of the current active stage. */
  currentStageId: 'placed' | 'preparing' | 'out-for-delivery' | 'delivered';
  /** Optional estimated delivery time, e.g., "6:30 PM" or "25-35 minutes". */
  estimatedDeliveryTime?: string;
  /** Optional. If provided, a "Contact Rider" button may appear at certain stages. */
  onContactRider?: () => void;
}

type Stage = {
  id: 'placed' | 'preparing' | 'out-for-delivery' | 'delivered';
  name: string;
  icon: React.ElementType;
  description: string;
};

const STAGES: Stage[] = [
  { id: 'placed', name: 'Order Placed', icon: Package, description: 'We have received your order and are confirming it with the restaurant.' },
  { id: 'preparing', name: 'Preparing Food', icon: CookingPot, description: 'The restaurant is preparing your meal.' },
  { id: 'out-for-delivery', name: 'Out for Delivery', icon: Bike, description: 'Your rider is on the way with your order.' },
  { id: 'delivered', name: 'Delivered', icon: CheckCircle2, description: 'Your order has been delivered. Enjoy your meal!' },
];

const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  orderId,
  currentStageId,
  estimatedDeliveryTime,
  onContactRider,
}) => {
  console.log('LiveOrderTracker loaded for order:', orderId);

  const currentStageIndex = STAGES.findIndex(stage => stage.id === currentStageId);
  const currentStageData = STAGES[currentStageIndex];

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl md:text-2xl">Order Tracking</CardTitle>
            <CardDescription>Order ID: <span className="font-medium text-primary">{orderId}</span></CardDescription>
          </div>
          {estimatedDeliveryTime && (
            <div className="flex items-center text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
              <Clock className="h-4 w-4 mr-2 text-sky-600" />
              <span>Est. Delivery: <span className="font-semibold text-foreground">{estimatedDeliveryTime}</span></span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
        {/* Stages Progress Stepper */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-start justify-between"> {/* Changed to items-start for multi-line text */}
            {STAGES.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isPending = index > currentStageIndex;

              return (
                <React.Fragment key={stage.id}>
                  <div className="flex flex-col items-center text-center flex-1 min-w-0 px-1"> {/* Added min-w-0 and px-1 for text wrapping */}
                    <div
                      className={`
                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2
                        transition-all duration-300 relative
                        ${isCompleted ? 'bg-green-500 border-green-600 text-white' : ''}
                        ${isCurrent ? 'bg-blue-500 border-blue-600 text-white scale-110 ring-4 ring-blue-300 ring-offset-2 ring-offset-background' : ''}
                        ${isPending ? 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500' : ''}
                      `}
                    >
                      <stage.icon className="w-5 h-5 md:w-6 md:h-6" />
                      {isCurrent && <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>}
                    </div>
                    <p
                      className={`
                        mt-2 text-xs md:text-sm font-medium line-clamp-2
                        ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}
                        ${isCurrent ? 'text-blue-600 dark:text-blue-400' : ''}
                        ${isPending ? 'text-gray-500 dark:text-gray-400' : ''}
                      `}
                    >
                      {stage.name}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < STAGES.length - 1 && (
                    <div className={`
                      flex-1 h-1 mt-5 md:mt-6 mx-1 md:mx-2 rounded
                      transition-colors duration-500
                      ${(isCompleted && (index + 1 <= currentStageIndex || currentStageId === 'delivered')) || currentStageId === 'delivered' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                    `}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Current Status Details */}
        {currentStageData && (
          <div className="text-center p-4 border rounded-lg bg-background shadow">
            <p className="text-base md:text-lg font-semibold text-blue-600 dark:text-blue-400">
              Current Status: {currentStageData.name}
            </p>
            <p className="text-muted-foreground text-sm md:text-base mt-1">{currentStageData.description}</p>
            {currentStageData.id === 'out-for-delivery' && onContactRider && (
              <Button variant="outline" size="sm" className="mt-3" onClick={onContactRider}>
                <Phone className="mr-2 h-4 w-4" /> Contact Rider
              </Button>
            )}
            {currentStageData.id === 'delivered' && (
                <Button variant="default" size="sm" className="mt-3 bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Order Complete
                </Button>
            )}
          </div>
        )}

        {/* Map Placeholder */}
        <div className="p-4 border rounded-lg text-center bg-muted/30">
          <MapPin className="h-10 w-10 md:h-12 md:h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">Live Courier Tracking</p>
          <p className="text-sm text-muted-foreground">
            {currentStageId === 'out-for-delivery' 
              ? "Your rider's location will be updated here."
              : "Map view will be available once the order is out for delivery."
            }
          </p>
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 aspect-[16/9] w-full rounded-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 italic">Map Area (Coming Soon)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveOrderTracker;