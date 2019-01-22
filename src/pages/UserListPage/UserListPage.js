import React, { Component } from 'react';
import UserList from './../../components/UserList/UserList';
import UserItem from './../../components/UserItem/UserItem';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actFetchUsersRequest, actDeleteUsersRequest } from './../../actions/index';

class UserListPage extends Component {

    // lifecycle này được gọi sau khi component render lần đầu tiên
    componentDidMount() {
        this.props.fetchAllUsers();
    }

    onDelete = (id) => {
        this.props.onDeleteUser(id);
    }

    render() {
        var { users } = this.props;
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Link to="/user/add" className="btn btn-info mb-15">
                    <span className="fas fa-user-plus mr-5"></span> Thêm Tài Khoản
                </Link>
                <UserList>
                    {/* props nay goi la props chilren */}
                    {this.showUsers(users)}
                </UserList>
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
        users: state.users
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllUsers: () => {
            dispatch(actFetchUsersRequest());
        },
        onDeleteUser: (id) => {
            dispatch(actDeleteUsersRequest(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListPage);
