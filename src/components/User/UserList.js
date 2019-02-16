import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actFilter } from './../../actions/UserAction';

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterName : '',
            filterStatus : -1
        };
    }

    //Bắt sự kiện onChange cho filter
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        var filter = {
            name : name === 'filterName' ? value : this.state.filterName,
            status : name === 'filterStatus' ? value : this.state.filterStatus
        };
        this.props.onFilterTable(filter);
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title text-center">User List</h3>
                </div>
                <div className="panel-body">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User Code</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            <tr>
                        <td></td>
                        <td></td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                name="filterName"
                                onChange = {this.onChange}
                                value = {this.state.filterName}
                            />
                        </td>
                        <td></td>
                        <td>
                            <select
                                className="form-control"
                                name="filterStatus"
                                onChange = {this.onChange}
                                value = {this.state.filterStatus}
                            >
                                <option value={-1}>All</option>
                                <option value={0}>Ban</option>
                                <option value={1}>Unban</option>
                            </select>
                        </td>
                        <td></td>
                    </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
        filterTable : state.filterTable,
        sort: state.sort
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onFilterTable: (filter) => {
            dispatch(actFilter(filter));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
