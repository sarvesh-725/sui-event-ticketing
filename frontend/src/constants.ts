//after publishing your Move package
//run: sui client publish --gas-budget 1000000000
//replace below the Package ID from the output
export const PACKAGE_ID =
  "0xed9a884d90b8662b93242176da6e9f590de22b7791d231f04d6a5d42d4aedc90";

export const MODULE_NAMES = {
  EVENT_TICKETING: "event_ticketing",
} as const;

export const OBJECT_TYPES = {
  EVENT: `${PACKAGE_ID}::${MODULE_NAMES.EVENT_TICKETING}::Event`,
  TICKET: `${PACKAGE_ID}::${MODULE_NAMES.EVENT_TICKETING}::Ticket`,
  EVENT_COUNTER: `${PACKAGE_ID}::${MODULE_NAMES.EVENT_TICKETING}::EventCounter`,
} as const;

export const FUNCTION_NAMES = {
  CREATE_EVENT: "create_event",
  CREATE_TICKET: "create_ticket",
  EVENT_COUNTER_INIT: "event_counter_init",
} as const;
