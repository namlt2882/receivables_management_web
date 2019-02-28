import React from 'react';
import { available, loading } from './loading-page';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.incrementLoading = this.incrementLoading.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }
    componentDidMount() {
        available(resolve => setTimeout(resolve, 400));
    }
    componentWillUnmount() {
        loading(resolve => setTimeout(resolve, 0));
    }
    incrementLoading() {
        let loading = this.state.loading;
        if (loading === undefined) {
            loading = 0;
        }
        this.setState({ loading: ++loading });
    }
    isLoading() {
        let loading = this.state.loading;
        if (loading === undefined) {
            loading = 0;
        }
        return loading < this.state.maxLoading;
    }
    render() {
        return (<div></div>);
    }
}

export default Component;