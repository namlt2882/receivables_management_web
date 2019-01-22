import React, { Component } from 'react';
import callApi from './../../utils/APICaller';
import { Link } from 'react-router-dom';
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

    componentDidMount() {
        var {match} = this.props;
        if(match) {
            var id = match.params.id;
            callApi(`users/${id}`, 'GET', null).then(res => {
                var data = res.data;
                this.setState({
                    id : data.id,
                    txtName : data.username,
                    txtPassword : data.password,
                    chkbStatus : data.status
                });
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
        var {id, txtName, txtPassword, chkbStatus } = this.state;
        var { history } = this.props;
        if(id) { //Update
            callApi(`users/${id}`, 'PUT', {
                username: txtName,
                password: txtPassword,
                status: chkbStatus
            }).then(res => {
                history.goBack();
            });
        }else {
            callApi('users', 'POST', {
                username: txtName,
                password: txtPassword,
                status: chkbStatus
            }).then(res => {
                history.goBack();
            });
        }
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
                        <label>Status : </label>

                    </div>
                    <div className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="chkbStatus"
                                value={chkbStatus}
                                onChange={this.onChange}
                                checked = {chkbStatus}
                            />
                            Active
                        </label>
                    </div>
                  
                    <button type="submit" className="btn btn-primary">
                        <span className="fas fa-save mr-5"></span>Save
                    </button>&nbsp;&nbsp;&nbsp;
                    <Link to="/user-list" className="btn btn-danger">
                        <span className="fas fa-ban mr-5"></span>Cancel
                    </Link>
                   
                </form>
            </div>
        );
    }
}

export default UserActionPage;
