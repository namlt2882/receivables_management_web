import React from 'react';
import Dashboard from './components/dashboard/dashboard';
import NotFoundPage from './components/common/not-found';
import ListUser from './components/user-pages/list-user';
import UserActionPage from './components/user-pages/user-action';
import EditProfile from './components/profile-pages/edit-profile';
import ProfileList from './components/profile-pages/list-profile';
import AddProfile from './components/profile-pages/add-profile';
import ListMessage from './components/message-form-pages/list-message';
import MessageActionPage from './components/message-form-pages/message-action';
import ImportReceivable from './components/receivable-pages/import-receivable'
import ReceivableDetail from './components/receivable-pages/receivable-detail/receivable-detail'
import ReceivableList from './components/receivable-pages/list-receivable'

const routes = [
    {
        path: '/',
        exact: true,
        main: ({ match, history }) => <Dashboard history={history}/>
    },
    {
        path: '/user-list',
        exact: true,
        main: ({ match, history }) => <ListUser history={history}/>
    },
    {
        path: '/user/add',
        exact: true,
        main: ({ history }) => <UserActionPage history={history} />
    },
    {
        path: '/user/:id/edit',
        exact: true,
        main: ({ match, history }) => <UserActionPage match={match} history={history} /> //Đối tượng match dùng để lấy cái id để edit
    },
    {
        path: '/profile',
        exact: true,
        main: ({ match, history }) => <ProfileList history={history}/>
    },
    {
        path: '/profile/add',
        exact: true,
        main: ({ match, history }) => <AddProfile match={match} history={history} />
    },
    {
        path: '/profile/:id/view',
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
        main: ({ match, history }) => <ListMessage history={history}/>
    },
    {
        path: '/message-list/add',
        exact: true,
        main: ({ match, history }) => <MessageActionPage history={history} />
    },
    {
        path: '/receivable',
        exact: true,
        main: ({ match, history }) => <ReceivableList match={match} history={history} />
    },
    {
        path: '/receivable/add',
        exact: true,
        main: ({ match, history }) => <ImportReceivable match={match} history={history} />
    },
    {
        path: '/receivable/:id/view',
        exact: true,
        main: ({ match, history }) => <ReceivableDetail match={match} history={history} />
    },
    {
        path: '/receivable/:id/edit',
        exact: true,
        main: ({ match, history }) => <ReceivableDetail match={match} history={history} />
    },
    {
        path: '/not-found',
        exact: true,
        main: ({ match, history }) => <NotFoundPage match={match} history={history} />
    }
];

export default routes;