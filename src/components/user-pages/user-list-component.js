import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actFilter } from '../../actions/user-action';

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterName: '',
            filterUsername: '',
            filterStatus: -1
        };
    }

    //Bắt sự kiện onChange cho filter
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        var filter = {
            name: name === 'filterName' ? value : this.state.filterName,
            username: name === "filterUsername" ? value : this.state.filterUsername,
            status: name === 'filterStatus' ? value : this.state.filterStatus
        };
        this.props.onFilterTable(filter);
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="hungdtq-Wrapper">
                <div className="hungdtq-Container">
                    <table className="table table-hover userlist">
                        <thead className="thead-blue">
                            <tr>
                                <th>No.</th>
                                <th>
                                    Username
                                </th>
                                <th>Full Name</th>
                                <th>
                                    Status
                                </th>
                                <th>Delete</th>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="filterName"
                                        onChange={this.onChange}
                                        value={this.state.filterName}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="filterUsername"
                                        onChange={this.onChange}
                                        value={this.state.filterUsername}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="form-control"
                                        name="filterStatus"
                                        onChange={this.onChange}
                                        value={this.state.filterStatus}
                                    >
                                        <option value={-1}>All</option>
                                        <option value={0}>Active</option>
                                        <option value={1}>Banned</option>
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
        filterTable: state.filterTable,
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
