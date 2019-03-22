import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actFilter } from '../../actions/user-action';
import Table from '@material-ui/core/Table';


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
                    <table className="table table-hover table-strip userlist">
                        <thead className="thead-blue">
                            <tr>
                                <th>No.</th>
                                <th>
                                    Username
                                </th>
                                <th>Full Name</th>
                                <th>
                                    No. Of Assigned Receivable
                                </th>
                                <th>
                                    Status
                                </th>

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
