import { combineReducers } from 'redux';
import users from './users';
import itemEditing from './itemEditing';
import filterTable from './filterTable';
import sortTable from './sortTable';
import profiles from './ProfileReducer'

const appReducers = combineReducers({
    users,
    itemEditing,
    filterTable,
    sortTable,
    profiles
});

export default appReducers;