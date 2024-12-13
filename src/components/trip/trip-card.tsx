import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Bus,
  Plane,
  Train,
  Moon,
  Gem,
  Crown,
  Briefcase,
  UserPlus,
  User,
  MapPin,
  MapPinCheck,
} from 'lucide-react';

import { TripResource } from '@/types/trip';
import { RouteResource } from '@/types/route';
import { VehicleSeatClassEnum } from '@/types/vehicle/emuns';
import { formatMinutes, formatDate, extractTime } from '@/plugins/dayjs';
import { Tooltip } from 'react-tooltip';
import { buyTickets } from '@/services/api/trip';
import { ApiError } from '@/types/common';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export const VEHICLE_ICONS = {
  plane: Plane,
  bus: Bus,
  train: Train,
};

const SEAT_CLASS_DETAILS = {
  economy: {
    icon: User,
    label: 'Economy',
    description: 'Standard comfort',
  },
  premium_economy: {
    icon: UserPlus,
    label: 'Premium Economy',
    description: 'Extra legroom',
  },
  business: {
    icon: Briefcase,
    label: 'Business',
    description: 'Premium amenities',
  },
  first_class: {
    icon: Crown,
    label: 'First Class',
    description: 'Luxury experience',
  },
  vip: {
    icon: Gem,
    label: 'VIP',
    description: 'Ultimate comfort',
  },
  sleeper: {
    icon: Moon,
    label: 'Sleeper',
    description: 'Full comfort for long trips',
  },
};

export const formatSeatPricing = (
  seatPricing: Record<string, number | null>
) => {
  return Object.entries(seatPricing)
    .filter(([, price]) => price !== null)
    .map(([seatClass, price]) => ({
      seatClass,
      SeatClassIcon: SEAT_CLASS_DETAILS[seatClass as VehicleSeatClassEnum].icon,
      price: price!,
      label: SEAT_CLASS_DETAILS[seatClass as VehicleSeatClassEnum].label,
      description:
        SEAT_CLASS_DETAILS[seatClass as VehicleSeatClassEnum].description,
    }));
};

const TripCard = ({
  trip,
  route,
}: {
  trip: TripResource;
  route: RouteResource;
}) => {
  const VehicleIcon = VEHICLE_ICONS[trip.vehicle?.type || 'bus'];
  const formattedSeatPricing = formatSeatPricing(trip.seat_pricing);

  const [isBuyTicketModalOpen, setIsBuyTicketModalOpen] = useState(false);
  const [selectedSeatClass, setSelectedSeatClass] =
    useState<VehicleSeatClassEnum>({} as VehicleSeatClassEnum);

  const closeBuyTicketModal = () => {
    setSelectedSeatClass({} as VehicleSeatClassEnum);
    setIsBuyTicketModalOpen(false);
  };

  const openBuyTicketModal = (seatClass: VehicleSeatClassEnum) => {
    setSelectedSeatClass(seatClass);
    setIsBuyTicketModalOpen(true);
  };

  return (
    <div
      className="
        bg-white rounded-lg shadow-sm p-5
        flex flex-col gap-5 md:flex-row md:justify-between
      "
    >
      <BuyTicketModal
        isOpen={isBuyTicketModalOpen}
        closeModal={closeBuyTicketModal}
        trip={trip}
        route={route}
        seatClass={selectedSeatClass}
      />
      <Tooltip id="tooltip" className="z-10" />
      <div className="inline-flex gap-3">
        <div className="inline-flex flex-col items-center">
          <MapPin className="stroke-gray-500" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-[5px] w-[2px] bg-gray-400"></div>
            ))}
          </div>
          <MapPinCheck className="stroke-gray-500" />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xl text-[#222222] truncate max-w-80 md:max-w-none tracking-wider font-bold inline-flex items-center gap-2">
            {extractTime(trip.departure_time)}
            <span className="text-[#717171] font-normal text-base">
              {route.start_location?.name}
            </span>
          </p>
          <div className="flex gap-1">
            <span className="flex items-center justify-center rounded-xl border text-[#337ab7] text-sm leading-3 px-2.5 py-1.5 border-[#d0e9fb] bg-[#d0e9fb]/50">
              {formatMinutes(trip.trip_duration_minutes)}
            </span>
            <div className="bg-[#ebebeb]/50 items-center inline-flex border border-[#ebebeb] rounded-xl px-2.5 py-1.5 gap-1">
              <div className="">
                <VehicleIcon className="h-5" strokeWidth="0.099rem" />
              </div>
              <div className="border-l border-[#ebebeb] pl-1 text-sm leading-3">
                {trip.vehicle?.vehicle_number}
              </div>
            </div>
          </div>
          <p className="text-xl text-[#222222] truncate max-w-80 md:max-w-none tracking-wider font-bold inline-flex items-center gap-2">
            {extractTime(trip.arrival_time)}
            <span className="text-[#717171] font-normal text-base">
              {route.end_location?.name}
            </span>
          </p>
        </div>
      </div>
      <hr className="md:hidden" />
      <div className="flex gap-2 items-start flex-wrap overflow-visible">
        {formattedSeatPricing.map(
          ({ seatClass, SeatClassIcon, price, label, description }) => (
            <button
              onClick={() =>
                openBuyTicketModal(seatClass as VehicleSeatClassEnum)
              }
              data-tooltip-id="tooltip"
              data-tooltip-content={description}
              key={seatClass}
              className="
        inline-flex items-center gap-3.5 py-2 px-2.5
        transition-all duration-300 ease-in-out transform
        border-gray-100 border hover:border-indigo-500 cursor-pointer bg-gray-100 rounded-lg
      "
            >
              <div className="flex gap-1 align-baseline">
                <SeatClassIcon className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                  {label}
                </span>
              </div>
              <span className="text-gray-600 font-bold">{price}$</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

const BuyTicketModal = ({
  isOpen,
  closeModal,
  trip,
  route,
  seatClass,
}: {
  isOpen: boolean;
  closeModal: () => void;
  trip: TripResource;
  route: RouteResource;
  seatClass: VehicleSeatClassEnum;
}) => {
  const singleTicketPrice: number = useMemo(() => {
    return trip.seat_pricing[seatClass] || 0;
  }, [trip.seat_pricing, seatClass]);

  const [ticketCount, setTicketCount] = useState(1);
  const router = useRouter();
  const { user } = useUser();

  const onBuyTickets = () => {
    buyTickets(trip.id, { seat_class: seatClass, ticket_count: ticketCount })
      .then(() => {
        toast.success('Purchase successful');
        router.push(`/users/${user?.id}/tickets`);
      })
      .catch((error: ApiError) => {
        toast.error(
          error.response?.data.message ||
            'You must sign in before purchasing ticket'
        );
      });
  };

  const totalPrice = useMemo(
    () => ticketCount * singleTicketPrice,
    [ticketCount, singleTicketPrice]
  );
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      hidden={!isOpen}
      onClick={closeModal}
      className="fixed inset-0 bg-black/30 z-50"
    >
      <div className=" flex justify-center h-full">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full md:max-w-md self-end md:self-baseline md:mt-96"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg px-6 py-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-[#222222]">
                  {formatDate(trip.departure_time)}
                </p>
                <p className="text-sm text-[#717171]">
                  {route.start_location!.name} - {route.end_location!.name} ~{' '}
                  {SEAT_CLASS_DETAILS[seatClass]?.label}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <hr />
            {/* Ticket Selection */}
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-[#222222]">
                Tickets
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTicketCount(Math.max(ticketCount - 1, 1))}
                  className="bg-gray-100 border border-gray-300 text-gray-700 font-semibold px-3 py-1 rounded hover:bg-gray-200"
                >
                  -
                </button>
                <span className="text-lg font-semibold text-[#222222]">
                  {ticketCount}
                </span>
                <button
                  onClick={() => setTicketCount(Math.min(ticketCount + 1, 3))}
                  className="bg-gray-100 border border-gray-300 text-gray-700 font-semibold px-3 py-1 rounded hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
            <hr />
            {/* Pricing and Buy */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold text-[#222222]">
                  Total: ${totalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-[#717171]">
                  {ticketCount} x ${singleTicketPrice.toFixed(2)} per ticket
                </span>
              </div>
              <button
                onClick={onBuyTickets}
                className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TripCard);

