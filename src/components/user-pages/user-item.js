import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class UserItem extends Component {
    onDelete = (id) => {
        if (confirm('Are you sure to delete ?')) { //eslint-disable-line
            this.props.onDelete(id);
        }
    }
    render() {
        var { user, index } = this.props;
        var statusName = user.status ? 'Unban' : 'Ban';
        var statusClass = user.status ? 'success' : 'default';
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>
                    <span className={`label label-${statusClass}`}>
                        {statusName}
                    </span>
                </td>
                <td>
                    <Link to={`/user/${user.id}/edit`}>Update</Link>
                    <button onClick={() => this.onDelete(user.id)}>Delete</button>
                </td>
            </tr>
        );
    }
}

export default UserItem;
