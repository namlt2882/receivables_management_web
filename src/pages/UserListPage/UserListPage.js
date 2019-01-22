import React, { Component } from 'react';
import UserList from './../../components/UserList/UserList';
import UserItem from './../../components/UserItem/UserItem';
import { connect } from 'react-redux';
import callApi from './../../utils/APICaller';
import { Link } from 'react-router-dom';
class UserListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }
    // lifecycle nay dc goi sau khi component render lan dau tien
    componentDidMount() {
        callApi('users', 'GET', null).then(res => {
            this.setState({
                users: res.data
            });
        });
    }

    findIndex = (users, id) => {
        var result = -1;
        users.forEach((user, index) => {
            if (user.id === id) {
                result = index;
            }
        });
        return result;
    }

    onDelete = (id) => {
        var { users } = this.state;
        callApi(`users/${id}`, 'DELETE', null).then(res => {
            if (res.status === 200) { //OK
                var index = this.findIndex(users, id);
                if(index !== -1) {
                    users.splice(index, 1);
                    this.setState({
                        users: users
                    });
                }
            }
           
        });
    }

    

    render() {

        var { users } = this.state;
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <Link to="/user/add" className="btn btn-info mb-15">
                    <span className="fas fa-user-plus mr-5"></span> Add new User
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

export default connect(mapStateToProps, null)(UserListPage);
