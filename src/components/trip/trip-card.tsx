import React, { memo } from 'react';
import { TripResource } from '@/types/trip';
import { Bus, Plane, Route, Train } from 'lucide-react';

const VEHICLE_ICONS = {
  plane: Plane,
  bus: Bus,
  train: Train,
};
const TripCard = ({ trip }: { trip: TripResource }) => {
  const VehicleIcon = VEHICLE_ICONS[trip.vehicle?.type || 'bus'];

  return (
    <div
      className="
        bg-white rounded-lg shadow-sm
        transition-all duration-300 ease-in-out
        transform  border border-gray-100
        hover:border-blue-200 cursor-pointer
      "
    >
      <div className="p-6 flex items-start space-x-6">
        <div className="flex flex-col justify-between items-center text-gray-500">
          <VehicleIcon className="w-8 h-8 text-indigo-500" />
          <span className="text-sm font-medium capitalize">
            {trip.vehicle?.type || 'Unknown Transport'}
          </span>
        </div>

        <div className="flex-grow space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm tracking-wider font-semibold">
              {new Date(trip.departure_time).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
            </span>
            <Route className="w-5 h-5 text-red-500" />
            <span className="text-sm tracking-wider opacity-90 font-semibold whitespace-pre-wrap">
              {new Date(trip.arrival_time).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TripCard);
