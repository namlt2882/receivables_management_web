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
        var statusName = user.status ? 'Banned' : 'Active';
        var statusClass = user.status ? 'success' : 'default';
        return (
            <tr>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>Dang Tran Quoc Hung</td>
                    <td>
                        <span className={`label label-${statusClass}`}>
                            {statusName}
                        </span>
                    </td>
                    <td>
                        <button className="hungdtq-btn-cancel btn btn-warning" onClick={() => this.onDelete(user.id)}>Ban</button>
                    </td>
            </tr>
        );
    }
}

export default UserItem;
