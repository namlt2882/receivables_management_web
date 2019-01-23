import {combineReducers} from 'redux';
import users from './users';
import itemEditing from './itemEditing';
import filterTable from './filterTable';
import sortTable from './sortTable';
const appReducers = combineReducers ({
    users,
    itemEditing,
    filterTable,
    sortTable
});

export default appReducers;