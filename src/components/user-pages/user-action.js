import React from 'react';
import { UserService } from '../../services/user-service';
import { UserAction } from '../../actions/user-action';
import { connect } from 'react-redux';
import { available1 } from '../common/loading-page';
import Component from '../common/component';
import ConfirmModal from '../modal/ConfirmModal';



class UserDetailPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            message: '',
            isEditMode: false,
            firstName: '',
            lastName: '',
            address: '',
            username: '',
            isBanned: false,
            user: null,
            id: null,
            password: '',
            viewMode: 2
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.banUser = this.banUser.bind(this);
    }

    callbackFromBanModal() {
        let user = {
            Id: this.state.id,
            LastName: this.state.lastName,
            FirstName: this.state.firstName,
            Address: this.state.address,
            Username: this.state.username,
            IsBanned: this.state.isBanned,
        }
        this.setState({ modalShow: false });
        UserService.updateCollector(user).then(res => {
            if (res.status === 200) {
                this.props.history.push(`/users/${user.Id}/view`);
            } else if (res.status) {
                prompt('Failed to execuaction');
            }
        });
    }

    banUser() {
        let tmpMes = 'Are you sure want active ' + this.state.username + '?';
        if (!this.state.isBanned) {
            tmpMes = 'Are you sure want ban ' + this.state.username + '?';
            this.setState({
                message: tmpMes,
                modalShow: true
            });
        }
    }

    changeMode() {
        this.setState({
            viewMode: 1
        })
    }

    callbackFromModal() {
        this.setState({ modalShow: false });
        if (this.state.id) {
            UserService.updateCollector(this.state.user).then(res => {
                if (res.status === 200) {
                    this.props.history.push(`/users/${this.props.match.params.id}/view`);
                    this.setState({
                        viewMode: 0
                    });
                } else if (res.status) {
                    prompt('Failed to execuaction');
                }
            });
        } else {
            UserService.addCollector(this.state.user).then(res => {
                if (res.status === 201) {
                    this.props.history.push(`/users/`);
                } else if (res.status) {
                    prompt('Failed to execute action');
                }
            });
        }

    }

    openModal() {
        var { match } = this.props;
        let tmpMes = 'Are you sure want add new user?';
        if (match) {
            if (match.params.id) {
                tmpMes = 'Are you sure want edit?';
            }
        }

        this.setState({
            user: {
                id: this.state.id,
                UserName: this.state.username,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                isBanned: this.state.isBanned,
                Address: this.state.address,
                Password: this.state.password
            },
            message: tmpMes,
            modalShow: true
        });
    }

    componentDidMount() {

        var { match } = this.props;
        if (match) {
            let id = match.params.id;
            if (id) {
                document.title = "Collector detail";
                this.setState({
                    viewMode: 0
                });
                UserService.getCollectorDetail(id).then(res => {
                    this.props.getUser(res.data);
                    this.incrementLoading();
                    this.setState({
                        id: id,
                        lastName: res.data.LastName,
                        firstName: res.data.FirstName,
                        address: res.data.Address,
                        username: res.data.UserName,
                        isBanned: res.data.IsBanned,
                        password: res.data.Password
                    });
                });
            }

        } else {
            document.title = "Add new collector";
        }
        available1();

    }

    onUsernameChange(e) {
        this.setState({
            username: e.target.value
        })
    }

    onFirstNameChange(e) {
        this.setState({
            firstName: e.target.value
        })
    }

    onLastNameChange(e) {
        this.setState({
            lastName: e.target.value
        })
    }

    onAddressChange(e) {
        this.setState({
            address: e.target.value
        })
    }

    onClear() {
        let user = this.props.user;
        if (user.Id) {
            this.setState({
                lastName: user.LastName,
                firstName: user.FirstName,
                address: user.Address,
                username: user.UserName,
            });
        } else {
            this.setState({
                lastName: '',
                firstName: '',
                address: '',
                username: '',
            });
        }

    }

    render() {

        var viewMode = this.state.viewMode;
        let modalClose = () => {
            this.setState({
                modalShow: false
            });
            window.event.stopPropagation();
        };
        return (
            <div style={{
                width: "100%", paddingTop: "10px"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                    <div className="hungdtq-header">
                        <h1>User detail</h1>
                    </div>
                    <div className="hungdtq-Wrapper">
                        <div className="hungdtq-Container" style={{ paddingTop: "2rem" }}>
                            <table className="UserDetailTable">
                                <tbody>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Username</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                disabled
                                                type="text"
                                                className="form-control disabled"
                                                value={this.state.username}
                                                onChange={this.onUsernameChange}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr style={{ display: (viewMode !== 0 && localStorage.id == this.state.id) ? ' table-row' : 'none' }}>
                                        <td className="UserDetailTable-Col1">Password</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.state.password}
                                                onChange={this.onPasswordChange}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Firstname</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                className="form-control"
                                                value={this.state.firstName}
                                                onChange={this.onFirstNameChange}
                                            />
                                            <input
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="form-control disabled"
                                                type="text"
                                                value={this.state.firstName}
                                                onChange={this.onFirstNameChange}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Lastname</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                className="form-control"
                                                value={this.state.lastName}
                                                onChange={this.onLastNameChange}
                                            />
                                            <input
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="form-control disabled"
                                                type="text"
                                                value={this.state.lastName}
                                                onChange={this.onLastNameChange}
                                            />
                                        </td>
                                        <td></td>

                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Address</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                value={this.state.address ? this.state.address : ''}
                                                onChange={this.onAddressChange}
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="form-control disabled"
                                                value={this.state.address ? this.state.address : ''}
                                                onChange={this.onAddressChange}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr></tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1"></td>
                                        <td className="UserDetailTable-Col2"></td>
                                        <td className="UserDetailTable-Col3">
                                            <button style={{ display: viewMode === 0 ? 'inline-block' : 'none', width: '10rem' }} className="btn btn-primary" onClick={(e) => { e.stopPropagation(); this.changeMode() }}>Edit</button>
                                            <button style={{ display: viewMode === 1 ? 'inline-block' : 'none', width: '10rem' }} className="btn btn-primary" onClick={(e) => { e.stopPropagation(); this.openModal() }}>Save</button>
                                            <button style={{ width: '10rem', display: viewMode === 2 ? 'inline-block' : 'none' }} className="btn btn-primary" onClick={(e) => { e.stopPropagation(); this.openModal() }}>Submit</button>
                                            <button style={{ display: viewMode !== 0 ? 'inline-block' : 'none', width: '5rem' }} className="btn btn-basic" onClick={this.onClear}>Reset</button>
                                            {/*<button style={{ display: (viewMode === 0 && !this.state.IsBanned && localStorage.role === 'Admin') ? 'inline-block' : 'none', width: '6rem' }} className="btn btn-basic" onClick={(e) => { e.stopPropagation(); this.banUser() }}>Ban</button>
                                            <button style={{ display: (viewMode === 0 && this.state.IsBanned && localStorage.role === 'Admin') ? 'inline-block' : 'none', width: '6rem' }} className="btn btn-success" onClick={(e) => { e.stopPropagation(); this.banUser() }}>Active</button>
        */}
                                            </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <ConfirmModal
                    show={this.state.modalShow}
                    onHide={modalClose}
                    header={'Manage user'}
                    body={this.state.message}
                    object={this.state.user}
                    callback={this.callbackFromModal}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.users,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getUser: (user) => {
            dispatch(UserAction.setUser(user));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailPage);

