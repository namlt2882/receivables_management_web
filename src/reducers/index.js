import {combineReducers} from 'redux';
import users from './users';
import itemEditing from './itemEditing';
const appReducers = combineReducers ({
    users,
    itemEditing
});

export default appReducers;