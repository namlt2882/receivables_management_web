import React, { Component } from 'react';
import ConfirmModal from '../modal/ConfirmModal';
import { UserService } from '../../services/user-service';
import { withRouter } from 'react-router-dom';

class UserItem extends Component {

    constructor() {
        super();
        this.state = {
            modalShow: false,
            message: '',
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    openModal(user) {
        if (user) {
            let tmpMes = 'Are you sure want active ' + user.Username + '?';
            if (!user.IsBanned) {
                tmpMes = 'Are you sure want ban ' + user.Username + '?';
            }
            this.setState({
                message: tmpMes,
                modalShow: true
            });
        }
    }

    openDetailPage(userId) {
       if(userId){
           this.props.history.push(`/users/${userId}/view`);
       }
    }

    callbackFromModal(user) {
        user.IsBanned = !user.IsBanned;
        this.setState({ modalShow: false });
        UserService.updateCollector(user).then(res => {
            if (res.status === 200) {
                this.props.history.push('/users');
            } else if (res.status) {
                prompt('Failed to execuaction');
            }
        });
    }

    render() {
        var { user, index } = this.props;

        let modalClose = () => {
            this.setState({
                modalShow: false
            });
            window.event.stopPropagation();
        };


        return (
            <tr className="users-item" >
                <td>{index + 1}</td>
                <td className="userNameCol" onClick={this.openDetailPage.bind(this, user.Id)} style={{ cursor: "pointer", textDecoration: "underline" }}>{user.Username}</td>
                <td className="fullNameCol">{user.LastName + ' ' + user.FirstName}</td>
                <td className="noOfAssignedReceivableCol"> {user.NumberOfAssignedReceivables}</td>
                <td className="userStatusCol">
                    <p style={{ display: user.IsBanned ? 'none' : 'inline-block' }} className="btn btn-success main-message">
                        Active
                    </p>
                    <p style={{ display: user.IsBanned ? 'inline-block' : 'none' }} className="btn btn-warning main-message">
                        Banned
                    </p>
                    <p className="btn hover-message" onClick={(e) => { e.stopPropagation(); this.openModal(user) }}>
                        <i style={{ display: user.IsBanned ? 'none' : 'inline-block' }}>
                            Ban  this user?
                        </i>
                        <i style={{ display: user.IsBanned ? 'inline-block' : 'none' }}>
                            Active this user?
                        </i>
                    </p>
                </td>

                <ConfirmModal
                    show={this.state.modalShow}
                    onHide={modalClose}
                    header={'Manage user'}
                    body={this.state.message}
                    object={user}
                    callback={this.callbackFromModal}
                />
            </tr>
        );
    }
}

export default withRouter(UserItem);
