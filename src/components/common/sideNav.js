import React, { Component } from 'react';
import SideNav, { Toggle, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Route, withRouter } from 'react-router-dom';
import { NavLink } from 'mdbreact';



class MyNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }

        this.callBack = this.callBack.bind(this);
    }

    callBack(expanded){
        this.props.callBack(expanded);
    }

    render() {
        return (
            <SideNav
                onSelect={(selected) => {
                    if (this.props.location.pathname !== selected) {
                        this.props.history.push(selected);
                    }
                }}
                expanded={this.state.expanded}
                onToggle={(expanded) => {
                    this.setState({ expanded });
                    this.callBack(expanded);
                }}
            >
                <SideNav.Toggle className="sideNav-TogleButton" />
                <div className="sideNav-TogleDiv"></div>
                <SideNav.Nav defaultSelected="/">
                    {menus.map(({ name, to, exact, icon, roles }) => {
                        let role = localStorage.getItem('role');
                        let isAuthenticated = roles.some((r) => r === role);
                        if (!isAuthenticated) {
                            return false;
                        }
                        var active = this.props.match.path == to ? 'choosen-nav-item' : '';
                        return (
                            <NavItem
                                eventKey={to}
                            >
                                <NavIcon>
                                    <FontAwesomeIcon icon={icon} size='lg'
                                        style={{
                                            margin: '0 5 0 5',
                                            opacity: active ? '1' : '0.7',
                                            fontSize: '1.75em',
                                            color: 'rgb(55, 120, 194)'
                                        }} />
                                </NavIcon>
                                <NavText>
                                    {name}
                                </NavText>
                            </NavItem>
                        )
                    }
                    )}
                </SideNav.Nav>
            </SideNav>
        )
    }
}


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
        to: '/users',
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
        to: '/messages',
        exact: false,
        icon: 'comment-alt',
        roles: ['Manager']
    },
    {
        name: 'Customer',
        to: '/customers',
        exact: false,
        icon: 'address-book',
        roles: ['Manager']
    }
];

export default withRouter(MyNav);