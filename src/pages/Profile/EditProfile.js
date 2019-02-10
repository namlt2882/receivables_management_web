import React, { Component } from 'react';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (<div>{this.props.readonly ? 'View profile' : 'Edit profile'}</div>);
    }
}

export default EditProfile;