module event_ticketing::event_ticketing_tests {
    use event_ticketing::event_ticketing;
    use std::string;

    #[test]
    public fun test_event_creation_and_ticket_minting(ctx: &mut tx_context::TxContext) {
        let mut counter = event_ticketing::event_counter_init(ctx);

        let mut event = event_ticketing::create_event(
            &mut counter,
            string::utf8(b"Event 1"),
            string::utf8(b"Sample Description"),
            string::utf8(b"07-09-2025"),
            string::utf8(b"Jaipur"),
            string::utf8(b"https://cdn.prod.website-files.com/644228ffea57b5eb125a12fa/67162c1f36214ab1f0f7964a_bU8vRbUeM9UgQdkA4u2snz1hU9jbZaVcAsCroBdshfU.png"),
            100,
            ctx
        );

        let ticket = event_ticketing::create_ticket(&mut event, 1, ctx);

        let (_name, _desc, _date, _location, _image, _max, tickets_sold, _organizer) = event_ticketing::get_event(&event);
        assert!(tickets_sold == 1, 100);

        let (owner, seat_number) = event_ticketing::get_ticket(&ticket);
        assert!(owner == tx_context::sender(ctx), 101);
        assert!(seat_number == 1, 102);
    }
}
