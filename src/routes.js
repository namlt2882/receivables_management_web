import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import UserListPage from './pages/UserListPage/UserListPage';
import UserActionPage from './pages/UserActionPage/UserActionPage';
const routes = [
    {
        path : '/',
        exact : true,
        main: () => <HomePage />
    },
    {
        path : '/user-list',
        exact : false,
        main: () => <UserListPage />
    },
    {
        path : '/user/add',
        exact : false,
        main: ({history}) => <UserActionPage history={history}/>
    },
    {
        path : '/user/:id/edit',
        exact : false,
        main: ({match, history}) => <UserActionPage match = {match} history={history}/> //Đối tượng match dùng để lấy cái id để edit
    },
    {
        path : '',
        exact : false,
        main: () => <NotFoundPage />
    }
    
];

export default routes;