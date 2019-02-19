import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProfileRequest } from '../../actions/ProfileActions';
import { Link } from 'react-router-dom';

class ProfileList extends Component {

    componentDidMount() {
        this.props.fetchAllProfiles();
    }

    render() {
        var profiles = this.props.profiles;
        return (<div>
            <Link to="/profile/add" className="btn btn-info mb-15">Add Profile</Link>
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h3 className="panel-title text-center">Profile list</h3>
                </div>
                <div className="panel-body">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Profile name</th>
                                {/* <th>Customer</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile) => (<tr>
                                <td>{profile.Id}</td>
                                <td>{profile.Name}</td>
                                {/* <td>{profile.customer !== null ? profile.customer.name : ''}</td> */}
                                <td>
                                    <Link to={`/profile/${profile.Id}`}>View</Link>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        profiles: state.profiles
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllProfiles: () => {
            dispatch(ProfileRequest.fetchProfiles())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileList);