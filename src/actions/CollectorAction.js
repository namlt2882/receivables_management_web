import * as Types from './../constants/ActionTypes'
import { fetch } from './../utils/APICaller'

export const CollectorAction = {
    fetchCollectors: (collectors) => {
        return {
            type: Types.FETCH_COLLECTORS,
            collectors
        }
    }
}

export const CollectorRequest = {
    fetchCollectors: () => {
        return async (dispatch) => {
            const res = await fetch('User/GetCollector', 'GET', null);
            dispatch(CollectorAction.fetchCollectors(res.data));
        }
    }
}
