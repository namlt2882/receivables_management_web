import * as Types from './../constants/ActionTypes';

var initialState = {
    name: '',
    status: -1
};

const filterTable = (state = initialState, action) => {
    switch (action.type) {
        case Types.FILTER_TABLE:
            action.filter.status = parseInt(action.filter.status);
            return action.filter;
        default:
            return state;
    }
};

export default filterTable;