/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';
import { UserAction } from '../../actions/user-action';
import { UserService } from '../../services/user-service';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import UserItem from './user-item';
import UserList from './user-list-component';
import './user.scss';

class ListUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            filterVal: ""
        }
    }

    // lifecycle này được gọi sau khi component render lần đầu tiên
    componentDidMount() {
        document.title = 'User management';
        available1();
        UserService.getCollectors().then(res => {
            this.props.fetchAllUsers(res.data);
            this.incrementLoading();
        });
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
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
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
                                <div className="btn btn-rcm-primary rcm-btn" onClick={() => {
                                    this.props.history.push('/users/add');
                                }}>
                                    <a> <i class="fas fa-plus"></i></a>
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
