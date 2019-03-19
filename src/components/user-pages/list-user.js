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

class ListUser extends Component {

    
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
                                    <Link to="/users/add"> <i class="fas fa-plus"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <UserList>
                            {this.showUsers(this.props.users)}
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
