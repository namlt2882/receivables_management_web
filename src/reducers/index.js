import { combineReducers } from 'redux';
import users from './users';
import itemEditing from './itemEditing';
import filterTable from './filterTable';
import sortTable from './sortTable';
import {messages} from './MessageReducer';
import profiles from './ProfileReducer';
import { process } from './ProcessReducer';

const appReducers = combineReducers({
    users,
    itemEditing,
    filterTable,
    sortTable,
    profiles,
    process,
    messages
});

export default appReducers;