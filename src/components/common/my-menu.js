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
import { AuthService } from '../../services/auth-service';
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
                            <Notification dropdownProfile={this.state.dropdownProfile} />
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
                <Dropdown isOpen={this.props.dropdownProfile} toggle={this.props.toggleProfile}>
                    <DropdownToggle className='transparent-button'>
                        <FontAwesomeIcon icon='user-circle' color='white' size='lg' />
                    </DropdownToggle>
                    <DropdownMenu className='nav-icon-panel row justify-content-center align-self-center'>
                        <div className='col-sm-10' style={{cursor:'default'}}>
                            Hi, <b>{localStorage.getItem('username')}</b><br/>
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
            mouseInNoti: false
        }
        this.openNoti = this.openNoti.bind(this);
        this.closeNoti = this.closeNoti.bind(this);
        this.checkMouseInNoti = this.checkMouseInNoti.bind(this);
        this.checkMouseOutNoti = this.checkMouseOutNoti.bind(this);
    }

    openNoti() {
        this.setState({
            dropdownNoti: true,
            mouseInNoti: true
        });
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
                <Popover placement="bottom" target="popover-noti"
                    isOpen={isOpen}
                    toggle={this.openNoti} onMouseMove={this.checkMouseInNoti}
                    onMouseOut={this.checkMouseOutNoti}>
                    <PopoverHeader>New</PopoverHeader>
                    <PopoverBody>A process is done!</PopoverBody>
                    <PopoverHeader>Previous</PopoverHeader>
                    <PopoverBody>A process is done!</PopoverBody>
                </Popover>
            </div>
        </NavItem>);
    }
}

export default MyMenu;

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
