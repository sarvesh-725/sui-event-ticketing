module event_ticketing::event_ticketing {
    use std::string;
    use sui::transfer;
    use sui::event;
    use sui::object;

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

    public struct EventCreated has copy, drop {
        event_id: address,
        name: string::String,
        description: string::String,
        date: string::String,
        location: string::String,
        image: string::String,
        max_tickets: u64,
        tickets_sold: u64,
        organizer: address,
    }

    public entry fun event_counter_init(ctx: &mut tx_context::TxContext) {
        let counter = EventCounter {
            id: object::new(ctx),
            counter: 0,
        };
        
        transfer::transfer(counter, tx_context::sender(ctx));
    }

    public entry fun create_event(
        counter: &mut EventCounter,
        name: string::String,
        description: string::String,
        date: string::String,
        location: string::String,
        image: string::String,
        max_tickets: u64,
        ctx: &mut tx_context::TxContext
    ) {
        counter.counter = counter.counter + 1;
        let event = Event {
            id: object::new(ctx),
            name,
            description,
            date,
            location,
            image,
            max_tickets,
            tickets_sold: 0,
            organizer: tx_context::sender(ctx),
        };
        
        event::emit(EventCreated {
            event_id: object::id_to_address(&object::id(&event)),
            name: event.name,
            description: event.description,
            date: event.date,
            location: event.location,
            image: event.image,
            max_tickets: event.max_tickets,
            tickets_sold: event.tickets_sold,
            organizer: event.organizer,
        });

        transfer::transfer(event, tx_context::sender(ctx));
    }

    public entry fun create_ticket(
        event: &mut Event,
        seat_number: u64,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(event.tickets_sold < event.max_tickets, 1);
        event.tickets_sold = event.tickets_sold + 1;

        let ticket = Ticket {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            seat_number,
        };
        transfer::transfer(ticket, tx_context::sender(ctx));
    }

    
}
