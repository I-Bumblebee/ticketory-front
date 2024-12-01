export type VehicleResource = {
  id: number;
  vehicle_number: string;
  type: VehicleTypeEnum;
  total_seats: number;
  seats?: SeatResource[];
};

export type SeatResource = {
  id: number;
  seat_identifier: string;
  class: VehicleSeatClassEnum;
};

export const VEHICLE_TYPE_ENUM = {
  PLANE: 'plane',
  BUS: 'bus',
  TRAIN: 'train',
} as const;

export type VehicleTypeEnum =
  (typeof VEHICLE_TYPE_ENUM)[keyof typeof VEHICLE_TYPE_ENUM];

export const VEHICLE_SEAT_CLASS_ENUM = {
  ECONOMY_CLASS: 'economy',
  PREMIUM_ECONOMY_CLASS: 'premium_economy',
  BUSINESS_CLASS: 'business',
  FIRST_CLASS: 'first_class',
  VIP_CLASS: 'vip',
  SLEEPER_CLASS: 'sleeper',
} as const;

export type VehicleSeatClassEnum =
  (typeof VEHICLE_SEAT_CLASS_ENUM)[keyof typeof VEHICLE_SEAT_CLASS_ENUM];
