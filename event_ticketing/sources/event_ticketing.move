module event_ticketing::event_ticketing {
    use std::string;

    public struct Event has key {
        id: object::UID,
        name: string::String,
        description: string::String,
        date: string::String,
        location: string::String,
        image: string::String,
        max_tickets: u64,
        tickets_sold: u64,
        organizer: address,
    }

    public struct Ticket has key {
        id: object::UID,
        owner: address,
        seat_number: u64,
    }

    public struct EventCounter has key {
        id: object::UID,
        counter: u64,
    }

    public fun event_counter_init(ctx: &mut tx_context::TxContext): EventCounter {
        EventCounter {
            id: object::new(ctx),
            counter: 0,
        }
    }

    public fun create_event(
        counter: &mut EventCounter,
        name: string::String,
        description: string::String,
        date: string::String,
        location: string::String,
        image: string::String,
        max_tickets: u64,
        ctx: &mut tx_context::TxContext
    ): Event {
        counter.counter = counter.counter + 1;
        Event {
            id: object::new(ctx),
            name,
            description,
            date,
            location,
            image,
            max_tickets,
            tickets_sold: 0,
            organizer: tx_context::sender(ctx),
        }
    }

    public fun create_ticket(
        event: &mut Event,
        seat_number: u64,
        ctx: &mut tx_context::TxContext
    ): Ticket {
        assert!(event.tickets_sold < event.max_tickets, 1);
        event.tickets_sold = event.tickets_sold + 1;

        Ticket {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            seat_number,
        }
    }

    public fun get_event(event: &Event): (string::String, string::String, string::String, string::String, string::String, u64, u64, address) {
        (
            event.name,
            event.description,
            event.date,
            event.location,
            event.image,
            event.max_tickets,
            event.tickets_sold,
            event.organizer
        )
    }

    public fun get_ticket(ticket: &Ticket): (address, u64) {
        (ticket.owner, ticket.seat_number)
    }
}
