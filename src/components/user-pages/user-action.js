import React from 'react';
import { Link } from 'react-router-dom';
import { actAddUsersRequest, actGetUserRequest, actUpdateUserRequest } from '../../actions/user-action';
import { connect } from 'react-redux';
import Component from '../common/component'
import { available } from '../common/loading-page';

import './user.scss';

class UserActionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtPassword: '',
            txtConfirm: '',
            txtUsername: '',
            txtLastname: '',
            txtFirstName: '',
        };
    }
    // Dispatch action và lưu itemEditing vào store
    componentDidMount() {
        available(resolve => setTimeout(resolve, 400));
        var { match } = this.props;
        if (match) {
            var id = match.params.id;
            this.props.onEditUser(id);
        }
    }
    // Nhận lại props sau khi mapStateToProps
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.itemEditing) {
            var { itemEditing } = nextProps;
            this.setState({
                id: itemEditing.id,
                txtUsername: itemEditing.username,
                txtPassword: itemEditing.password,
                txtConfirm: itemEditing.txtConfirm,
                txtFirstName: itemEditing.txtFirstName,
                txtLastname: itemEditing.txtLastname
            });
        }
    }

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    onSave = (event) => {
        event.preventDefault();
        var { id, txtName, txtPassword, chkbStatus } = this.state;
        var { history } = this.props;
        var user = {
            id: id,
            username: txtName,
            password: txtPassword,
            status: chkbStatus
        };
        if (id) { // Update
            this.props.onUpdateUser(user);
        } else { // Create
            this.props.onAddUser(user);
        }
        history.goBack();
    }

    render() {
        var { txtName, txtPassword, chkbStatus } = this.state;
        return (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="hungdtq-header">
                    <h1>Add new user</h1>
                </div>
                <div className="hungdtq-Wrapper">
                    <div className="hungdtq-Container">
                        <form onSubmit={this.onSave} className="hungdtq-FromControl">

                            <div className="form-group">
                                <label>First Name: </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="txtFirstName"
                                    value={txtPassword}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name: </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="txtLastname"
                                    value={txtPassword}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Username: </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="txtUsername"
                                    value={txtName}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password: </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="txtPassword"
                                    value={txtPassword}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password: </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="txtConfirm"
                                    value={txtPassword}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="hungdtq-btn-holder">
                                <button className="btn btn-primary hungdtq-btn-submit">Submit</button>
                            </div>
                            <div className="hungdtq-btn-holder">
                                <button className="btn btn-warning hungdtq-btn-cancel">Clear</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        itemEditing: state.itemEditing
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddUser: (user) => {
            dispatch(actAddUsersRequest(user));
        },
        onEditUser: (id) => {
            dispatch(actGetUserRequest(id));
        },
        onUpdateUser: (user) => {
            dispatch(actUpdateUserRequest(user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserActionPage);
