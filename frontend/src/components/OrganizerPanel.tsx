import React, { useState, useEffect } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import {
  useSui,
  useEventOperations,
  fetchOwnedObjects,
} from "../hooks/useSui";
import {
  createEventTransaction,
  initEventCounterTransaction,
  validateEventData,
  EventData,
} from "../utils/suiHelpers";
import { PACKAGE_ID, OBJECT_TYPES } from "../constants";

interface EventFormData {
  name: string;
  description: string;
  date: string;
  location: string;
  image: string;
  maxTickets: number;
}

const EventForm: React.FC<{
  onCreateEvent: (eventData: EventData) => Promise<void>;
  loading: boolean;
}> = ({ onCreateEvent, loading }) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    date: "",
    location: "",
    image: "",
    maxTickets: 0,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateEventData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    await onCreateEvent(formData);

    setFormData({
      name: "",
      description: "",
      date: "",
      location: "",
      image: "",
      maxTickets: 0,
    });
  };

  const handleInputChange = (
    field: keyof EventFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Create New Event
      </h3>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Event Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            placeholder="Date (e.g., Dec 25, 2024)"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <textarea
          placeholder="Event Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            placeholder="Max Tickets"
            type="number"
            min="1"
            value={formData.maxTickets || ""}
            onChange={(e) =>
              handleInputChange("maxTickets", parseInt(e.target.value) || 0)
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <input
          placeholder="Image URL (optional)"
          value={formData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

const MyEvents: React.FC<{ events: any[]; loading: boolean }> = ({
  events,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">My Events</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">My Events</h3>
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
          <p className="text-gray-500">No events created yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Create your first event to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{event.name}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {event.description}
              </p>
              <div className="space-y-1 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Date:</span> {event.date}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {event.location}
                </p>
                <p>
                  <span className="font-medium">Tickets:</span>{" "}
                  {event.ticketsSold}/{event.maxTickets}
                </p>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(event.ticketsSold / event.maxTickets) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((event.ticketsSold / event.maxTickets) * 100)}%
                  sold
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const OrganizerPanel: React.FC = () => {
  const { client, account } = useSui();
  const { fetchEvents } = useEventOperations();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();

  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventCounterId, setEventCounterId] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      loadMyEvents();
      loadEventCounter();
    }
  }, [account]);

  const loadMyEvents = async () => {
    if (!account) return;

    setLoading(true);
    try {
      const events = await fetchEvents();
      const userEvents = events.filter(
        (event) => event && event.organizer === account?.address
      );
      setMyEvents(userEvents);
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const loadEventCounter = async () => {
    if (!account) return;

    try {
      const ownedObjects = await fetchOwnedObjects(client, account.address);
      const eventCounterObj = ownedObjects.find(
        (obj: any) => obj.data?.type === OBJECT_TYPES.EVENT_COUNTER
      );
      if (eventCounterObj) {
        setEventCounterId(eventCounterObj.data.objectId);
      }
    } catch (err) {
      console.error("Error loading event counter:", err);
    }
  };

  const initializeEventCounter = async (client: any): Promise<string> => {
    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    const txb = initEventCounterTransaction();
    const result = await signAndExecuteTransaction.mutateAsync({
      transaction: txb,
    });

    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 1000;
    let txn;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        txn = await client.getTransactionBlock({
          digest: result.digest,
          options: {
            showEffects: true,
            showObjectChanges: true,
          },
        });
        if (txn) {
          break;
        }
      } catch (error) {
        if (i === MAX_RETRIES - 1) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    if (!txn) {
      throw new Error("Transaction not found after multiple retries.");
    }


    if (txn.effects?.status?.status !== "success") {
      throw new Error("Transaction failed: " + txn.effects?.status?.error);
    }

    const createdObjects =
      txn.objectChanges?.filter(
        (change: any) => change.type === "created"
      ) || [];

    const eventCounter = createdObjects.find(
      (obj: any) => obj.objectType === OBJECT_TYPES.EVENT_COUNTER
    );

    if (eventCounter && eventCounter.objectId) {
      return eventCounter.objectId;
    }

    
    throw new Error(
      "Failed to create event counter - could not find the EventCounter object in the transaction result."
    );
  };

  const handleCreateEvent = async (eventData: EventData) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let counterId = eventCounterId;
      if (!counterId) {
        counterId = await initializeEventCounter(client);
        setEventCounterId(counterId);
      }

      const txb = createEventTransaction(eventData, counterId);

      const result = await signAndExecuteTransaction.mutateAsync({
        transaction: txb,
      });

      if (result.digest) {
        await loadMyEvents();
        setError(null);
      } else {
        setError("Failed to create event");
      }
    } catch (err: any) {
      setError("Failed to create event: " + (err.message || "Unknown error"));
      console.error("Error creating event:", err);
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
          Please connect your wallet to create and manage events
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Display */}
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

      <EventForm onCreateEvent={handleCreateEvent} loading={loading} />

      <MyEvents events={myEvents} loading={loading} />
    </div>
  );
};