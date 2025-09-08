import React, { useState, useEffect } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSui, useEventOperations } from "../hooks/useSui";
import { mintTicketTransaction, formatAddress } from "../utils/suiHelpers";
import { PACKAGE_ID } from "../constants";

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

const EventCard: React.FC<{
  event: Event;
  onMintTicket: (event: Event) => Promise<void>;
  loading: boolean;
}> = ({ event, onMintTicket, loading }) => {
  const isSoldOut = event.ticketsSold >= event.maxTickets;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {event.image && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      <h3 className="font-semibold text-gray-900 mb-2">{event.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {event.description}
      </p>
      <div className="space-y-1 text-sm text-gray-500 mb-4">
        <p>📅 {event.date}</p>
        <p>📍 {event.location}</p>
        <p>
          Tickets: {event.ticketsSold}/{event.maxTickets}
        </p>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${(event.ticketsSold / event.maxTickets) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round((event.ticketsSold / event.maxTickets) * 100)}% sold
        </p>
      </div>

      <button
        onClick={() => onMintTicket(event)}
        disabled={isSoldOut || loading}
        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          isSoldOut
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : loading
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Minting..." : isSoldOut ? "Sold Out" : "Mint Ticket"}
      </button>
    </div>
  );
};

const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">
          🎫 Ticket #{ticket.seatNumber}
        </h4>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Valid
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-gray-600">
          <span className="font-medium">Owner:</span>
          <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {formatAddress(ticket.owner)}
          </span>
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Seat:</span> {ticket.seatNumber}
        </p>
      </div>
    </div>
  );
};

const EventList: React.FC<{
  events: Event[];
  onMintTicket: (event: Event) => Promise<void>;
  loading: boolean;
}> = ({ events, onMintTicket, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Available Events
        </h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Available Events
      </h3>
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500">No events available</p>
          <p className="text-sm text-gray-400 mt-2">
            Check back later for new events
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onMintTicket={onMintTicket}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MyTickets: React.FC<{ tickets: Ticket[]; loading: boolean }> = ({
  tickets,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">My Tickets</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">My Tickets</h3>
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <p className="text-gray-500">No tickets found</p>
          <p className="text-sm text-gray-400 mt-2">
            Your purchased tickets will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export const BuyerPanel: React.FC = () => {
  const { account } = useSui();
  const { fetchAllEvents, fetchUserTickets } = useEventOperations();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();

  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      loadData();
    }
  }, [account]);

  const loadData = async () => {
    if (!account) return;

    setLoading(true);
    try {
      const [eventsData, ticketsData] = await Promise.all([
        fetchAllEvents(),
        fetchUserTickets(account.address),
      ]);
      setEvents(eventsData);
      setTickets(ticketsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleMintTicket = async (event: Event) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (event.ticketsSold >= event.maxTickets) {
      setError("Event is sold out");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const seatNumber = Math.floor(Math.random() * 1000) + 1; 
      const txb = mintTicketTransaction(event.id, seatNumber);

      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });

      if (result.digest) {
        await loadData();
        setError(null);
      } else {
        setError("Failed to mint ticket");
      }
    } catch (err: any) {
      setError("Failed to mint ticket: " + (err.message || "Unknown error"));
      console.error("Error minting ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-500">
          Please connect your wallet to view events and purchase tickets
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      

      <div className="flex justify-end">
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <EventList
        events={events}
        onMintTicket={handleMintTicket}
        loading={loading}
      />

      <MyTickets tickets={tickets} loading={loading} />
    </div>
  );
};
