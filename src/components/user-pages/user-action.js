import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { UserAction } from '../../actions/user-action';
import { UserService } from '../../services/user-service';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import ConfirmModal from '../modal/ConfirmModal';
import { successAlert, errorAlert } from '../common/my-menu'

const lastnameChangeMessageErr = "Last name is required";
const firstnameChangeMessageErr = "First name is required";
const usernameChangeMessageErr = "User name must have 5 to 100 characters";

class UserDetailPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            maxLoading: 1,
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
            viewMode: 2,

            usernameInputErr: true,
            usernameChangeMessageErr: '',

            fisrtnameInputErr: true,
            firstNameChangeMessageErr: '',

            lastnameInputErr: true,
            lastnameChangeMessageErr: '',
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.banUser = this.banUser.bind(this);

        this.onUsernameBlur = this.onUsernameBlur.bind(this);
        this.onFirstnameBlur = this.onFirstnameBlur.bind(this);
        this.onLastnameBlur = this.onLastnameBlur.bind(this);
    }

    onUsernameBlur(e) {
        let value = e.target.value;
        if (value.length < 5 || value.length > 100) {
            this.setState({
                usernameInputErr: true,
                usernameChangeMessageErr: usernameChangeMessageErr
            });
        } else {
            this.setState({
                usernameInputErr: false,
                usernameChangeMessageErr: ''
            });
        }
    }

    onFirstnameBlur(e) {
        let value = e.target.value;
        if (value.length < 1) {
            this.setState({
                fisrtnameInputErr: true,
                firstNameChangeMessageErr: firstnameChangeMessageErr
            });
        } else {
            this.setState({
                fisrtnameInputErr: false,
                firstNameChangeMessageErr: ''
            });
        }
    }

    onLastnameBlur(e) {
        let value = e.target.value;
        if (value.length < 1) {
            this.setState({
                lastnameInputErr: true,
                lastnameChangeMessageErr: lastnameChangeMessageErr
            });
        } else {
            this.setState({
                lastnameInputErr: false,
                lastnameChangeMessageErr: ''
            });
        }
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
                this.props.history.push(`/users/${this.props.match.params.id}/view`);
                this.setState({
                    viewMode: 0
                });
                successAlert(`The new collector "${this.state.firstName + ' ' + this.state.lastName}" has been updated!`)
            }).catch(err => {
                console.error(err);
                errorAlert('Failed to execute this action, please try again later!');
            });
        } else {
            UserService.addCollector(this.state.user).then(res => {
                this.props.history.push(`/users/`);
                successAlert(`The new collector "${this.state.firstName + ' ' + this.state.lastName}" has been created!`)
            }).catch(err => {
                console.error(err);
                errorAlert('Failed to execute this action, please try again later!');
            });
        }

    }

    openModal() {
        let { usernameInputErr, lastnameInputErr, fisrtnameInputErr } = this.state;
        if (usernameInputErr || lastnameInputErr || fisrtnameInputErr) {
            return;
        }

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
                        password: res.data.Password,

                        fisrtnameInputErr: false,
                        lastnameInputErr: false,
                        usernameInputErr: false
                    });
                });
            } else {
                this.incrementLoading();
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
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
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
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>{this.state.viewMode === 0 ? 'User detail' : 'New user'}</h1>
                            </div>
                            <div className="d-inline-block hungdtq-headerbtn-container">
                                <div className="btn btn-rcm-primary rcm-btn" onClick={() => {
                                    this.props.history.push('/users');
                                }}>
                                    <a><i className="fas fa-arrow-left"></i></a>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
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
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                type="text"
                                                className="rcm-form-control hungdtq-disabled"
                                                value={this.state.username}
                                            />
                                            <input
                                                disabled
                                                type="text"
                                                className="rcm-form-control"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none', width: "40%" }}
                                                value={this.state.username}
                                                onChange={this.onUsernameChange}
                                                autoComplete="off"
                                                onBlur={this.onUsernameBlur}

                                            />
                                        </td>
                                        <td>
                                            <i className="error-validation-message">
                                                {this.state.usernameChangeMessageErr}
                                            </i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Firstname</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none', width: "40%" }}
                                                className="rcm-form-control"
                                                value={this.state.firstName}
                                                onChange={this.onFirstNameChange}
                                                autoComplete="off"
                                                onBlur={this.onFirstnameBlur}
                                            />
                                            <input
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="rcm-form-control hungdtq-disabled"
                                                type="text"
                                                value={this.state.firstName}
                                            />
                                        </td>
                                        <td>
                                            <i className="error-validation-message">
                                                {this.state.firstNameChangeMessageErr}
                                            </i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Lastname</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none', width: "40%" }}
                                                className="rcm-form-control"
                                                value={this.state.lastName}
                                                onChange={this.onLastNameChange}
                                                autoComplete="off"
                                                onBlur={this.onLastnameBlur}
                                            />
                                            <input
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="rcm-form-control hungdtq-disabled"
                                                type="text"
                                                value={this.state.lastName}
                                            />
                                        </td>
                                        <td>
                                            <i className="error-validation-message">
                                                {this.state.lastnameChangeMessageErr}
                                            </i>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Address</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                className="rcm-form-control"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                value={this.state.address ? this.state.address : ''}
                                                onChange={this.onAddressChange}
                                                autoComplete="off"
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="rcm-form-control hungdtq-disabled"
                                                value={this.state.address ? this.state.address : ''}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr></tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1"></td>
                                        <td className="UserDetailTable-Col2"></td>
                                        <td className="UserDetailTable-Col3" style={{ paddingTop: '1.5rem' }}>
                                            <Button color='primary' style={{ display: viewMode === 0 ? 'inline-block' : 'none', width: '10rem' }}
                                                onClick={(e) => { e.stopPropagation(); this.changeMode() }}>Edit</Button>

                                            <Button color='primary' style={{ display: viewMode === 1 ? 'inline-block' : 'none', width: '10rem' }}
                                                onClick={(e) => { e.stopPropagation(); this.openModal() }}>Save</Button>
                                            <Button color='primary' style={{ width: '10rem', display: viewMode === 2 ? 'inline-block' : 'none' }}
                                                onClick={(e) => { e.stopPropagation(); this.openModal() }}>Submit</Button>
                                            <Button style={{ display: viewMode !== 0 ? 'inline-block' : 'none', width: '10rem' }}
                                                onClick={this.onClear}>Reset</Button>
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
        user: state.user,
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

