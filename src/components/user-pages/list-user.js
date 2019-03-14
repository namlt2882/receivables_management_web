/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import UserList from './user-list-component';
import UserItem from './user-item';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actFetchUsersRequest, actDeleteUsersRequest, actFilter, actSort } from '../../actions/user-action';
import { available } from '../common/loading-page'
import Component from '../common/component'

class ListUser extends Component {

    // lifecycle này được gọi sau khi component render lần đầu tiên
    componentDidMount() {
        document.title = 'Users';
        available(resolve => setTimeout(resolve, 400));
        this.props.fetchAllUsers();
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
        var { users, filterTable, sortTable } = this.props;

        // filter on table
        if (filterTable.name) {
            users = users.filter((user) => {
                return user.username.toLowerCase().indexOf(filterTable.name.toLowerCase()) !== -1
            });
        }
        users = users.filter((user) => {
            if (filterTable.status === -1) {
                return user;
            } else {
                return user.status === (filterTable.status === 1 ? true : false);
            }
        });

        // sort table
        if (sortTable.by === 'username') {
            users.sort((a, b) => {
                if (a.username > b.username) return sortTable.value;
                else if (a.username < b.username) return -sortTable.value;
                else return 0;
            });
        } else {
            users.sort((a, b) => {
                if (a.status > b.status) return -sortTable.value;
                else if (a.status < b.status) return sortTable.value;
                else return 0;
            });
        }

        return (
            <div style={{
                width: "100%"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="hungdtq-header">
                        <h1>User management</h1>
                    </div>
                    <div className="hungdtq-Wrapper">
                        <div className="hungdtq-Container">
                            <div className="hungdtq-headerbtn-container">
                                <div className="btn btn-success">
                                    <Link to="/user/add"> Add New User</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <UserList>
                            {/* props nay goi la props chilren */}
                            {this.showUsers(users)}

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
        filterTable: state.filterTable,
        sortTable: state.sortTable
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllUsers: () => {
            dispatch(actFetchUsersRequest());
        },
        onDeleteUser: (id) => {
            dispatch(actDeleteUsersRequest(id));
        },
        onFilterTable: (filter) => {
            dispatch(actFilter(filter));
        },
        onSortTable: (sort) => {
            dispatch(actSort(sort));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUser);
