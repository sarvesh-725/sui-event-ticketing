import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  PACKAGE_ID,
  OBJECT_TYPES,
  FUNCTION_NAMES,
  MODULE_NAMES,
} from "../constants";

export interface EventData {
  name: string;
  description: string;
  date: string;
  location: string;
  image: string;
  maxTickets: number;
}

export interface TicketData {
  eventId: string;
  seatNumber: number;
}

export const createEventTransaction = (
  eventData: EventData,
  eventCounterId: string
): Transaction => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAMES.EVENT_TICKETING}::${FUNCTION_NAMES.CREATE_EVENT}`,
    arguments: [
      txb.object(eventCounterId),
      txb.pure.string(eventData.name),
      txb.pure.string(eventData.description),
      txb.pure.string(eventData.date),
      txb.pure.string(eventData.location),
      txb.pure.string(eventData.image),
      txb.pure.u64(eventData.maxTickets),
    ],
  });

  return txb;
};

export const mintTicketTransaction = (
  eventId: string,
  seatNumber: number
): Transaction => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAMES.EVENT_TICKETING}::${FUNCTION_NAMES.CREATE_TICKET}`,
    arguments: [txb.object(eventId), txb.pure.u64(seatNumber)],
  });

  return txb;
};

export const initEventCounterTransaction = (): Transaction => {
  const txb = new Transaction();

  txb.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAMES.EVENT_TICKETING}::${FUNCTION_NAMES.EVENT_COUNTER_INIT}`,
  });

  return txb;
};

export const formatAddress = (address: string, length: number = 8): string => {
  if (!address) return "";
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const validateEventData = (eventData: EventData): string[] => {
  const errors: string[] = [];

  if (!eventData.name?.trim()) {
    errors.push("Event name is required");
  }

  if (!eventData.description?.trim()) {
    errors.push("Event description is required");
  }

  if (!eventData.date?.trim()) {
    errors.push("Event date is required");
  }

  if (!eventData.location?.trim()) {
    errors.push("Event location is required");
  }

  if (!eventData.maxTickets || eventData.maxTickets <= 0) {
    errors.push("Maximum tickets must be greater than 0");
  }

  return errors;
};
