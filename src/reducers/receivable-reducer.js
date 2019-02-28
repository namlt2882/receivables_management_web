import * as Types from '../actions/action-type';

export class Receivable {
    Id = null;
    Name = "New Receivable";
    ClosedDay = null;
    PayableDay = null;
    PrepaidAmount = 0;
    DebAmount = 0;
    CustomerId = null;
    LocationId = null;
}

export const receivableList = (state = [], { type, list }) => {
    switch (type) {
        case Types.FETCH_RECEIVABLE_LIST:
            state = list;
            return state;
        case Types.SET_RECEIVABLE_LIST:
            state = list;
            return state;
        default: return state;
    }
}
