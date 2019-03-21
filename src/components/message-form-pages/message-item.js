import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ConfirmModal from '../modal/ConfirmModal';
import {ProfileMessageFormService} from '../../services/profile-message-form-service';


class MessageItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            message: '',
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    callbackFromModal(message) {
        message.IsDeleted = !message.IsDeleted;
        this.setState({ modalShow: false });
        ProfileMessageFormService.update(message).then(res => {
            if (res.status === 200) {
                this.props.history.push('/messages');
            } else if (res.status) {
                prompt('Failed to execuaction');
            }
        });
    }

    openModal(message) {
        if (message) {
            let tmpMes = 'Are you sure want enable "' + message.Name + '"?';
            if (!message.IsDeleted) {
                tmpMes = 'Are you sure want disable "' + message.Name + '"?';
            }
            this.setState({
                message: tmpMes,
                modalShow: true
            });
        }
    }

    handleClick = (messageId) => {
        if (messageId) {
            this.props.history.push(`/messages/${messageId}/view`);
        }
    }

    render() {
        var { message } = this.props;
        var { index } = this.props;

        let modalClose = () => {
            this.setState({
                modalShow: false
            });
            window.event.stopPropagation();
        };
        return (
            <tr>
                <td>{++index}</td>
                <td className="messageNameCol" onClick={this.handleClick.bind(this, message.Id)}>{message.Name}</td>
                <td className="messageTypeCol">{message.Type === 1 &&
                    "Call"
                }
                    {message.Type === 0 &&
                        "SMS"
                    }
                </td>
                <td className="messageStatusCol" >
                    <p style={{ display: message.IsDeleted ? 'inline-block' : 'none' }} className="btn btn-warning main-message">
                        Disabled
                    </p>
                    <p style={{ display: message.IsDeleted ? 'none' : 'inline-block' }} className="btn btn-success main-message">
                        Enabled
                    </p>
                    <p className="btn hover-message" onClick={(e) => { e.stopPropagation(); this.openModal(message) }}>
                        <i style={{ display: message.IsDeleted ? 'none' : 'inline-block' }}>
                           Disable  this form?
                        </i>
                        <i style={{ display: message.IsDeleted ? 'inline-block' : 'none' }}>
                            Enable this form?
                        </i>
                    </p>
                </td>

                <ConfirmModal
                    show={this.state.modalShow}
                    onHide={modalClose}
                    header={'Manage form'}
                    body={this.state.message}
                    object={message}
                    callback={this.callbackFromModal}
                />
            </tr>
        );
    }
}

export default withRouter(MessageItem);
