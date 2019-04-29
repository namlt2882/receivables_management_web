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
import ReceivableDetail from './components/receivable-pages/detail/receivable-detail'
import ReceivableList from './components/receivable-pages/list-receivable'
import TodayTask from './components/task-pages/today-task';
import NewAssignedReceivable from './components/receivable-pages/new-assigned-receivable';
import UserList from './components/customer-pages/customer-list';
import CustomerActionPage from './components/customer-pages/customer-action';
import ListUserWithReceivable from './components/user-pages/list-user-receivable';
import ReceivableListByCollector from './components/receivable-pages/list-recevable-by-Collector';

const routes = [
    {
        path: '/',
        exact: true,
        main: ({ match, history }) => <Dashboard history={history} />
    },
    {
        path: '/users',
        exact: true,
        main: ({ match, history }) => <ListUser history={history} />
    },
    {
        path: '/users/add',
        exact: true,
        main: ({ match, history }) => <UserActionPage match={match} history={history} />
    },
    {
        path: '/users/:id/edit',
        exact: true,
        main: ({ match, history }) => <UserActionPage key={match.params.id} match={match} history={history} /> //Đối tượng match dùng để lấy cái id để edit
    },
    {
        path: '/users/:id/view',
        exact: true,
        main: ({ match, history }) => <UserActionPage match={match} history={history} />
    },
    {
        path: '/profile',
        exact: true,
        main: ({ match, history }) => <ProfileList history={history} />
    },
    {
        path: '/profile/add',
        exact: true,
        main: ({ match, history }) => <AddProfile match={match} history={history} />
    },
    {
        path: '/profile/:id/view',
        exact: true,
        main: ({ match, history }) => <EditProfile key={match.params.id} match={match} history={history} />
    },
    {
        path: '/profile/:id/edit',
        exact: true,
        main: ({ match, history }) => <EditProfile match={match} history={history} />
    },
    {
        path: '/messages',
        exact: true,
        main: ({ match, history }) => <ListMessage history={history} />
    },
    {
        path: '/messages/add',
        exact: true,
        main: ({ match, history }) => <MessageActionPage match={match} history={history} />
    },
    {
        path: '/messages/:id/view',
        exact: true,
        main: ({ match, history }) => <MessageActionPage match={match} history={history} />
    },
    {
        path: '/receivable',
        exact: true,
        main: ({ match, history }) => <ReceivableList match={match} history={history} />
    },
    {
        path: '/collectors',
        exact: true,
        main: ({ match, history }) => <ListUserWithReceivable history={history} />
    },
    {
        path: '/collectors/:collectorId/receivable',
        exact: true,
        main: ({ match, history }) => <ReceivableListByCollector match={match} history={history} />
    },
    {
        path: '/receivable/add',
        exact: true,
        main: ({ match, history }) => <ImportReceivable match={match} history={history} />
    },
    {
        path: '/receivable/recent-add',
        exact: true,
        main: ({ match, history }) => <ImportReceivable showRecent={true} match={match} history={history} />
    },
    {
        path: '/receivable/:id/view',
        exact: true,
        main: ({ match, history }) => {
            let currentTime = new Date();
            return <ReceivableDetail key={`${match.params.id}-${currentTime.getMilliseconds()}`}
                match={match} history={history} />
        }
    },
    {
        path: '/task',
        exact: true,
        main: ({ match, history }) => <TodayTask match={match} history={history} />
    },
    {
        path: '/not-found',
        exact: true,
        main: ({ match, history }) => <NotFoundPage match={match} history={history} />
    },
    {
        path: '/customers',
        exact: true,
        main: ({ match, history }) => <UserList history={history} />
    },
    {
        path: '/customers/add',
        exact: true,
        main: ({ match, history }) => <CustomerActionPage match={match} history={history} />
    },
    {
        path: '/customers/:id/view',
        exact: true,
        main: ({ match, history }) => <CustomerActionPage match={match} history={history} />
    }
];

export default routes;