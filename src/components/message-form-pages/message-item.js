import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
                    <Link to={`/message/${message.id}/edit`}>View</Link>
                </td>
            </tr>
        );
    }
}

export default MessageItem;
