#[test_only]
module event_ticketing::event_ticketing_tests {
    use sui::test_scenario;
    use std::string;
    use event_ticketing::event_ticketing::{Self, Event, Ticket, EventCounter};

    const ORGANIZER: address = @0xABC;
    const BUYER: address = @0xDEF;

    #[test]
    fun test_full_flow() {
        let mut scenario = test_scenario::begin(ORGANIZER);

        // Tx 1: Organizer initializes the counter
        {
            test_scenario::next_tx(&mut scenario, ORGANIZER);
            event_ticketing::event_counter_init(test_scenario::ctx(&mut scenario));
        };

        // Tx 2: Organizer creates an event
        {
            test_scenario::next_tx(&mut scenario, ORGANIZER);
            let mut counter = test_scenario::take_owned<EventCounter>(&mut scenario);
            event_ticketing::create_event(
                &mut counter,
                string::utf8(b"Sui Developer Summit"),
                string::utf8(b"A gathering of Sui builders"),
                string::utf8(b"10-10-2025"),
                string::utf8(b"Paris"),
                string::utf8(b"image_url"),
                100,
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_owned(&mut scenario, counter);
        };

        // Tx 3: Buyer mints a ticket
        {
            test_scenario::next_tx(&mut scenario, BUYER);
            let mut event = test_scenario::take_shared<Event>(&mut scenario);
            event_ticketing::create_ticket(
                &mut event,
                1, // seat number
                test_scenario::ctx(&mut scenario)
            );
            test_scenario::return_shared(&mut scenario, event);
        };

        // === Assertions ===

        // Check ticket state
        let ticket = test_scenario::take_owned<Ticket>(&mut scenario);
        assert!(event_ticketing::owner(&ticket) == BUYER, 0);
        assert!(event_ticketing::seat_number(&ticket) == 1, 1);
        test_scenario::return_owned(&mut scenario, ticket);

        // Check event state
        let event = test_scenario::take_shared<Event>(&mut scenario);
        assert!(event_ticketing::tickets_sold(&event) == 1, 2);
        test_scenario::return_shared(&mut scenario, event);

        test_scenario::end(scenario);
    }
}