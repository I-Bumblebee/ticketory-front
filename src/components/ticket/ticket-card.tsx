import { TicketResource } from '@/types/ticket';
import {
  Briefcase,
  Bus,
  Crown,
  Gem,
  LucideProps,
  MapPin,
  MapPinCheck,
  Moon,
  Plane,
  Train,
  User,
  UserPlus,
} from 'lucide-react';
import { formatMinutes } from '@/plugins/dayjs';
import { VehicleSeatClassEnum } from '@/types/vehicle/emuns';
import React from 'react';
import { Tooltip } from 'react-tooltip';

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

export const getTime = (dateTimeString: string): string => {
  return new Date(dateTimeString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
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

const TicketCard = ({ ticket }: { ticket: TicketResource }) => {
  const trip = ticket.trip!;
  const route = trip.route!;
  const seatClass: VehicleSeatClassEnum = ticket.seat!.class;

  const VehicleIcon = VEHICLE_ICONS[trip.vehicle?.type || 'bus'];

  return (
    <div
      className="
        bg-white rounded-lg shadow-sm p-5
        flex flex-col gap-5 md:flex-row md:justify-between
      "
    >
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
          <p className="text-xl text-[#222222] truncate max-w-80 tracking-wider font-bold inline-flex items-center gap-2">
            {getTime(trip.departure_time)}
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
          <p className="text-xl text-[#222222] truncate max-w-80 tracking-wider font-bold inline-flex items-center gap-2">
            {getTime(trip.arrival_time)}
            <span className="text-[#717171] font-normal text-base">
              {route.end_location?.name}
            </span>
          </p>
        </div>
      </div>
      <hr className="md:hidden" />
      <div className="flex gap-2 justify-between md:flex-col flex-row items-start md:items-end flex-wrap overflow-visible">
        <SeatClassCard
          seatClass={seatClass}
          SeatClassIcon={SEAT_CLASS_DETAILS[seatClass].icon}
          price={ticket.price}
          label={SEAT_CLASS_DETAILS[seatClass].label}
          description={SEAT_CLASS_DETAILS[seatClass].description}
        />
        <div
          className="inline-flex items-center gap-3.5 py-2 px-2.5
            border-indigo-300 border cursor-pointer bg-indigo-100 rounded-lg capitalize text-indigo-600"
        >
          {ticket.status}
        </div>
      </div>
    </div>
  );
};

const SeatClassCard = ({
  seatClass,
  SeatClassIcon,
  price,
  label,
  description,
  onClick,
}: {
  seatClass: VehicleSeatClassEnum;
  SeatClassIcon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  price: number;
  label: string;
  description: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
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
  );
};

export default TicketCard;
