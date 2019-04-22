import {gateConstants} from '../_constants';
import {gateService} from '../_services';
import {alertActions} from './';

export const gateActions = {
    auth,
};

function auth(gate, facevectors) {
    return dispatch => {
        dispatch(request(gate));

        gateService.auth(gate, facevectors)
            .then(
                bookedFlight => {
                    dispatch(success(bookedFlight));
                    dispatch(alertActions.success('Biometrics recognized successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(booking) {
        return {type: gateConstants.REGISTER_REQUEST, booking}
    }

    function success(booking) {
        return {type: gateConstants.REGISTER_SUCCESS, booking}
    }

    function failure(error) {
        return {type: gateConstants.REGISTER_FAILURE, error}
    }
}
