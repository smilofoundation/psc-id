import {combineReducers} from 'redux';

import {authentication} from './authentication.reducer';
import {registration} from './registration.reducer';
import {users} from './users.reducer';
import {alert} from './alert.reducer';
import {bookings} from './book.reducer';
import {gate} from './gate.reducer';

const rootReducer = combineReducers({
    authentication,
    registration,
    users,
    bookings,
    alert,
    gate
});

export default rootReducer;