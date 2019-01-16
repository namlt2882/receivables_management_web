import React, { Component } from 'react';

class CreateNewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            status: false
        }
    }

    componentWillMount() {
        if (this.props.task) {
            this.setState({
                id: this.props.task.id,
                username: this.props.task.username,
                password: this.props.task.password,
                status: this.props.task.status
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.task) {
            this.setState({
                id: nextProps.task.id,
                username: nextProps.task.username,
                password: nextProps.task.password,
                status: nextProps.task.status
            });
        }
    }

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        if (name === 'status') {
            value = target.value === 'true' ? true : false;
        }
        this.setState({
            [name]: value
        });
    }
    onSubmit = (event) => {
        event.preventDefault();
        //console.log(this.state);
        this.props.onSubmit(this.state);
        //cancel and close form
        this.onClear();
        this.onCloseForm();
    }

    onCloseForm = () => {
        this.props.onCloseForm();
    }

    onClear = () => {
        this.setState({
            username: '',
            password: '',
            status: false
        });
    }

    render() {
        // var { id } = this.state;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        Create New User
                        <span
                            className="fas fa-user-plus ml-5">
                        </span>
                    </h3>
                </div>
                <div className="panel-body">
                    <form onSubmit={this.onSubmit} >
                        <div className="form-group">
                            <label>Username: </label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                value={this.state.username}
                                onChange={this.onChange}

                            />
                            <label>Password: </label>
                            <input
                                type="text"
                                className="form-control"
                                name="password"
                                value={this.state.password}
                                onChange={this.onChange}
                            />
                        </div>
                        <label>Status: </label>
                        <select
                            className="form-control"
                            name="status"
                            value={this.state.status}
                            onChange={this.onChange}
                        >
                            <option value={true}>Active</option>
                            <option value={false}>InActive</option>
                        </select><br />
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning">
                                <span className="fa fa-plus mr-5"></span>Save
                    </button>&nbsp;
                    <button
                                type="button"
                                className="btn btn-danger"
                                onClick={this.onClear}
                            >
                                <span className="fa fa-plus mr-5"></span>Cancel
                    </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default CreateNewUser;
