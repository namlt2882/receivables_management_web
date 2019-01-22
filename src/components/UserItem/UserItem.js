import React, { Component } from 'react';
import {Link} from 'react-router-dom';
class UserItem extends Component {
    onDelete = (id) => {
        if(confirm('Bạn có chắc chắn muôn xóa ?')){ //eslint-disable-line
            this.props.onDelete(id);
        }
    }
    render() {
        var { user, index } = this.props;
        var statusName = user.status ? 'Kịch Hoạt' : 'Ẩn';
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
                    <Link 
                        to={`/user/${user.id}/edit`} 
                        className="btn btn-primary mr-10"
                        >
                        <span className="fas fa-user-edit mr-5"></span>Sửa
                    </Link>
                    <button
                        type="button"
                        className="btn btn-danger mr-10"
                        onClick={() => this.onDelete(user.id)}
                    >
                        <span className="fas fa-user-minus mr-5"></span>Xóa
                    </button>
                </td>
            </tr>
        );
    }
}

export default UserItem;
