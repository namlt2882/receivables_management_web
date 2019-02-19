import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import UserListPage from './pages/UserListPage/UserListPage';
import UserActionPage from './pages/UserActionPage/UserActionPage';
import EditProfile from './pages/Profile/EditProfile';
import ProfileList from './pages/Profile/ProfileList';
import AddProfile from './pages/Profile/AddProfile';
import MessageListPage from './pages/MessageFormPage/MessageListPage';
import MessageActionPage from './pages/MessageFormPage/MessageActionPage';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <HomePage />
    },
    {
        path: '/user-list',
        exact: false,
        main: () => <UserListPage />
    },
    {
        path: '/user/add',
        exact: false,
        main: ({ history }) => <UserActionPage history={history} />
    },
    {
        path: '/user/:id/edit',
        exact: false,
        main: ({ match, history }) => <UserActionPage match={match} history={history} /> //Đối tượng match dùng để lấy cái id để edit
    },
    {
        path: '/profile',
        exact: true,
        main: () => <ProfileList />
    },
    {
        path: '/profile/add',
        exact: true,
        main: ({ match, history }) => <AddProfile match={match} history={history}/>
    },
    {
        path: '/profile/:id',
        exact: true,
        main: ({ match, history }) => <EditProfile match={match} history={history} />
    },
    {
        path: '/profile/:id/edit',
        exact: false,
        main: ({ match, history }) => <EditProfile match={match} history={history} />
    },
    {
        path: '/message-list',
        exact: false,
        main: () => <MessageListPage />
    },
    {
        path: '/message/add',
        exact: false,
        main: ({ history }) => <MessageActionPage history={history} />
    },
    {
        path: '',
        exact: false,
        main: () => <NotFoundPage />
    }
];

export default routes;