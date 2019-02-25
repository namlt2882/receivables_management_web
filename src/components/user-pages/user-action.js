import React from 'react';
import { Link } from 'react-router-dom';
import { actAddUsersRequest, actGetUserRequest, actUpdateUserRequest } from '../../actions/user-action';
import { connect } from 'react-redux';
import Component from '../common/component'
import { available } from '../common/loading-page';

class UserActionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            txtPassword: '',
            chkbStatus: ''
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
        if(nextProps && nextProps.itemEditing) {
            var {itemEditing} = nextProps;
            this.setState({
                id : itemEditing.id,
                txtName : itemEditing.username,
                txtPassword : itemEditing.password,
                chkbStatus : itemEditing.status
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
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">

                <form onSubmit={this.onSave}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input
                            type="text"
                            className="form-control"
                            name="txtName"
                            value={txtName}
                            onChange={this.onChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input
                            type="text"
                            className="form-control"
                            name="txtPassword"
                            value={txtPassword}
                            onChange={this.onChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status: </label>

                    </div>
                    <div className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="chkbStatus"
                                value={chkbStatus}
                                onChange={this.onChange}
                                checked={chkbStatus}
                            />
                            Unban
                        </label>
                    </div>

                    <button>Save</button>&nbsp;&nbsp;&nbsp;
                    <Link to="/user-list">Cancel</Link>

                </form>
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