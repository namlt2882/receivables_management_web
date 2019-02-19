import { combineReducers } from 'redux';
import users from './users';
import itemEditing from './itemEditing';
import filterTable from './filterTable';
import sortTable from './sortTable';

import profiles from './ProfileReducer'
import { process, processStatus } from './ProcessReducer'
import {messages} from './MessageReducer';


const appReducers = combineReducers({
    users,
    itemEditing,
    filterTable,
    sortTable,
    profiles,
    process,
    processStatus,
    messages
});

export default appReducers;