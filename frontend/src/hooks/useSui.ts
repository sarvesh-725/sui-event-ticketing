import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { suiClient } from '../networkConfig';
import { PACKAGE_ID, OBJECT_TYPES, FUNCTION_NAMES, MODULE_NAMES } from '../constants';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  image: string;
  maxTickets: number;
  ticketsSold: number;
  organizer: string;
}

interface Ticket {
  id: string;
  owner: string;
  seatNumber: number;
}

export const useSui = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();

  return {
    client: client || suiClient,
    account,
    isConnected: !!account,
    address: account?.address,
  };
};

export const useEventOperations = () => {
  const { client, account } = useSui();

  const fetchEvents = async () => {
    if (!client) return [];
    
    try {
      const objects = await client.getOwnedObjects({
        owner: account?.address || '',
        filter: {
          StructType: OBJECT_TYPES.EVENT,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data.map((obj) => {
        const content = obj.data?.content;
        if (content && 'fields' in content && obj.data?.objectId) {
          const fields = content.fields as any;
          return {
            id: obj.data.objectId,
            name: fields.name,
            description: fields.description,
            date: fields.date,
            location: fields.location,
            image: fields.image,
            maxTickets: Number(fields.max_tickets),
            ticketsSold: Number(fields.tickets_sold),
            organizer: fields.organizer,
          };
        }
        return null;
      }).filter((event): event is Event => event !== null);
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  const fetchUserTickets = async (userAddress: string) => {
    if (!client) return [];
    
    try {
      const objects = await client.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: OBJECT_TYPES.TICKET,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data.map((obj) => {
        const content = obj.data?.content;
        if (content && 'fields' in content && obj.data?.objectId) {
          const fields = content.fields as any;
          return {
            id: obj.data.objectId,
            owner: String(fields.owner),
            seatNumber: Number(fields.seat_number),
          };
        }
        return null;
      }).filter((ticket): ticket is Ticket => ticket !== null);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return [];
    }
  };

  const fetchAllEvents = async () => {
    if (!client) return [];

    try {
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::${MODULE_NAMES.EVENT_TICKETING}::EventCreated`,
        },
        order: 'descending',
      });

      const eventPromises = events.data.map(async (event) => {
        const eventData = event.parsedJson as any;
        const eventId = eventData.event_id;

        try {
          const eventObject = await client.getObject({
            id: eventId,
            options: {
              showContent: true,
            },
          });

          const content = eventObject.data?.content;
          if (content && 'fields' in content && eventObject.data?.objectId) {
            const fields = content.fields as any;
            return {
              id: eventObject.data.objectId,
              name: fields.name,
              description: fields.description,
              date: fields.date,
              location: fields.location,
              image: fields.image,
              maxTickets: Number(fields.max_tickets),
              ticketsSold: Number(fields.tickets_sold),
              organizer: fields.organizer,
            };
          }
        } catch (error) {
          console.error('Error fetching event object:', eventId, error);
        }
        return null;
      });

      const eventsData = await Promise.all(eventPromises);
      return eventsData.filter((event): event is Event => event !== null);
    } catch (error) {
      console.error('Error fetching all events:', error);
      return [];
    }
  };

  return {
    fetchEvents,
    fetchUserTickets,
    fetchAllEvents,
  };
};

export const fetchOwnedObjects = async (client: any, owner: string) => {
  if (!client) return [];
  
  try {
    const objects = await client.getOwnedObjects({
      owner,
      options: {
        showContent: true,
        showType: true,
      },
    });

    return objects.data;
  } catch (error) {
    console.error('Error fetching owned objects:', error);
    return [];
  }
};
