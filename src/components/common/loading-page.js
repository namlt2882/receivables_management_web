import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
export const available1 = () => {
    available(resolve => setTimeout(resolve, 400));
}
export const available = (action) => {
    new Promise(action).then(() => {
        setAvailable()
    });
}

export const loading = (action) => {
    new Promise(action).then(() => {
        setLoading()
    });
}

const setAvailable = () => {
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
        ele.classList.add('available')
    }
}

const setLoading = () => {
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
        ele.classList.remove('available')
    }
}

export class PrimaryLoadingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (<div className='col-sm-12 row justify-content-center align-self-center'
            style={{ paddingTop: '50px' }}>
            <Spinner color='primary' /><i style={{ marginLeft: '10px' }}>Please wait ...</i>
        </div>);
    }
}
