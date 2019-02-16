import React, { Component } from 'react';
import {Link} from 'react-router-dom';
class MessageItem extends Component {

    render() {
        var { message } = this.props;
        return (
            <tr>
                <td>{message.id}</td>
                <td>{message.name}</td>
                <td>{message.customer}</td>
                <td>{message.type}</td>
                <td>
                    <Link 
                        to={`/message/${message.id}/edit`} 
                        className="btn btn-primary mr-10"
                        >
                        <span className="fas fa-user-edit mr-5"></span>View
                    </Link>
                </td>
            </tr>
        );
    }
}

export default MessageItem;
