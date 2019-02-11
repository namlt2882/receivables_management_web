import React, { Component } from 'react';
import Process from './../../components/Process/Process'

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (<div>
            {this.props.readonly ? 'View profile' : 'Edit profile'}
            <Process />
        </div>);
    }
}

export default EditProfile;