import React, { Component } from 'react';
import {
    Collapse, Navbar, NavbarToggler,
    NavbarBrand, Nav, NavItem,
    NavLink, Dropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Popover, PopoverHeader, PopoverBody
} from 'reactstrap';
import { Route, Link } from 'react-router-dom';
import './common.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faBell, faUserCircle, faCreditCard,
    faChartLine, faUsers, faCommentAlt,
    faChalkboardTeacher, faSignOutAlt, faTasks
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AuthService, isLoggedIn } from '../../services/auth-service';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { withRouter } from 'react-router-dom'
import { HOST_NAME } from '../../constants/config';
import * as signalR from '@aspnet/signalr'
import { ReceivableAction } from '../../actions/receivable-action';
import { connect } from 'react-redux';
import { NotificationService } from '../../services/notification-service';
import { ReceivableService } from '../../services/receivable-service';
import { Message } from 'semantic-ui-react';
library.add(faBell, faUserCircle, faCreditCard,
    faChartLine, faUsers, faCommentAlt, faChalkboardTeacher, faSignOutAlt, faTasks);


class MyMenu extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            dropdownProfile: false
        };
        this.toggleProfile = this.toggleProfile.bind(this);
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    toggleProfile() {
        this.setState(prevState => ({
            dropdownProfile: !prevState.dropdownProfile
        }));
    }

    render() {
        return (<div className='navbar-holder'>
            <div className='my-navbar'>
                <Navbar color="light" light expand="md" color='royalblue'>
                    <NavbarBrand><Link to='/'>RCM</Link></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {menus.map(({ name, to, exact, icon, roles }) => {
                                let role = localStorage.getItem('role');
                                let isAuthenticated = roles.some((r) => r === role);
                                if (!isAuthenticated) {
                                    return false;
                                }
                                return (<Route
                                    path={to} exact={exact}
                                    children={({ match }) => {
                                        var active = match ? 'active' : '';
                                        var clazz = active ? 'choosen-nav-item' : '';
                                        return (<NavItem className={clazz}>
                                            <NavLink>
                                                <FontAwesomeIcon icon={icon} color='white' size='md'
                                                    style={{
                                                        margin: '0 5 0 5',
                                                        opacity: active ? '1' : '0.7'
                                                    }} />
                                                <Link to={to}>
                                                    {name}
                                                </Link>
                                            </NavLink>
                                        </NavItem>)
                                    }}
                                />)
                            }
                            )}
                            <ConnectedNotification history={this.props.history} dropdownProfile={this.state.dropdownProfile} />
                            <MyProfile dropdownProfile={this.state.dropdownProfile}
                                toggleProfile={this.toggleProfile} />
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        </div>
        );
    }
}

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (<NavItem className='nav-icon'>
            <div style={{ paddingTop: '2px' }}>
                <Dropdown isOpen={this.props.dropdownProfile} toggle={this.props.toggleProfile}
                    className='my-profile'>
                    <DropdownToggle className='transparent-button'>
                        <FontAwesomeIcon icon='user-circle' color='white' size='lg' />
                    </DropdownToggle>
                    <DropdownMenu className='nav-icon-panel row justify-content-center align-self-center'>
                        <div className='col-sm-10' style={{ cursor: 'default' }}>
                            Hi, <b>{localStorage.getItem('username')}</b><br />
                        </div>
                        <DropdownItem>
                            My profile
                            </DropdownItem>
                        <DropdownItem onClick={() => {
                            AuthService.logout();
                        }}>
                            <FontAwesomeIcon icon='sign-out-alt' color='black' size='sm' />
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </NavItem>);
    }
}

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownNoti: false,
            mouseInNoti: false,
            connection: null,
            isNotificationLoaded: false,
            notifications: []
        }
        this.openNoti = this.openNoti.bind(this);
        this.closeNoti = this.closeNoti.bind(this);
        this.checkMouseInNoti = this.checkMouseInNoti.bind(this);
        this.checkMouseOutNoti = this.checkMouseOutNoti.bind(this);
        this.createNotification = this.createNotification.bind(this);
        this.type11Action = this.type11Action.bind(this);
        this.getAction = this.getAction.bind(this);
    }

    componentDidMount() {
        isLoggedIn(() => {
            const protocol = new signalR.JsonHubProtocol();
            // Singalr
            let connection = new signalR.HubConnectionBuilder()
                .withUrl(`http://202.78.227.91:6868/centerHub?access_token=${localStorage.getItem('access_token')}`)
                .configureLogging(signalR.LogLevel.Information)
                .withHubProtocol(protocol)
                .build();
            connection.on('Notify', (notification) => {
                // this.setState({ isNotificationLoaded: false });
                notification = JSON.parse(notification);
                this.state.notifications.unshift(notification);
                this.setState({ notifications: this.state.notifications })
                this.createNotification('info', notification.Title, notification.Body, this.getAction(notification));
            })
            connection.start({ xdomain: true }).then(() => {
                this.setState({
                    connection: connection
                })
            }).catch(err => {
                console.error(err.toString())
            })
        })
    }

    getAction({ Id, Type, NData, IsSeen }) {
        let action = () => { };
        switch (Type) {
            case 11:
                action = this.type11Action(JSON.parse(NData));
                break;
        }
        return () => {
            action();
            this.setState({ dropdownNoti: false, mouseInNoti: false });
            //send IsSeen = true
            if (!IsSeen) {
                NotificationService.toggleSeen(Id).then(res => {
                    let noti = this.state.notifications.find(n => n.Id === Id);
                    if (noti) {
                        noti.IsSeen = true;
                    }
                })
            }
        }
    }

    type11Action(ids) {
        return () => {
            this.props.setNewIds(ids);
            this.props.setReceivables([]);
            this.props.history.push('/receivable/new-assigned');
            ReceivableService.getAll().then(res => {
                let list = res.data;
                list = list.reduce((acc, r) => {
                    let foundR = ids.find(id => id === r.Id);
                    if (foundR) {
                        acc.push(r);
                    }
                    return acc;
                }, []);
                this.props.setReceivables(list);
            })
        }
    }

    createNotification = (type, title, message, callback) => {
        if (callback === undefined) {
            callback = () => { }
        }
        switch (type) {
            case 'info':
                NotificationManager.info(message, title, 7000, () => {
                    callback();
                });
                break;
            case 'success':
                NotificationManager.success(message, title, 7000, () => {
                    callback();
                });
                break;
            case 'warning':
                NotificationManager.warning(message, title, 7000, () => {
                    callback();
                });
                break;
            case 'error':
                NotificationManager.error(message, title, 7000, () => {
                    callback();
                });
                break;
        }
    };

    openNoti() {
        if (this.state.dropdownNoti) {
            this.setState({ dropdownNoti: false, mouseInNoti: false });
        } else {
            if (!this.state.isNotificationLoaded) {
                NotificationService.getMyNotification().then(res => {
                    let notifications = res.data;
                    this.setState({
                        notifications: notifications,
                        isNotificationLoaded: true
                    })
                })
            }
            this.setState({
                dropdownNoti: true,
                mouseInNoti: true
            });
        }
    }

    closeNoti() {
        this.setState({ dropdownNoti: false });
    }

    checkMouseInNoti() {
        this.setState({ mouseInNoti: true })
    }

    checkMouseOutNoti() {
        this.setState({ mouseInNoti: false })
    }

    render() {
        if (this.props.dropdownProfile) {
            this.state.dropdownNoti = false;
            this.state.mouseInNoti = false;
        }
        let isOpen = !this.props.dropdownProfile && (this.state.dropdownNoti || this.state.mouseInNoti);
        return (<NavItem className='nav-icon'>
            <div>
                <button id="popover-noti" type='button' className='transparent-button' onBlur={this.closeNoti}>
                    <FontAwesomeIcon icon='bell' color='white' size='lg' className='noti-item-icon'
                        style={{ opacity: (isOpen ? '1' : '0.7') }} />
                </button>
                <NotificationContainer />
                <Popover placement="bottom" target="popover-noti"
                    isOpen={isOpen}
                    toggle={this.openNoti} onMouseMove={this.checkMouseInNoti}
                    onMouseOut={this.checkMouseOutNoti}>
                    <PopoverBody>
                        {this.state.notifications.map(n =>
                            <div style={{ marginBottom: '5px' }}>
                                <Message attached size='small' header={n.Title} content={n.Body}
                                    onClick={() => { this.getAction(n)() }}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: n.IsSeen ? 'white' : '#afc6ea'
                                    }} />
                                <span><i></i></span>
                            </div>
                        )}
                    </PopoverBody>
                </Popover>
            </div>
        </NavItem>);
    }
}

const mapStateToProps = state => {
    return {
        newReceiavbleIds: state.newReceiavbleIds
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setNewIds: (ids) => {
            dispatch(ReceivableAction.setNewReceivableIds(ids))
        },
        setReceivables: (list) => {
            dispatch(ReceivableAction.setReceivableList(list));
        }
    }
}

const ConnectedNotification = connect(mapStateToProps, mapDispatchToProps)(Notification)

export default withRouter(MyMenu);

const menus = [
    {
        name: 'Dashboard',
        to: '/',
        exact: true,
        icon: 'chart-line',
        roles: ['Collector', 'Admin', 'Manager']
    },
    {
        name: 'Task',
        to: '/task',
        exact: false,
        icon: 'tasks',
        roles: ['Collector']
    },
    {
        name: 'Receivable',
        to: '/receivable',
        exact: false,
        icon: 'credit-card',
        roles: ['Collector', 'Manager']
    },
    {
        name: 'User',
        to: '/user-list',
        exact: false,
        icon: 'users',
        roles: ['Admin']
    },
    {
        name: 'Profile',
        to: '/profile',
        exact: false,
        icon: 'chalkboard-teacher',
        roles: ['Manager']
    },
    {
        name: 'Message Form',
        to: '/message-list',
        exact: false,
        icon: 'comment-alt',
        roles: ['Manager']
    }
];
