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
import ImportReceivable from './pages/Receivable/ImportReceivable'
import ReceivableDetail from './pages/Receivable/ReceivableDetail'
import ReceivableList from './pages/Receivable/ReceivableList'

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
        main: ({ match, history }) => <AddProfile match={match} history={history} />
    },
    {
        path: '/profile/:id',
        exact: true,
        main: ({ match, history }) => <EditProfile match={match} history={history} />
    },
    {
        path: '/profile/:id/edit',
        exact: true,
        main: ({ match, history }) => <EditProfile match={match} history={history} />
    },
    {
        path: '/message-list',
        exact: true,
        main: () => <MessageListPage />
    },
    {
        path: '/message/add',
        exact: true,
        main: ({ history }) => <MessageActionPage history={history} />
    },
    {
        path: '/receivable',
        exact: true,
        main: ({ match, history }) => <ReceivableList />
    },
    {
        path: '/receivable/add',
        exact: true,
        main: ({ match, history }) => <ImportReceivable match={match} history={history} />
    },
    {
        path: '/receivable/:id',
        exact: true,
        main: ({ match, history }) => <ReceivableDetail match={match} history={history} />
    },
    {
        path: '/receivable/:id/edit',
        exact: true,
        main: ({ match, history }) => <ReceivableDetail match={match} history={history} />
    },
    {
        path: '',
        exact: true,
        main: () => <NotFoundPage />
    },

];

export default routes;