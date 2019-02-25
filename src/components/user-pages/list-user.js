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
            <div>
                {/* <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 mgb-15">
                        <div className="input-group">
                            <input
                                name="keyword"
                                type="text"
                                className="form-control"
                                placeholder="Enter keyword ..."
                            />
                            <span className="input-group-btn">
                                <button
                                    type="button"
                                    className="btn btn-info"
                                >
                                    <span className="fa fa-search mr-5"></span>Tìm kiếm
                                </button>
                            </span>
                        </div>
                </div> */}
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <Link to="/user/add"> Add New Account</Link>

                    <div className="dropdown flr">
                        <button
                            className="btn btn-primary dropdown-toggle mb-15"
                            type="button"
                            id="dropdownMenu1"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="true"
                        >
                            <span className="fas fa-filter mr-5"></span> Sort
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li onClick={() => this.onClick('username', 1)}>
                                <a
                                    role="button"
                                    className={(sortTable.by === 'username' && sortTable.value === 1)
                                        ? 'sort_selected fas fa-check-circle' : ''}>
                                    <span className="fas fa-sort-alpha-down pl-5"> A-Z</span>
                                </a>
                            </li>
                            <li onClick={() => this.onClick('username', -1)}>
                                <a
                                    role="button"
                                    className={(sortTable.by === 'username' && sortTable.value === -1)
                                        ? 'sort_selected fas fa-check-circle' : ''}>
                                    <span className="fas fa-sort-alpha-up pl-5"> Z-A</span>
                                </a>
                            </li>
                            <li role="separator" className="divider"></li>
                            <li onClick={() => this.onClick('status', 1)}>
                                <a
                                    role="button"
                                    className={(sortTable.by === 'status' && sortTable.value === 1)
                                        ? 'sort_selected fas fa-check-circle' : ''}>
                                    <span className="pl-5">Unban</span>
                                </a>
                            </li>
                            <li onClick={() => this.onClick('status', -1)}>
                                <a
                                    role="button"
                                    className={(sortTable.by === 'status' && sortTable.value === -1)
                                        ? 'sort_selected fas fa-check-circle' : ''}>
                                    <span className="pl-5">Ban</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <UserList>
                        {/* props nay goi la props chilren */}
                        {this.showUsers(users)}
                    </UserList>
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
