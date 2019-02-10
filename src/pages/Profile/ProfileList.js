import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchProfilesRequest } from '../../actions/ProfileActions';
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
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile) => (<tr>
                                <td>{profile.id}</td>
                                <td>{profile.name}</td>
                                <td>{profile.description}</td>
                                <td>
                                    <Link to={`/profile/${profile.id}`} className="btn btn-info mb-15">
                                        <span className="fas fa-user-edit mr-5"></span>
                                        View
                                        </Link>
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
            dispatch(fetchProfilesRequest())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileList);