import { userConstants } from '../_constants';
import { bookConstants } from '../_constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST|bookConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      return {};
    case userConstants.REGISTER_FAILURE:
      return {};
    default:
      return state
  }
}