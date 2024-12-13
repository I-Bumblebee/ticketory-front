'use client';
import React, { useState, useEffect } from 'react';
import { LocationResource } from '@/types/location';
import { RouteResource } from '@/types/route';
import { TripResource } from '@/types/trip';
import { getLocationRoutes, getLocations } from '@/services/api/location';
import { getRouteTrips } from '@/services/api/route';
import Dropdown from '@/components/common/dropdown';
import { AlertTriangle } from 'lucide-react';
import Datepicker from '@/components/common/datepicker';
import TripCard from '@/components/trip/trip-card';
import { QueryOptions } from '@/types/common';
import dayjs from 'dayjs';

const findRouteByTrip = (
  routes: RouteResource[],
  trip: TripResource
): RouteResource => {
  return routes.find((route) => route.id === trip.route_id) as RouteResource;
};

const ErrorAlert = ({ message }: { message: string }) => (
  <div
    className="
      bg-red-50 border border-red-300 text-red-700
      px-4 py-3 rounded-lg shadow-md flex items-center
      gap-3 animate-pulse transition-all duration-300
    "
    role="alert"
  >
    <AlertTriangle className="w-6 h-6 text-red-500" />
    <div>
      <span className="font-bold">Error:</span> {message}
    </div>
  </div>
);

export default function TripSearchForm() {
  const [locations, setLocations] = useState<LocationResource[]>([]);
  const [routes, setRoutes] = useState<RouteResource[]>([]);
  const [trips, setTrips] = useState<TripResource[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [loading, setLoading] = useState({
    locations: false,
    routes: false,
    trips: false,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading((prev) => ({ ...prev, locations: true }));
        const response = await getLocations();
        setLocations(response.data.data);
      } catch {
        setError('Failed to fetch locations.');
      } finally {
        setLoading((prev) => ({ ...prev, locations: false }));
      }
    };

    void fetchLocations();
  }, []);

  const handleLocationChange = async (locationId: number) => {
    setError(null);
    try {
      setSelectedLocation(locationId);
      setRoutes([]);
      setTrips([]);
      setSelectedRoute(null);

      setLoading((prev) => ({ ...prev, routes: true }));
      const response = await getLocationRoutes(locationId);
      setRoutes(response.data.data);
    } catch {
      setError('Failed to fetch routes.');
    } finally {
      setLoading((prev) => ({ ...prev, routes: false }));
    }
  };

  const fetchRouteTrips = async (
    routeId: number,
    queryOptions?: QueryOptions
  ) => {
    console.log(routeId, queryOptions);
    setError(null);
    try {
      setSelectedRoute(routeId);
      setLoading((prev) => ({ ...prev, trips: true }));
      const response = await getRouteTrips(routeId, queryOptions);
      setTrips(response.data.data);
    } catch {
      setError('Failed to fetch trips.');
    } finally {
      setLoading((prev) => ({ ...prev, trips: false }));
    }
  };

  const handleDateChange = async (newDate?: Date) => {
    setError(null);
    setSelectedDate(newDate);
    await fetchRouteTrips(selectedRoute as number, {
      filters: [
        {
          name: 'date',
	  value: newDate ? dayjs(newDate).format('YYYY-MM-DD') : '',
        },
      ],
    });
  };

  return (
    <div
      className="
        max-w-7xl mx-auto p-4 md:p-8 md:px-0 mt-10
      "
    >
      <h1
        className="
          text-4xl font-extrabold text-transparent
          bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600
          text-center mb-8 tracking-tight
        "
      >
        Plan Your Journey
      </h1>

      {error && <ErrorAlert message={error} />}

      <div className="flex flex-col gap-6">
        <div className="flex-col md:flex-row flex">
          <Dropdown
            value={selectedLocation}
            options={locations.map((loc) => ({
              name: `${loc.name}`,
              value: loc.id,
            }))}
            onChange={handleLocationChange}
            disabled={loading.locations}
            loading={loading.locations}
            placeholder="Select a location"
            className="!rounded-b-none md:!rounded-r-none md:!rounded-bl-lg"
          />

          <Dropdown
            value={selectedRoute}
            options={routes.map((route) => ({
              name: route.end_location?.name || 'Unnamed Route',
              value: route.id,
            }))}
            onChange={fetchRouteTrips}
            loading={loading.routes}
            placeholder="Select a destination"
            className="!rounded-none"
          />

          <Datepicker
            value={selectedDate}
            onChange={handleDateChange}
            className="!rounded-t-none md:!rounded-l-none md:!rounded-tr-lg"
          />
        </div>
        {selectedRoute && (
          <div>
            <h2
              className="
                text-2xl font-semibold text-gray-800
                mb-6 border-b pb-3 border-gray-200
              "
            >
              Available Trips
            </h2>
            {loading.trips ? (
              <div className="flex justify-center items-center space-x-3 text-blue-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p>Loading trips...</p>
              </div>
            ) : trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    route={findRouteByTrip(routes, trip)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="
                  text-center py-8 bg-gray-50 rounded-lg
                  text-gray-500 flex flex-col items-center
                "
              >
                <AlertTriangle className="w-12 h-12 mb-4 text-gray-400" />
                <p>No trips available for the selected route.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
