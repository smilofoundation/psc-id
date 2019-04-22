const BOOKINGS_KEY = "bookings";

export class BookedFlightsProvider {

    constructor(accountProvider) {
        this.accountProvider = accountProvider;
    }

    setBookedFlight(bookedFlight) {
        this.bookedFlight = bookedFlight;

        this.save();
    }

    markBookedFlightAsCheckedIn() {
        this.bookedFlight.checkedIn = true;

        this.save();
    }

    getBookedFlight() {
        return this.bookedFlight;
    }

    restore() {
        this.setBookedFlight(this.accountProvider.decryptFromStorage(BOOKINGS_KEY));
        return this.bookedFlight;
    }

    save() {
        this.accountProvider.encryptToStorage(BOOKINGS_KEY, this.bookedFlight);
    }
}