import React from 'react';
import { available, loading } from './loading-page';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        available(resolve => setTimeout(resolve, 400));
    }
    componentWillUnmount() {
        loading(resolve => setTimeout(resolve, 0));
    }

    render() {
        return (<div></div>);
    }
}

export default Component;