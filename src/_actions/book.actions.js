import {bookConstants} from '../_constants';
import {bookService} from '../_services';
import {alertActions} from './';
import {history} from '../_helpers';

export const bookActions = {
    register,
    getAll,
    checkin,
};


function register(booking) {
    return dispatch => {
        dispatch(request(booking));

        bookService.register(booking)
            .then(
                bookedFlight => {
                    dispatch(success(bookedFlight));
                    history.push('/book-ok', {bookedFlight});
                    dispatch(alertActions.success('Booking Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(booking) {
        return {type: bookConstants.REGISTER_REQUEST, booking}
    }

    function success(booking) {
        return {type: bookConstants.REGISTER_SUCCESS, booking}
    }

    function failure(error) {
        return {type: bookConstants.REGISTER_FAILURE, error}
    }
}

function checkin(bookingConfirmed, facevectors) {
    return dispatch => {
        dispatch(request(bookingConfirmed));

        bookService.checkin(bookingConfirmed, facevectors)
            .then(
                bookedFlight => {
                    dispatch(success(bookedFlight));
                    history.push('/checkin-ok', {bookedFlight});
                    dispatch(alertActions.success('Biometrics Registered successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(booking) {
        return {type: bookConstants.REGISTER_REQUEST, booking}
    }

    function success(booking) {
        return {type: bookConstants.REGISTER_SUCCESS, booking}
    }

    function failure(error) {
        return {type: bookConstants.REGISTER_FAILURE, error}
    }
}


function getAll() {
    return dispatch => {
        dispatch(request());

        bookService.getAll()
            .then(
                bookings => dispatch(success(bookings)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() {
        return {type: bookConstants.GETALL_REQUEST}
    }

    function success(bookings) {
        return {type: bookConstants.GETALL_SUCCESS, bookings}
    }

    function failure(error) {
        return {type: bookConstants.GETALL_FAILURE, error}
    }
}
