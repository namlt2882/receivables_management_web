import * as Types from './action-type';
import { callApi } from '../utils/api-caller';

// Gọi lên API để lấy dữ liệu về lưu vào store
export const actFetchMessageRequest = () => {
    return (dispatch) => {
        return callApi('messages', 'GET', null).then(res => {
            dispatch(actFetchMessages(res.data))         
        });
    };
}
export const actFetchMessages = (messages) => {
    return {
        type : Types.FETCH_MESSAGES,
        messages
    }
}

// thêm message
export const actAddMessageRequest = (message) => {
    return (dispatch) => {
        return callApi('messages', 'POST', message).then(res => {
            dispatch(actAddMessage(res.data))
        });
    };
}
export const actAddMessage = (message) => {
    return {
        type : Types.ADD_MESSAGE,
        message
    }
}

//Search message
export const searchMessage = (keyword) => {
    return {
        type : Types.SEARCH_MESSAGE,
        keyword
    }
}

