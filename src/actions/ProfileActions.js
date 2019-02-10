import * as Types from '../constants/ActionTypes';
import callApi from '../utils/APICaller';

export const fetchProfilesRequest = () => {
    return async (dispatch) => {
        const res = await callApi('profile', 'GET', null);
        dispatch(fetchProfilesAction(res.data));
    };
}
export const fetchProfilesAction = (profiles) => {
    return {
        type : Types.FETCH_PROFILES,
        profiles
    }
}