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
                                <th className="userNameCol">
                                    Username
                                </th>
                                <th className="fullNameCol">Full Name</th>
                                <th className="noOfAssignedReceivableCol">
                                    No. Of Assigned Receivable
                                </th>
                                <th className="userStatusCol">
                                    Status
                                </th>

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
                                <td></td>
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
