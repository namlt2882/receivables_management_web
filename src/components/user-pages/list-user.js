/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import UserList from './user-list-component';
import UserItem from './user-item';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { available1 } from '../common/loading-page'
import Component from '../common/component';
import { UserService } from '../../services/user-service';
import { UserAction } from '../../actions/user-action';

import './user.scss';
import { Last } from 'react-bootstrap/PageItem';

class ListUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterVal: ""
        };
    }

    // lifecycle này được gọi sau khi component render lần đầu tiên
    componentDidMount() {
        document.title = 'User management';
        UserService.getCollectors().then(res => {
            this.props.fetchAllUsers(res.data);
            this.incrementLoading();
        });
        available1();
    }

    onDelete = (id) => {
        this.props.onDeleteUser(id);
    }

    onClick = (sortBy, sortValue) => {
        this.props.onSortTable({
            by: sortBy,
            value: sortValue
        });
    }
    render() {
        var { filterVal } = this.state;
        var { users } = this.props;
        return (
            <div style={{
                width: "100%"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="hungdtq-header">
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>User management</h1>
                            </div>
                            <div className="d-inline-block hungdtq-headerbtn-container">
                                <div className="btn btn-rcm-primary rcm-btn">
                                    <Link to="/users/add"> <i class="fas fa-plus"></i></Link>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                    <div className="hungdtq-Wrapper">
                        <div className="hungdtq-Container">
                            <div className="tableSearchBox">
                                <input
                                    type="text"
                                    className="rcm-form-control"
                                    placeholder="Search by name..."
                                    onChange={e => this.setState({ filterVal: e.target.value })}
                                    value={filterVal}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <UserList>
                            {users
                                .filter(function (user) {
                                    if (filterVal) {
                                        return (user.LastName + ' ' + user.FirstName)
                                            .toLowerCase()
                                            .includes(filterVal
                                                .toLowerCase()
                                                .trim())
                                           
                                    } else {
                                        return user;
                                    }
                                })
                                .map((user, index) =>
                                    <UserItem
                                        key={index}
                                        user={user}
                                        index={index}
                                        onDelete={this.onDelete}
                                    />)}
                        </UserList>
                    </div>
                </div>
            </div>
        );
    }

    showUsers(users) {
        var result = null;
        if (users.length > 0) {
            result = users.map((user, index) => {
                return (
                    <UserItem
                        key={index}
                        user={user}
                        index={index}
                        onDelete={this.onDelete}
                    />
                );
            });
        }
        return result;
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllUsers: (users) => {
            dispatch(UserAction.setUsers(users));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUser);
