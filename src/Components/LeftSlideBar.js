import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RouterURL from './RouterURL';
import CreateNewUser from './CreateNewUser';
class LeftSlideBar extends Component {
  render() {
    return (
     <aside className="main-sidebar">
        <section className="sidebar">
            <div className="user-panel">
                <div className="pull-left image">
                    <img src="img/user2-160x160.jpg" className="img-circle" alt="User Image" />
                </div>
                <div className="pull-left info">
                    <p>HauDoan</p>
                    <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                </div>
            </div>
            <ul className="sidebar-menu" data-widget="tree">
                <li className="header">Main Function</li>
                <li className="treeview">
                    <Link   to="/"
                            >
                        <i className="fas fa-home mr-5"></i>
                        <span>Home</span>         
                    </Link>
                </li> 
                <li className="treeview" >
                    <Link   to="/create-new-user"
                            >
                        <i className="fas fa-user-plus mr-5"></i>
                        <span>Create New User</span>         
                    </Link>
                </li>           
            </ul>
        </section>
    </aside> 
     );
  }
}

export default LeftSlideBar;
