import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';

const menus = [
    {
        name: 'Trang chủ',
        to: '/',
        exact: true
    },
    {
        name: 'Quản lý tài khoản',
        to: '/user-list',
        exact: false
    },
    {
        name: 'Profile',
        to: '/profile',
        exact: false
    },
    {
        name: 'Message Form',
        to: '/message-form',
        exact: false
    }
];

const MenuLink = ({label, to, activeOnlyWhenExact }) => {
    return (
        <Route
            path = {to}
            exact = {activeOnlyWhenExact}
            children = {({match}) => {
                var active = match ? 'active' : '';
                return (
                    <li className = {active}>
                        <Link to={to}>
                            {label}
                        </Link>
                    </li>
                );
            }}
        />
    );
};
class Menu extends Component {
    render() {
        return (
            <div className="navbar navbar-default">
                <span className="navbar-brand">RMS</span>
                <ul className="nav navbar-nav">
                    {this.showMenu(menus)}
                </ul>
            </div>
        );
    }

    showMenu = (menus) => {
        var result = null;
        if(menus.length > 0) {
            result = menus.map((menu, index) => {
                return (
                    <MenuLink 
                        key = {index}
                        label = {menu.name}
                        to = {menu.to}
                        activeOnlyWhenExact = {menu.exact}
                    />
                );
            });
        }
        return result;
    }
}

export default Menu;
