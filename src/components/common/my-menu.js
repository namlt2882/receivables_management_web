import * as signalR from '@aspnet/signalr';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAddressBook, faBell, faChalkboardTeacher, faChartLine, faCommentAlt, faCreditCard, faSignOutAlt, faTasks, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, Nav, Navbar, NavbarBrand, NavItem, Popover, PopoverBody } from 'reactstrap';
import { Button } from 'semantic-ui-react';
import { ReceivableAction } from '../../actions/receivable-action';
import { SERVER_IP } from '../../constants/config';
import { AuthService, isLoggedIn } from '../../services/auth-service';
import { NotificationService } from '../../services/notification-service';
import { ReceivableService } from '../../services/receivable-service';
import NewAssignedReceivable from '../receivable-pages/new-assigned-receivable';
import './common.scss';
import { SmsAndPhonecallAction } from '../../actions/sms-and-phonecall-action';
library.add(faBell, faUserCircle, faCreditCard,
    faChartLine, faUsers, faCommentAlt, faChalkboardTeacher, faSignOutAlt, faTasks, faAddressBook);

class MyMenu extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            dropdownProfile: false
        };
        this.toggleProfile = this.toggleProfile.bind(this);
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    toggleProfile() {
        this.setState(prevState => ({
            dropdownProfile: !prevState.dropdownProfile
        }));
    }

    render() {
        return (
            <div className='navbar-holder'>
                <div className="navbar-color">
                    <Navbar expand="md">
                        <NavbarBrand >
                            <Link to='/'>
                                <strong className="c-white">
                                    RCM
                                </strong>
                            </Link>
                        </NavbarBrand>
                        <Nav className="ml-auto" navbar>
                            <MyProfileWithRouter dropdownProfile={this.state.dropdownProfile}
                                toggleProfile={this.toggleProfile} />
                            <ConnectedNotification history={this.props.history} dropdownProfile={this.state.dropdownProfile} />
                        </Nav>
                    </Navbar>
                </div>
            </div>
        );
    }
}

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    viewProfile() {

    }

    render() {
        let name = localStorage.getItem('username');
        return (<NavItem className='nav-icon'>
            <div style={{ paddingTop: '2px' }}>
                <Dropdown isOpen={this.props.dropdownProfile} toggle={this.props.toggleProfile}
                    className='my-profile'>
                    <DropdownToggle className='transparent-button' style={{ boxShadow: 'none' }}>
                        <strong>{name} <i className="fas fa-angle-down"></i></strong>
                    </DropdownToggle>
                    <DropdownMenu className='nav-icon-panel row justify-content-center align-self-center'>
                        <DropdownItem onClick={() => { this.props.history.push(`/users/${localStorage.id}/view`) }}>
                            My profile
                            </DropdownItem>
                        <DropdownItem onClick={() => {
                            AuthService.logout();
                        }}>
                            <FontAwesomeIcon icon='sign-out-alt' color='black' size='sm' />
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </NavItem>);
    }
}

const MyProfileWithRouter = withRouter(MyProfile)


class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownNoti: false,
            mouseInNoti: false,
            connection: null,
            notifications: [],
            unseenNoti: 0,
            openModal: false,
            modalContent: null
        }
        this.openNoti = this.openNoti.bind(this);
        this.closeNoti = this.closeNoti.bind(this);
        this.checkMouseInNoti = this.checkMouseInNoti.bind(this);
        this.checkMouseOutNoti = this.checkMouseOutNoti.bind(this);
        this.createNotification = this.createNotification.bind(this);
        this.type11Action = this.type11Action.bind(this);
        this.type12Action = this.type12Action.bind(this);
        this.type14Action = this.type14Action.bind(this);
        this.type15Action = this.type15Action.bind(this);
        this.getAction = this.getAction.bind(this);
        this.start = this.start.bind(this);
    }

    componentDidMount() {
        NotificationService.getMyNotification().then(res => {
            let notifications = res.data;
            this.setState({
                notifications: notifications
            })
            let unseen = notifications.reduce((acc, n) => {
                if (n.IsSeen) {
                    return acc;
                } else {
                    return acc + 1;
                }
            }, 0);
            this.setState({ unseenNoti: unseen });
        })
        isLoggedIn(() => {
            const protocol = new signalR.JsonHubProtocol();
            // Singalr
            let connection = new signalR.HubConnectionBuilder()
                .withUrl(`${SERVER_IP}/centerHub?access_token=${localStorage.getItem('access_token')}`)
                .configureLogging(signalR.LogLevel.Information)
                .withHubProtocol(protocol)
                .build();
            connection.serverTimeoutInMilliseconds = 86400000;//1 day
            connection.on('Notify', (notification) => {
                this.setState(pre => ({ unseenNoti: ++pre.unseenNoti }));
                notification = JSON.parse(notification);
                this.state.notifications.unshift(notification);
                this.setState({ notifications: this.state.notifications })
                this.createNotification('info', notification.Title, notification.Body, this.getAction(notification));
            })
            connection.start({ xdomain: true }).then(() => {
                this.setState({
                    connection: connection
                })
            }).catch(err => {
                console.error(err.toString())
            })
            connection.onclose(async () => {
                await this.start();
            });
        })
    }

    start = async () => {
        let connection = this.state.connection;
        if (connection) {
            try {
                await connection.start();
                console.log("connected");
            } catch (err) {
                console.log(err);
                setTimeout(() => this.start(), 5000);
            }
        }
    };


    getAction({ Id, Type, NData, IsSeen }) {
        let action = () => { };
        let modalContent = null;
        let openModal = true;
        switch (Type) {
            case 11:
                action = this.type11Action(JSON.parse(NData));
                modalContent = <NewAssignedReceivable history={this.props.history} />
                break;
            case 12:
                action = this.type12Action(parseInt(NData));
                openModal = false;
                break;
            case 14: action = this.type14Action(parseInt(NData));
                openModal = false;
                break;
            case 15: action = this.type15Action(parseInt(NData));
                openModal = false;
                break;
            case 16: action = this.type16Action(parseInt(NData));
                openModal = false;
                break;
        }
        return () => {
            action();
            if (openModal) {
                this.setState({
                    dropdownNoti: false,
                    mouseInNoti: false,
                    modalContent: modalContent,
                    openModal: true
                });
            }
            //send if IsSeen = false
            if (!IsSeen) {
                this.setState(pre => ({
                    unseenNoti: --pre.unseenNoti
                }))
                NotificationService.toggleSeen(Id).then(res => {
                    let noti = this.state.notifications.find(n => n.Id === Id);
                    if (noti) {
                        noti.IsSeen = true;
                    }
                })
            }
        }
    }

    type16Action(id) {
        return () => {
            this.props.history.push(`/receivable/${id}/view`);
        }
    }

    type15Action(id) {
        return () => {
            this.props.setSmsAndPhonecallOpen();
            this.props.history.push(`/receivable/${id}/view`);
        }
    }

    type14Action(id) {
        return () => {
            this.props.history.push(`/receivable/${id}/view`);
        }
    }

    type12Action(id) {
        return () => {
            this.props.history.push(`/receivable/${id}/view`);
        }
    }

    type11Action(ids) {
        return () => {
            this.props.setNewIds(ids);
            this.props.setReceivables([]);
            ReceivableService.getReceivablesByIds(ids).then(res => {
                let list = res.data;
                this.props.setReceivables(list);
            })
        }
    }

    createNotification = (type, title, message, callback) => {
        if (callback === undefined) {
            callback = () => { }
        }
        switch (type) {
            case 'info':
                NotificationManager.info(message, title, 5000, () => {
                    callback();
                });
                break;
            case 'success':
                NotificationManager.success(message, title, 5000, () => {
                    callback();
                });
                break;
            case 'warning':
                NotificationManager.warning(message, title, 5000, () => {
                    callback();
                });
                break;
            case 'error':
                NotificationManager.error(message, title, 5000, () => {
                    callback();
                });
                break;
        }
    };

    openNoti() {
        if (this.state.dropdownNoti) {
            this.setState({ dropdownNoti: false, mouseInNoti: false });
        } else {
            this.setState({
                dropdownNoti: true,
                mouseInNoti: true
            });
        }
    }

    closeNoti() {
        this.setState({ dropdownNoti: false });
    }

    checkMouseInNoti() {
        this.setState({ mouseInNoti: true })
    }

    checkMouseOutNoti() {
        this.setState({ mouseInNoti: false })
    }

    render() {
        if (this.props.dropdownProfile) {
            this.state.dropdownNoti = false;
            this.state.mouseInNoti = false;
        }
        let isOpen = !this.props.dropdownProfile && (this.state.dropdownNoti || this.state.mouseInNoti);
        return (<NavItem className='nav-icon'>
            <div>
                <button ref='btnNoti' id="popover-noti" type='button' className='transparent-button' onBlur={this.closeNoti}>
                    <FontAwesomeIcon icon='bell' color='white' size='lg' className='noti-item-icon'
                        style={{ opacity: (isOpen ? '1' : '0.7') }} />
                </button>
                <NotificationContainer />
                <Popover placement="bottom" target="popover-noti"
                    isOpen={isOpen}
                    toggle={this.openNoti} onMouseMove={this.checkMouseInNoti}
                    onMouseOut={this.checkMouseOutNoti}>
                    <PopoverBody style={{ maxHeight: '500px', overflowY: 'scroll', padding: '0px' }} className='noti'>
                        {this.state.notifications.map((n, i) => {
                            let date = new Date(n.CreatedDate);
                            let className = 'noti-item';
                            className += n.IsSeen ? ' readed-noti' : ' not-readed-noti';
                            return <div className={className} onClick={() => { this.getAction(n)() }}>
                                <div className='noti-item-body'>
                                    {n.Body}
                                </div>
                                <span><i>{`At ${date.toLocaleString()}`}</i></span>
                            </div>
                        }
                        )}
                    </PopoverBody>
                </Popover>
            </div>
            <span className='unseen-noti' style={{ display: this.state.unseenNoti == 0 ? 'none' : 'block' }} onClick={() => {
                this.refs.btnNoti.click();
            }}>{this.state.unseenNoti}</span>
            <Modal isOpen={this.state.openModal} className='big-modal'>
                <ModalBody>
                    {this.state.modalContent}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={() => {
                        this.setState({
                            openModal: false,
                            modalContent: null
                        })
                    }}>Close</Button>
                </ModalFooter>
            </Modal>
        </NavItem>);
    }
}

const mapStateToProps = state => {
    return {
        newReceiavbleIds: state.newReceiavbleIds,
        smsAndPhonecall: state.smsAndPhonecall
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setNewIds: (ids) => {
            dispatch(ReceivableAction.setNewReceivableIds(ids))
        },
        setReceivables: (list) => {
            dispatch(ReceivableAction.setReceivableList2(list));
        },
        setSmsAndPhonecallOpen: () => {
            dispatch(SmsAndPhonecallAction.setOpen(true));
        }
    }
}

export const infoAlert = (message, callback = () => { }) => {
    NotificationManager.info(message, '', 3000, callback);
}

export const errorAlert = (message, callback = () => { }) => {
    NotificationManager.error(message, '', 3000, callback);
}

export const successAlert = (message, callback = () => { }) => {
    NotificationManager.success(message, '', 3000, callback);
}

const ConnectedNotification = connect(mapStateToProps, mapDispatchToProps)(Notification)

export default withRouter(MyMenu);
