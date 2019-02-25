import * as Types from '../actions/action-type';

var initialState = {
    by : 'username',
    value : 1 // 1: tăng, -1 :giảm
};

const sortTable = (state = initialState, action) => {
    switch (action.type) {
        case Types.SORT_TABLE:
            return {
                by : action.sort.by,
                value : action.sort.value
            };
        default:
            return state;
    }
};

export default sortTable;